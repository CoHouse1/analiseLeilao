import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/server"

// POST: Atualizar o conteúdo HTML de uma análise
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { htmlContent } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    // Verificar se a análise existe e pertence ao usuário
    const { data: analysis, error: checkError } = await supabase
      .from("analyses")
      .select("id")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()
    
    if (checkError || !analysis) {
      return NextResponse.json({ 
        error: "Análise não encontrada ou você não tem permissão para modificá-la" 
      }, { 
        status: 404 
      })
    }
    
    // Atualizar o conteúdo HTML da análise
    const { error: updateError } = await supabaseAdmin
      .from("analysis_results")
      .update({ html_content: htmlContent })
      .eq("analysis_id", id)
    
    if (updateError) {
      return NextResponse.json({ error: "Erro ao atualizar conteúdo HTML" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}