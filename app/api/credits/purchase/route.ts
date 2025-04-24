import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/server"

// POST: Processar pagamento e adicionar créditos
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    // Validar dados
    const { packageId, amount, credits, paymentMethod } = body
    
    if (!packageId || !amount || !credits || amount <= 0 || credits <= 0) {
      return NextResponse.json({ error: "Dados de pagamento inválidos" }, { status: 400 })
    }
    
    // Em produção, aqui integraria com um gateway de pagamento
    // Por hora, simularemos um pagamento bem-sucedido
    
    // 1. Registrar a transação financeira
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("transactions")
      .insert({
        user_id: session.user.id,
        amount,
        currency: "BRL",
        status: "completed",
        payment_method: paymentMethod || "Cartão de Crédito",
        payment_id: `sim_${Date.now()}`,
        credits_added: credits,
      })
      .select()
      .single()
    
    if (transactionError) {
      return NextResponse.json({ error: "Erro ao registrar transação" }, { status: 500 })
    }
    
    // 2. Atualizar créditos do usuário
    const { data: userCredits, error: userCreditsError } = await supabaseAdmin
      .from("user_credits")
      .select("id, paid_credits")
      .eq("user_id", session.user.id)
      .single()
    
    if (userCreditsError) {
      return NextResponse.json({ error: "Erro ao buscar créditos do usuário" }, { status: 500 })
    }
    
    const { error: updateError } = await supabaseAdmin
      .from("user_credits")
      .update({
        paid_credits: userCredits.paid_credits + credits,
      })
      .eq("id", userCredits.id)
    
    if (updateError) {
      return NextResponse.json({ error: "Erro ao atualizar créditos" }, { status: 500 })
    }
    
    // 3. Registrar transação de créditos
    const { error: creditTransactionError } = await supabaseAdmin
      .from("credit_transactions")
      .insert({
        user_id: session.user.id,
        amount: credits,
        transaction_type: "purchase",
        description: `Compra de ${credits} créditos`,
      })
    
    if (creditTransactionError) {
      return NextResponse.json({ error: "Erro ao registrar transação de créditos" }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      transaction: transaction,
      credits_added: credits
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}