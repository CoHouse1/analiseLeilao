"use client"

import { useState, useEffect, useRef } from "react"
import { AlertCircle, CheckCircle, XCircle, AlertTriangle, Download, ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { saveHtmlContent } from "@/lib/actions"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import type { Analysis, AnalysisResult } from "@/lib/database.types"

interface ResultadoAnaliseProps {
  id?: string
}

// Interface para a estrutura dos dados de resultado (JSONB no banco)
interface ResultData {
  recomendacao?: string;
  riscos?: string[];
  oportunidades?: string[];
  detalhesImovel?: {
    endereco?: string;
    area?: string;
    descricao?: string;
  };
  detalhesLeilao?: {
    dataLeilao?: string;
    valorInicial?: string;
    incrementoMinimo?: string;
    formasPagamento?: string[];
  };
  valorEstimado?: string;
  analiseJuridica?: string;
  analiseFinanceira?: string;
}

export function ResultadoAnalise({ id }: ResultadoAnaliseProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [exportando, setExportando] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Efeito para buscar os dados da análise
  // Modifique o useEffect atual
useEffect(() => {
  if (!id) {
    setError("ID da análise não fornecido");
    setLoading(false);
    return;
  }

  let intervalId: NodeJS.Timeout | null = null;

  // Função para buscar os dados reais da análise
  const fetchResultado = async () => {
    try {
      // Obter cliente Supabase autenticado
      const supabase = getSupabaseBrowser();
      
      // Buscar a análise
      const { data: analysisData, error: analysisError } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .single();

      if (analysisError) {
        if (analysisError.code === "PGRST116") {
          throw new Error("Análise não encontrada");
        }
        throw new Error(`Erro ao buscar análise: ${analysisError.message}`);
      }

      // Atualizar o estado com os dados da análise
      setAnalysis(analysisData);
      
      // Se a análise estiver em processamento, mostrar warning e configurar intervalo
      if (analysisData && analysisData.status === "processing") {
        setWarning("A análise está em processamento. Você receberá um email assim que estiver pronta.");
        setLoading(false);
        
        // Configurar intervalo para verificar atualizações do status
        if (!intervalId) {
          intervalId = setInterval(async () => {
            console.log("Verificando status da análise...");
            try {
              const { data, error } = await supabase
                .from("analyses")
                .select("status")
                .eq("id", id)
                .single();
              
              if (error) throw error;
              
              // console.log("Status atual:", data.status);
              // Se a análise foi concluída, recarregar a página
              if (data && data.status !== analysisData.status) {
                // console.log("Análise concluída, recarregando página...");
                window.location.reload();
              }
            } catch (err) {
              console.error("Erro ao verificar status:", err);
            }
          }, 10000);
        }
        
        // Sair da função para não buscar resultados ainda
        return;
      }
      
      // Se chegou aqui, a análise não está em processamento, limpar o intervalo
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      
      // Buscar o resultado da análise se estiver completa
      const { data: resultData, error: resultError } = await supabase
        .from("analysis_results")
        .select("*")
        .eq("analysis_id", id)
        .single();
      
      if (resultError && resultError.code !== 'PGRST116') {
        throw new Error("Erro ao buscar resultado da análise");
      }
      
      // Verificar se temos um resultado
      if (!resultData || !resultData.result_data) {
        throw new Error("Resultado não encontrado");
      }
      
      setResultData(resultData.result_data as ResultData);
      setWarning(null); // Limpar warning se existir
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar resultado:", err);
      setError(err instanceof Error ? err.message : "Não foi possível carregar o resultado da análise");
      setLoading(false);
    }
  };

  // Chamar a função para buscar os dados
  fetchResultado();

  // Limpar o intervalo quando o componente é desmontado
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [id]); // Remova 'analysis' da dependência

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4 bg-orbit-gray/30" />
        <Skeleton className="h-32 w-full bg-orbit-gray/30" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full bg-orbit-gray/30" />
          <Skeleton className="h-64 w-full bg-orbit-gray/30" />
        </div>
        <Skeleton className="h-64 w-full bg-orbit-gray/30" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (warning) {
    return (
      <Alert variant="destructive" className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aviso</AlertTitle>
        <AlertDescription>{warning}</AlertDescription>
      </Alert>
    )
  }

  if (!resultData || !analysis) {
    return (
      <Alert className="bg-orbit-gray/30 border-orbit-gray/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Análise não encontrada</AlertTitle>
        <AlertDescription>
          Não foi possível encontrar a análise solicitada. Verifique o ID ou tente novamente.
        </AlertDescription>
      </Alert>
    )
  }

  // Determinar o status da recomendação
  const recomendacaoStatus = resultData?.recomendacao?.toLowerCase?.().includes("recomendamos o investimento")
    ? "positiva"
    : resultData?.recomendacao?.toLowerCase?.().includes("com ressalvas")
      ? "neutra"
      : "negativa"

  // Função para criar e exportar o HTML para PDF
  const exportarPDF = async () => {
    if (!id || !resultData) return
    
    setExportando(true)
    
    try {
      // Preparar o conteúdo HTML para o PDF
      const conteudoHtml = prepararHtmlParaExportacao()
      
      // Salvar o HTML no banco de dados para futura referência
      await saveHtmlContent(id, conteudoHtml)
      
      // Criar um elemento temporário para o download do HTML
      const element = document.createElement("a")
      const file = new Blob([conteudoHtml], { type: "text/html" })
      element.href = URL.createObjectURL(file)
      element.download = `Análise_Leilão_${id}.html`
      
      // Simular clique e remover o elemento
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (err) {
      console.error("Erro ao exportar relatório:", err)
      setError("Não foi possível exportar o relatório. Por favor, tente novamente.")
    } finally {
      setExportando(false)
    }
  }
  
  // Preparar o HTML para exportação com estilos embutidos
  const prepararHtmlParaExportacao = () => {
    if (!resultData) return ""
    
    // Data formatada para o relatório
    const dataFormatada = new Date().toLocaleDateString('pt-BR')
    
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Análise de Leilão - ${resultData.detalhesImovel?.endereco || 'Imóvel'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #ff6600;
            margin-bottom: 10px;
          }
          .data {
            font-size: 14px;
            color: #666;
          }
          .section {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
          }
          .recomendacao {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 25px;
            background-color: ${resultData?.recomendacao?.toLowerCase?.().includes('recomendamos o investimento') && !resultData?.recomendacao?.toLowerCase?.().includes('com ressalvas') 
              ? '#e6ffe6' 
              : resultData?.recomendacao?.toLowerCase?.().includes('com ressalvas')
                ? '#fff9e6'
                : '#ffe6e6'
            };
          }
          .item {
            display: flex;
            margin-bottom: 10px;
          }
          .item-icon {
            margin-right: 10px;
            font-weight: bold;
          }
          .item-text {
            flex: 1;
          }
          .risk-item .item-icon {
            color: #e74c3c;
          }
          .opportunity-item .item-icon {
            color: #2ecc71;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              padding: 0;
            }
            .section {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">AnaliseLeilão</div>
          <div class="data">Relatório gerado em ${dataFormatada}</div>
        </div>
        
        <div class="recomendacao">
          <div class="section-title">Recomendação</div>
          <p>${resultData?.recomendacao || 'Não disponível'}</p>
        </div>
        
        <div class="grid">
          <div class="section">
            <div class="section-title">Riscos Identificados</div>
            ${resultData?.riscos?.map((risco: string) => `
              <div class="item risk-item">
                <div class="item-icon">✘</div>
                <div class="item-text">${risco}</div>
              </div>
            `).join('') || 'Nenhum risco identificado'}
          </div>
          
          <div class="section">
            <div class="section-title">Oportunidades</div>
            ${resultData?.oportunidades?.map((oportunidade: string) => `
              <div class="item opportunity-item">
                <div class="item-icon">✓</div>
                <div class="item-text">${oportunidade}</div>
              </div>
            `).join('') || 'Nenhuma oportunidade identificada'}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Detalhes do Imóvel</div>
          <p><strong>Endereço:</strong> ${resultData?.detalhesImovel?.endereco || 'Não disponível'}</p>
          <p><strong>Área:</strong> ${resultData?.detalhesImovel?.area || 'Não disponível'}</p>
          <p><strong>Valor Estimado:</strong> ${resultData?.valorEstimado || 'Não disponível'}</p>
          <p><strong>Descrição:</strong> ${resultData?.detalhesImovel?.descricao || 'Não disponível'}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Detalhes do Leilão</div>
          <p><strong>Data do Leilão:</strong> ${resultData?.detalhesLeilao?.dataLeilao || 'Não disponível'}</p>
          <p><strong>Valor Inicial:</strong> ${resultData?.detalhesLeilao?.valorInicial || 'Não disponível'}</p>
          <p><strong>Incremento Mínimo:</strong> ${resultData?.detalhesLeilao?.incrementoMinimo || 'Não disponível'}</p>
          <p><strong>Formas de Pagamento:</strong></p>
          <ul>
            ${resultData?.detalhesLeilao?.formasPagamento?.map((forma: string) => `<li>${forma}</li>`).join('') || '<li>Não disponível</li>'}
          </ul>
        </div>
        
        <div class="section">
          <div class="section-title">Análise Jurídica</div>
          <p>${resultData?.analiseJuridica || 'Não disponível'}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Análise Financeira</div>
          <p>${resultData?.analiseFinanceira || 'Não disponível'}</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} AnaliseLeilão. Todos os direitos reservados.</p>
          <p>Este relatório foi gerado automaticamente e deve ser usado apenas como referência.</p>
        </div>
      </body>
      </html>
    `
  }

  return (
    <div className="space-y-6" ref={reportRef}>
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader
          className={`${
            recomendacaoStatus === "positiva"
              ? "bg-green-900/20"
              : recomendacaoStatus === "neutra"
                ? "bg-yellow-900/20"
                : "bg-red-900/20"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`rounded-full p-2 ${
                recomendacaoStatus === "positiva"
                  ? "bg-green-900/30 text-green-400"
                  : recomendacaoStatus === "neutra"
                    ? "bg-yellow-900/30 text-yellow-400"
                    : "bg-red-900/30 text-red-400"
              }`}
            >
              {recomendacaoStatus === "positiva" ? (
                <CheckCircle className="h-6 w-6" />
              ) : recomendacaoStatus === "neutra" ? (
                <AlertTriangle className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
            </div>
            <div>
              <CardTitle className="text-white">Recomendação</CardTitle>
              <CardDescription className="text-base mt-2 text-gray-200">{resultData.recomendacao}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-orbit-blue border-orbit-gray/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-red-400" />
              Riscos Identificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {resultData?.riscos?.map((risco: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-gray-200">{risco}</span>
                </li>
              )) || <li className="text-gray-400">Nenhum risco identificado</li>}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-orbit-blue border-orbit-gray/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {resultData?.oportunidades?.map((oportunidade: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-gray-200">{oportunidade}</span>
                </li>
              )) || <li className="text-gray-400">Nenhuma oportunidade identificada</li>}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Detalhes do Imóvel e Leilão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Informações do Imóvel</h3>
              <div className="space-y-2 text-gray-200">
                <div>
                  <span className="font-medium text-gray-300">Endereço:</span> {resultData.detalhesImovel?.endereco || 'Não disponível'}
                </div>
                <div>
                  <span className="font-medium text-gray-300">Área:</span> {resultData.detalhesImovel?.area || 'Não disponível'}
                </div>
                <div>
                  <span className="font-medium text-gray-300">Valor Estimado de Mercado:</span>{" "}
                  {resultData.valorEstimado || 'Não disponível'}
                </div>
                <div>
                  <span className="font-medium text-gray-300">Descrição:</span>
                  <p className="mt-1">{resultData.detalhesImovel?.descricao || 'Não disponível'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Informações do Leilão</h3>
              <div className="space-y-2 text-gray-200">
                <div>
                  <span className="font-medium text-gray-300">Data do Leilão:</span>{" "}
                  {resultData.detalhesLeilao?.dataLeilao || 'Não disponível'}
                </div>
                <div>
                  <span className="font-medium text-gray-300">Valor Inicial:</span>{" "}
                  {resultData.detalhesLeilao?.valorInicial || 'Não disponível'}
                </div>
                <div>
                  <span className="font-medium text-gray-300">Incremento Mínimo:</span>{" "}
                  {resultData.detalhesLeilao?.incrementoMinimo || 'Não disponível'}
                </div>
                <div>
                  <span className="font-medium text-gray-300">Formas de Pagamento:</span>
                  <ul className="mt-1 list-disc list-inside">
                    {resultData.detalhesLeilao?.formasPagamento?.map((forma: string, index: number) => (
                      <li key={index}>{forma}</li>
                    )) || <li>Não disponível</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="juridica">
        <TabsList className="grid w-full grid-cols-2 bg-orbit-gray/30">
          <TabsTrigger value="juridica" className="data-[state=active]:bg-orbit-orange data-[state=active]:text-white">
            Análise Jurídica
          </TabsTrigger>
          <TabsTrigger
            value="financeira"
            className="data-[state=active]:bg-orbit-orange data-[state=active]:text-white"
          >
            Análise Financeira
          </TabsTrigger>
        </TabsList>
        <TabsContent value="juridica">
          <Card className="bg-orbit-blue border-orbit-gray/30">
            <CardContent className="pt-6">
              <p className="text-gray-200">{resultData.analiseJuridica || 'Não disponível'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financeira">
          <Card className="bg-orbit-blue border-orbit-gray/30">
            <CardContent className="pt-6">
              <p className="text-gray-200">{resultData.analiseFinanceira || 'Não disponível'}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={exportarPDF}
          disabled={exportando || !resultData}
          className="border-orbit-gray/50 text-gray-300 hover:bg-orbit-gray/30"
        >
          {exportando ? (
            <>Exportando...</>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Exportar como HTML
            </>
          )}
        </Button>
        <Button
          onClick={() => (window.location.href = "/analise")}
          className="bg-orbit-orange hover:bg-orbit-orange/90 text-white"
        >
          Nova Análise
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
