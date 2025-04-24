import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/utils/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/server";

// GET: Obter detalhes de uma análise específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    console.log("ID da análise:", id);
    
    // Extrair o token do cabeçalho Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Não autorizado" +  authHeader}, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    console.log("Token:", token);
    // Criar cliente Supabase com o token JWT
    const supabase = createSupabaseClient();
   
    // Buscar o usuário atual
    const { data: userInfo, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userInfo.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Buscar a análise
    const { data: analysis, error: analysisError } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", id)
      .eq("user_id", userInfo.user.id)
      .single();
    
    if (analysisError || !analysis) {
      return NextResponse.json({ 
        error: analysisError ? "Erro ao buscar análise" : "Análise não encontrada" 
      }, { 
        status: analysisError ? 500 : 404 
      });
    }
    
    // Buscar o resultado da análise
    const { data: analysisResult, error: resultError } = await supabase
      .from("analysis_results")
      .select("*")
      .eq("analysis_id", id)
      .single();
    
    if (resultError && resultError.code !== 'PGRST116') { // Não é erro "not found"
      return NextResponse.json({ error: "Erro ao buscar resultado da análise" }, { status: 500 });
    }
    
    // Verificar se temos um resultado e retornar no formato esperado pelo componente
    if (!analysisResult) {
      return NextResponse.json({ 
        error: "Resultado não encontrado",
        analysis: analysis
      }, { status: 404 });
    }
    
    return NextResponse.json({
      analysis,
      result_data: analysisResult.result_data
    });
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE: Excluir uma análise
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    
    // Extrair o token do cabeçalho Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    
    // Criar cliente Supabase com o token JWT
    const supabase = createSupabaseClient();
    
    // Buscar o usuário atual
    const { data: userInfo, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userInfo.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    // Verificar se a análise existe e pertence ao usuário
    const { data: analysis, error: checkError } = await supabase
      .from("analyses")
      .select("id")
      .eq("id", id)
      .eq("user_id", userInfo.user.id)
      .single();
    
    if (checkError || !analysis) {
      return NextResponse.json({ 
        error: "Análise não encontrada ou você não tem permissão para excluí-la" 
      }, { 
        status: 404 
      });
    }
    
    // Excluir a análise (as chaves estrangeiras com CASCADE cuidarão dos resultados)
    const { error: deleteError } = await supabaseAdmin
      .from("analyses")
      .delete()
      .eq("id", id);
    
    if (deleteError) {
      return NextResponse.json({ error: "Erro ao excluir análise" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}