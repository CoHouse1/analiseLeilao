import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/server"

// GET: Obter perfil do usuário com informações de autenticação
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticação
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar dados do usuário da tabela auth.users (via admin para acessar métodos adicionais)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(
      session.user.id
    )
    
    if (authError) {
      return NextResponse.json({ error: "Erro ao buscar dados do usuário" }, { status: 500 })
    }
    
    // Buscar perfil do usuário da tabela profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
    
    if (profileError) {
      return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 })
    }
    
    // Verificar se o MFA está habilitado usando a estrutura correta
    const { data: factorsData, error: mfaError } = await supabase.auth.mfa.listFactors()
    
    if (mfaError) {
      console.error("Erro ao verificar status do MFA:", mfaError)
    }
    
    // Verificar se há algum fator TOTP verificado na lista 'all'
    const hasMFA = factorsData && factorsData.all && 
      factorsData.all.some(factor => factor.factor_type === 'totp' && factor.status === 'verified')

    // Combinando todas as informações
    return NextResponse.json({
      id: session.user.id,
      email: profile.email,
      emailConfirmed: authUser.user?.email_confirmed_at ? true : false,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
      hasMFA: hasMFA || false,
      authProvider: authUser.user?.app_metadata?.provider || 'email'
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// PATCH: Atualizar perfil do usuário
export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    // Extrair dados do corpo
    const { fullName, avatarUrl } = body
    
    // Atualizar perfil
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", session.user.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// PUT: Atualizar avatar do usuário usando storage do Supabase
export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    const formData = await request.formData()
    const avatarFile = formData.get('avatar') as File
    
    if (!avatarFile) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }
    
    // Verificar tipo de arquivo
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(avatarFile.type)) {
      return NextResponse.json({ error: "Formato de arquivo não suportado" }, { status: 400 })
    }
    
    // Gerar nome de arquivo único baseado no ID do usuário
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`
    
    // Upload do arquivo para o storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, avatarFile, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      return NextResponse.json({ error: "Erro ao fazer upload do avatar" }, { status: 500 })
    }
    
    // Gerar URL pública para o avatar
    const { data: urlData } = await supabase.storage
      .from('user-content')
      .getPublicUrl(filePath)
    
    const avatarUrl = urlData.publicUrl
    
    // Atualizar perfil com a nova URL do avatar
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", session.user.id)
      .select()
      .single()
    
    if (profileError) {
      return NextResponse.json({ error: "Erro ao atualizar perfil com novo avatar" }, { status: 500 })
    }
    
    return NextResponse.json({ 
      avatarUrl, 
      success: true,
      profile: profileData
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}