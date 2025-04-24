import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// POST: Alterar e-mail do usuário
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    const { email } = body
    
    if (!email) {
      return NextResponse.json({ error: "E-mail não fornecido" }, { status: 400 })
    }
    
    // Atualizar e-mail utilizando método nativo do Supabase
    const { data, error } = await supabase.auth.updateUser({ email })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Supabase automaticamente envia um e-mail de verificação e exige confirmação
    // antes que o e-mail seja alterado
    
    return NextResponse.json({ 
      success: true, 
      message: "Foi enviado um e-mail de verificação para o novo endereço. Por favor, verifique sua caixa de entrada."
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}