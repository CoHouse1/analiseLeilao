import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// GET: Obter todas as análises do usuário
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const status = searchParams.get("status") || null
    const search = searchParams.get("search") || null
    const offset = (page - 1) * limit
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    
    // Construir a query
    let query = supabase
      .from("analyses")
      .select("*", { count: "exact" })
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
    
    // Aplicar filtros, se existirem
    if (status) {
      query = query.eq("status", status)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,tipo_imovel.ilike.%${search}%,cidade.ilike.%${search}%,estado.ilike.%${search}%`)
    }
    
    // Aplicar paginação
    query = query.range(offset, offset + limit - 1)
    
    // Executar a query
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json({ error: "Erro ao buscar análises" }, { status: 500 })
    }
    
    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}