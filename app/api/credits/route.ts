import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// GET: Obter informações sobre os créditos do usuário
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    // Buscar créditos do usuário
    const { data, error } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", session.user.id)
      .single()
    
    if (error) {
      return NextResponse.json({ error: "Erro ao buscar créditos" }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}