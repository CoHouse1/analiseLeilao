import { NextResponse } from 'next/server'
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { supabaseAdmin } from "@/lib/supabase/server"
import { AnalisePDFParams } from "@/lib/types" 
import { analisar, processarResultadoAnalise } from "@/lib/analysis-service"
import { randomUUID } from "crypto"
import { analisarEditalTask } from '@/src/trigger/analisarEditalTask'

// Erro customizado para API
class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export async function POST(request: Request) {
    try {
        // Obter o token do header Authorization
        const authHeader = request.headers.get('Authorization')
        const accessToken = authHeader?.startsWith('Bearer ') 
            ? authHeader.substring(7) // Remove "Bearer " do início
            : null
            
        const formData = await request.formData()
        
        // Executar análise e obter o resultado
        const resultado = await analisarEdital(formData, accessToken)
        
        // Retornar resposta bem-sucedida
        return NextResponse.json(resultado, { status: 200 })
    } catch (error: any) {
        console.error("Erro na API:", error);
        
        // Retornar resposta de erro
        return NextResponse.json(
            { 
                success: false, 
                message: error.message || "Erro interno do servidor" 
            }, 
            { status: error.statusCode || 500 }
        )
    }
}

export async function analisarEdital(formData: FormData, accessToken: string | null) {
  try {
    if (!accessToken) {
      throw new ApiError("Token de autenticação não fornecido", 401)
    }

    // Usar o token para autenticar o usuário diretamente com o supabaseAdmin
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken)

    if (userError || !user) {
      console.error("Erro ao obter usuário:", userError)
      throw new ApiError("Usuário não autenticado", 401)
    }
    
    // Verificar se o usuário tem créditos suficientes
    const { data: userCredits, error: creditsError } = await supabaseAdmin
      .from("user_credits")
      .select("free_credits, paid_credits")
      .eq("user_id", user.id)
      .single()

    if (creditsError || !userCredits) {
      throw new ApiError("Não foi possível verificar seus créditos", 500)
    }

    const totalCredits = userCredits.free_credits + userCredits.paid_credits

    if (totalCredits < 1) {
      throw new ApiError("Você não tem créditos suficientes para realizar esta análise", 402)
    }

    // Extrair dados do FormData
    const file = formData.get("file") as File
    const fileMatricula = formData.get("fileMatricula") as File || null
    const tipoImovel = formData.get("tipoImovel") as string
    const matricula = formData.get("matricula") as string
    const estado = formData.get("estado") as string
    const cidade = formData.get("cidade") as string
    const instrucoes = formData.get("instrucoes") as string

    // Verificar tamanho dos arquivos (limite de 10MB por arquivo)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB em bytes
    
    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(`O arquivo do edital excede o limite de tamanho permitido (10MB). Tamanho atual: ${(file.size / (1024 * 1024)).toFixed(2)}MB`, 400)
    }
    
    if (fileMatricula && fileMatricula.size > MAX_FILE_SIZE) {
      throw new ApiError(`O arquivo da matrícula excede o limite de tamanho permitido (10MB). Tamanho atual: ${(fileMatricula.size / (1024 * 1024)).toFixed(2)}MB`, 400)
    }

    // Converter o arquivo para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Converter para base64
    const base64 = buffer.toString("base64")
    
    // Processar arquivo de matrícula se existir
    let fileMatriculaBase64 = null
    if (fileMatricula) {
      const matriculaArrayBuffer = await fileMatricula.arrayBuffer()
      const matriculaBuffer = Buffer.from(matriculaArrayBuffer)
      fileMatriculaBase64 = matriculaBuffer.toString("base64")
    }
      
    // Criar um ID único para esta análise
    const id = randomUUID();

    // Criar registro da análise
    const { data: analysis, error: analysisError } = await supabaseAdmin
      .from("analyses")
      .insert({
        id,
        user_id: user.id,
        title: `Análise de ${tipoImovel || "Imóvel"} - ${cidade || "Local não especificado"}`,
        file_name: file.name,
        tipo_imovel: tipoImovel,
        matricula,
        estado,
        cidade,
        instrucoes,
        credits_used: 1,
        status: "processing", // Inicialmente em fila
      })
      .select()
      .single()

    if (analysisError) {
      throw new ApiError("Erro ao registrar análise", 500)
    }

    // Usar créditos do usuário
    const { error: useCreditsError } = await supabaseAdmin.rpc("use_credits", {
      user_uuid: user.id,
      credits_amount: 1,
    })

    if (useCreditsError) {
      throw new ApiError("Erro ao utilizar créditos", 500)
    }

    // Preparar parâmetros para análise
    const params: AnalisePDFParams = {
      id,
      fileName: file.name,
      fileContent: base64,
      tipoImovel,
      matricula,
      estado,
      cidade,
      instrucoes,
    }
    
    // Adicionar arquivo de matrícula se existir
    if (fileMatricula && fileMatriculaBase64) {
      params.fileMatriculaContent = fileMatriculaBase64
      params.fileMatriculaName = fileMatricula.name
    }

    // Iniciar a tarefa em segundo plano através do Trigger.dev
    // (Note que não esperamos a conclusão)
    console.log("Iniciando tarefa de análise em segundo plano", {  params,
      userId: user.id })
    // Enviar a tarefa para o Trigger.dev
    await analisarEditalTask.trigger({
      params,
      userId: user.id
    });

    // Atualizar o status da análise para 'processing'
    await supabaseAdmin
      .from("analyses")
      .update({ status: "processing" })
      .eq("id", id);

    // Retornar resposta imediatamente para o cliente
    return {
      success: true,
      id: id,
      status: "processing",
      title: `Análise de ${tipoImovel || "Imóvel"} - ${cidade || "Local não especificado"}`,
      message: "Sua análise foi iniciada e será processada em segundo plano."
    }
  } catch (error: any) {
    console.error("Erro ao analisar edital:", error)
    
    // Se for uma ApiError, propagar
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Para outros erros, criar uma ApiError genérica
    throw new ApiError(
      error.message || "Falha ao processar o edital. Por favor, tente novamente.",
      error.statusCode || 500
    );
  }
}

