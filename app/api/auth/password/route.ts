import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// POST: Alterar senha do usuário
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    const { password, currentPassword } = body
    
    if (!password || !currentPassword) {
      return NextResponse.json({ error: "Senhas não fornecidas" }, { status: 400 })
    }
    
    // Verificar a senha atual tentando fazer login
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: session.user.email || '',
      password: currentPassword
    })
    
    if (verifyError) {
      return NextResponse.json({ error: "Senha atual incorreta" }, { status: 401 })
    }
    
    // Atualizar senha utilizando método nativo do Supabase
    const { data, error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Senha alterada com sucesso"
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}