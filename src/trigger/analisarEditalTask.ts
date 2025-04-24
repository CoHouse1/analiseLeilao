import { logger, task } from "@trigger.dev/sdk/v3";
import { AnalisePDFParams, ResultadoAnalise } from '@/lib/types';
import { analisar, processarResultadoAnalise } from "@/lib/analysis-service";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Interface para os parâmetros da tarefa
interface AnalisarEditalPayload {
  params: AnalisePDFParams;
  userId: string;
}

// Tarefa para processar a análise do edital em segundo plano
export const analisarEditalTask = task({
  id: "analisar-edital",
  maxDuration: 600, // 10 minutos (pode ser ajustado conforme necessário)
  retry: {
    maxAttempts: 1,
    maxTimeoutInMs: 600000, // 10 minutos (pode ser ajustado conforme necessário)
  },
  run: async (payload: AnalisarEditalPayload) => {
    const { params, userId } = payload;
    const startTime = Date.now();
    
    logger.log("Iniciando análise de edital", { 
      analysisId: params.id, 
      userId: userId 
    });

    try {
      // Registrar início do processamento no log
      logger.log("Processando arquivo", { fileName: params.fileName });
      
      // Analisar o PDF usando o serviço de análise
      const resultado = await analisar(params);
      
      // Processar o resultado para gerar o JSON e HTML
      const { json: resultData, html: htmlContent } = await processarResultadoAnalise(resultado);

      // Salvar o resultado da análise
      await supabaseAdmin.from("analysis_results").insert({
        analysis_id: params.id,
        result_data: resultData,
        html_content: htmlContent,
      });

      // Atualizar o status da análise
      await supabaseAdmin.from("analyses").update({ status: "completed" }).eq("id", params.id);

      const duration = (Date.now() - startTime) / 1000;
      logger.log("Análise concluída com sucesso", { 
        analysisId: params.id, 
        durationSeconds: duration 
      });

      return {
        analysisId: params.id,
        status: "completed",
        ...resultado
      };
    } catch (error) {
      logger.error("Erro ao processar análise", { 
        analysisId: params.id, 
        error: error instanceof Error ? error.message : String(error) 
      });

      // Atualizar status para erro
      await supabaseAdmin.from("analyses").update({ 
        status: "failed",
        error_message: error instanceof Error ? error.message : "Erro desconhecido"
      }).eq("id", params.id);

      // Revalidar caminhos para atualizar a interface do usuário
      revalidatePath("/analise/resultado");
      revalidatePath("/dashboard");

      throw error;
    }
  },
});