// Restante do código permanece igual
interface PaymentParams {
  userId: string
  packageId: string
  amount: number
  credits: number
}

export async function processPayment(params: PaymentParams) {
  try {
    const { userId, packageId, amount, credits } = params

    // Simular processamento de pagamento
    // Em um ambiente real, aqui você integraria com um gateway de pagamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Registrar a transação
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("transactions")
      .insert({
        user_id: userId,
        amount,
        currency: "BRL",
        status: "completed",
        payment_method: "Cartão de Crédito",
        payment_id: `sim_${Date.now()}`,
        credits_added: credits,
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error("Erro ao registrar transação")
    }

    // Adicionar créditos ao usuário
    const { data: userCredits, error: userCreditsError } = await supabaseAdmin
      .from("user_credits")
      .select("id, paid_credits")
      .eq("user_id", userId)
      .single()

    if (userCreditsError) {
      throw new Error("Erro ao buscar créditos do usuário")
    }

    const { error: updateError } = await supabaseAdmin
      .from("user_credits")
      .update({
        paid_credits: userCredits.paid_credits + credits,
      })
      .eq("id", userCredits.id)

    if (updateError) {
      throw new Error("Erro ao atualizar créditos do usuário")
    }

    // Registrar transação de créditos
    await supabaseAdmin.from("credit_transactions").insert({
      user_id: userId,
      amount: credits,
      transaction_type: "purchase",
      description: `Compra de ${credits} créditos`,
    })

    revalidatePath("/creditos")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Erro ao processar pagamento:", error)
    return { success: false, error: "Falha ao processar o pagamento. Por favor, tente novamente." }
  }
}

export async function saveHtmlContent(analysisId: string, htmlContent: string) {
  try {
    const { error } = await supabaseAdmin
      .from("analysis_results")
      .update({ html_content: htmlContent })
      .eq("analysis_id", analysisId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar conteúdo HTML:", error)
    return { success: false, error: "Falha ao salvar o conteúdo HTML." }
  }
}

export const getSupabaseJwt = async () => {
  // Verifica se o cookieStore está sendo acessado corretamente
  const cookieStore = cookies() // Verifique se isso é acessível corretamente no seu contexto

  // Cria o cliente do Supabase com os cookies do servidor
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  // Obtém a sessão do Supabase
  const { data: { session }, error } = await supabase.auth.getSession()

  // Se houver erro, logue-o
  if (error) {
    console.error('Erro ao obter sessão:', error.message)
    return null
  }

  // Verifique se a sessão existe
  if (!session || !session.access_token) {
    console.error('Sessão não encontrada ou token de acesso ausente')
    return null
  }

  // Retorna o token de acesso da sessão
  return session.access_token
}