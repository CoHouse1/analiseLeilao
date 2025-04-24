import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// GET: Obter status do MFA e preparar para ativação
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    // Verificar fatores de MFA existentes conforme documentação do Supabase
    const { data, error: factorsError } = await supabase.auth.mfa.listFactors()
    
    if (factorsError) {
      return NextResponse.json({ error: factorsError.message }, { status: 500 })
    }
    
    // Verificar se há algum fator TOTP verificado na lista 'all'
    const hasMFA = data && data.all && data.all.some(factor => 
      factor.factor_type === 'totp' && factor.status === 'verified'
    )
    
    // Se ainda não tem MFA, iniciar o processo
    if (!hasMFA) {
      // Iniciar setup para novo fator TOTP
      const { data: setupData, error: setupError } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      })
      
      if (setupError) {
        return NextResponse.json({ error: setupError.message }, { status: 500 })
      }
      
      return NextResponse.json({
        isMFAEnabled: false,
        setupData: {
          qrCode: setupData.totp.qr_code,
          secret: setupData.totp.secret,
          factorId: setupData.id
        }
      })
    }
    
    // Se já tem MFA ativo, apenas retornar o status
    return NextResponse.json({
      isMFAEnabled: true,
      factors: data.all.filter(f => f.status === 'verified').map(f => ({
        id: f.id,
        type: f.factor_type,
        createdAt: f.created_at
      }))
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST: Verificar código TOTP e ativar MFA
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    const { factorId, code } = body
    
    if (!factorId || !code) {
      return NextResponse.json({ error: "Código ou ID do fator não fornecido" }, { status: 400 })
    }
    
    // Verificar o código TOTP
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code
    })
    
    if (error) {
      return NextResponse.json({ 
        error: "Código inválido ou expirado. Tente novamente." 
      }, { 
        status: 400 
      })
    }
    
    return NextResponse.json({
      success: true,
      message: "Autenticação de dois fatores ativada com sucesso"
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// DELETE: Desativar MFA
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const factorId = searchParams.get('factorId')
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    if (!factorId) {
      return NextResponse.json({ error: "ID do fator não fornecido" }, { status: 400 })
    }
    
    // Desativar o fator MFA
    const { error } = await supabase.auth.mfa.unenroll({ factorId })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: "Autenticação de dois fatores desativada com sucesso"
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}