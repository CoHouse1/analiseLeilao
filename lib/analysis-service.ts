"use server"

import { AnalisePDFParams, ResultadoAnalise } from './types'
import { analisarPDFComGoogleAI } from './google-ai'
import { analisarPDFComOpenRouter } from './openrouter'
import { getAPIConfig, setAPIConfig } from './utils'

// Período de verificação de cota (1 hora em milissegundos)
const QUOTA_CHECK_PERIOD = 60 * 60 * 1000;

/**
 * Função central para análise de PDFs que gerencia a alternância entre APIs
 */
export async function analisar(params: AnalisePDFParams): Promise<ResultadoAnalise> {
  try {
    // Verificar configuração atual das APIs
    const apiConfig = await getAPIConfig();
    const agora = Date.now();
    
    // Se a última verificação de cota foi há mais de 1 hora, tentamos resetar o status
    if (apiConfig.googleQuotaExceeded && (agora - apiConfig.lastQuotaCheck > QUOTA_CHECK_PERIOD)) {
      console.log("Resetando status de cota do Google AI após período de espera");
      apiConfig.googleQuotaExceeded = false;
      await setAPIConfig(apiConfig);
    }
    
    // Se a Google AI não estiver com cota excedida, tentamos usar primeiro
    if (!apiConfig.googleQuotaExceeded && process.env.GOOGLE_AI_API_KEY) {
      try {
        console.log("Tentando análise com Google AI");
        const resultado = await analisarPDFComGoogleAI(params);
        return resultado;
      } catch (error) {
        // Se for erro de cota, marcamos flag e usamos OpenRouter como fallback
        if (error instanceof Error && error.message === "QUOTA_EXCEEDED") {
          console.log("Cota do Google AI excedida, alternando para OpenRouter");
          // Atualizar configuração de API
          apiConfig.googleQuotaExceeded = true;
          apiConfig.lastQuotaCheck = agora;
          await setAPIConfig(apiConfig);
          
          // Tentar com OpenRouter
          return analisarPDFComOpenRouter(params);
        }
        
        // Se for outro erro, repassa
        throw error;
      }
    } else {
      // Usar OpenRouter diretamente se Google AI estiver com cota excedida
      console.log("Usando OpenRouter devido à cota excedida no Google AI");
      return analisarPDFComOpenRouter(params);
    }
  } catch (error) {
    console.error("Erro ao analisar PDF:", error);
    
    // Retornar um resultado de erro formatado
    return {
      id: params.id,
      recomendacao: "Erro ao processar a análise",
      riscos: ["Não foi possível analisar o documento"],
      oportunidades: [],
      valorEstimado: "Não disponível",
      detalhesImovel: {
        endereco: "Não disponível",
        area: "Não disponível",
        descricao: "Não disponível",
      },
      detalhesLeilao: {
        dataLeilao: "Não disponível",
        valorInicial: "Não disponível",
        incrementoMinimo: "Não disponível",
        formasPagamento: ["Não disponível"],
      },
      analiseJuridica: "Não foi possível realizar a análise jurídica.",
      analiseFinanceira: "Não foi possível realizar a análise financeira.",
      html_content: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Erro na Análise</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; color: #333; }
            .error-container { max-width: 600px; margin: 0 auto; padding: 30px; background-color: #fff3f3; border-radius: 8px; }
            h1 { color: #e74c3c; }
            p { font-size: 16px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>Erro na Análise</h1>
            <p>Não foi possível processar a análise do edital.</p>
            <p>Por favor, tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.</p>
          </div>
        </body>
        </html>
      `
    };
  }
}

/**
 * Processa o resultado da análise para retornar apenas os dados necessários
 */
export async function processarResultadoAnalise(resultado: ResultadoAnalise): Promise<{ json: any, html: string }> {
  try {
    // Extrair o HTML da resposta (agora já vem direto da IA)
    const htmlContent = resultado.html_content || '';
    
    // Preparar objeto JSON para armazenamento
    const jsonData = {
      recomendacao: resultado.recomendacao,
      riscos: resultado.riscos,
      oportunidades: resultado.oportunidades,
      valorEstimado: resultado.valorEstimado,
      detalhesImovel: resultado.detalhesImovel,
      detalhesLeilao: resultado.detalhesLeilao,
      analiseJuridica: resultado.analiseJuridica,
      analiseFinanceira: resultado.analiseFinanceira
    };
    
    return {
      json: jsonData,
      html: htmlContent
    };
  } catch (error) {
    console.error("Erro ao processar resultado da análise:", error);
    throw new Error("Não foi possível processar o resultado da análise");
  }
}