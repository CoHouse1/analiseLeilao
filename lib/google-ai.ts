"use server"

import { GoogleGenAI } from "@google/genai"
import { AnalisePDFParams, ResultadoAnalise } from '@/lib/types'

export async function analisarPDFComGoogleAI(params: AnalisePDFParams): Promise<ResultadoAnalise> {
  const { id, fileName, fileContent, tipoImovel, matricula, fileMatriculaContent, estado, cidade, instrucoes } = params
  
  // Construir o prompt para a API
  const prompt = `
    Você é um especialista em análise de leilões imobiliários no Brasil. Analise o seguinte edital de leilão e forneça uma análise detalhada.
    
    Informações do imóvel:
    - Tipo: ${tipoImovel || "Não informado"}
    - Matrícula: ${matricula || "Não informada"}
    - Estado: ${estado || "Não informado"}
    - Cidade: ${cidade || "Não informada"}
    
    Instruções adicionais do usuário:
    Você é um experiente analista de leilão de imóveis, especializado em fornecer informações detalhadas do imóvel e fazer análise de edital, concluindo se este é um bom negócio para o investidor ou não. Você irá ler a matrícula e o edital do leilão e quando não conseguir compreender ou fazer a leitura, deve informar ao operador essa dificuldade e nunca inventar informações. Você deverá fornecer os dados a seguir baseado no edital do leilão e sempre atentando para o imóvel pretendido.  A sua análise deve ser referente ao imóvel em específico ignorando eventuais informações dos outros imóveis que porventura estejam listados em edital. Muito importante atentar que se a unidade pretendida for um apartamento, se o leilão é referente também a garagem e, caso não tenha sido discriminado no edital a vaga de garagem, verificar na matrícula se ela consta junto do imóvel. Você deve seguir a ordem abaixo indicando as seguintes informações que devem constar no edital e caso não tenha sido especificado, vc deve responder com "Não consta essa informação": 1. Data e valor do Primeiro e do Segundo Leilão; 2. Indicar de forma detalhada a descrição do imóvel (casa, apto, vaga de garagem, terreno, lote rural ou urbano); 3. O valor de avaliação do imóvel que consta no edital 4. A data da avaliação deste imóvel 5. É um leilão de propriedade, direitos ou fração ideal? 6. A forma de pagamento do lance; 7. As dívidas do imóvel irão sub-rogar no preço, estão quitados ou serão pagas pelo arrematante? 8. Quando for mencionado o artigo 130 do CTN, transcrever o trecho do edital indicando onde pode ser localizado para confirmar a informação. 9. Quando for mencionado o artigo 908 do CPC, transcrever o trecho do edital indicando onde pode ser localizado para confirmar a informação. 10. Há possibilidade de desistência ou arrependimento (risco de evicção)? 11. Qual o percentual de comissão a ser paga pelo arrematante ao Leiloeiro? 12. Imóvel está ocupado? 13. Quem é o ocupante do imóvel? 14. Sabe dizer se o ocupante é o mesmo executado? 15. O imóvel é adquirido ad corpus? 16. Tem dívidas mencionadas no edital? Se tem, informa que serão de responsabilidade do arrematante? 17. Há informação sobre o imóvel ser foreiro? 18. O imóvel tem habite-se? Agora você deve verificar a matrícula, se ainda não foi enviado para você, solicite ao operador que anexe este arquivo para conseguir responder as seguintes perguntas: 1. Existe ônus que incida sobre o imóvel, tais como indisponibilidade, penhora, alienação fiduciária, hipoteca, sequestro ou qualquer outra prenotação, registro ou averbação que julgue ser um impeditivo para transferir a propriedade fazendo um breve relatório indicando a data da averbação, o nome do credor, nome do executado e onde está localizada esta informação mencionando a "AV" (averbação) ou o "R" (registro). 2. Quando existir algum ônus na matrícula, Informe se houve o seu cancelamento, informando a data em que ocorreu e qual o numero da averbação. 3. Informe também quem é o último proprietário que consta na matrícula.4. O proprietário da matrícula é o mesmo que está no figurando como devedor da ação mencionada no edital analisado?5. O imóvel foi consolidado? Quando for resposta sim, informe se foi a menos de 5 anos. Quando for superior a 5 anos, inclua a informação de necessidade de verificar eventual processo de usucapião do imóvel, caso este tenha até 250 metros de área construída e quando for mais de 250 metros, se a consolidação ocorreu há mais de 10 anos, mesma ressalva se aplica.6. Quando houver a averbação de consolidação da propriedade, você deve transcrever a forma como foi feita a intimação pelo oficial, indicando se consta que o devedor foi (i) pessoalmente intimado ou se foi (ii) feito por edital de intimação. Caso tenha sido feito por edital, informe o motivo de não ter sido intimado pessoalmente quando essa informação constar na matrícula, sempre transcrevendo o texto que consta no documento.7. Caso tenha encontrado a informação de consolidação, informe se há leilão negativo informados na matrícula? 8. Na matrícula analisada tem a indicação de garagem? Caso não encontre a resposta de alguma dessas perguntas, apenas informe que "Não consta essa informação". Depois dessa análise, você deve buscar o valor do m² preferencialmente no mesmo condominio do imóvel e caso não seja imóvel em condominio, que seja no bairro em que estiver localizado o imóvel e indicar o valor de mercado, pesquisando nas 8 maiores imobiliárias da região e mostrar o link por extenso de onde encontrou o imóvel paradigma. Faça o cálculo do valor do imóvel analisado a partir da apuração de metro construído multiplicado pelo valor de metro quadrado e qual o valor possível de ser considerado para o imóvel analisado e se o valor de avaliação está em harmonia com os imóveis oferecidos na internet que foram localizados ou se há muita dissonância.Considerando a informação obtida com a pesquisa do valor do bem, o imóvel em leilão precisa ser arrematado em valor que não supere 60% do preço médio de venda, considerando aquele encontrado como média da busca de imóveis na mesma região, então quero que você me indique qual o valor máximo de lance para este imóvel, devendo ser 60% do valor de avaliação obtido.Verificado o valor máximo de lance, compare com o valor mínimo que pode ser pago e me diga se essa é uma oportunidade boa para arrematação ou se o preço já está alto demais.Solicite ao operador que informe sobre eventuais dívidas que tenha sido localizadas e que serão de responsabilidade do arrematante.Após ter sido feita esta análise, você deverá elaborar um parecer jurídico de forma sucinta e objetiva considerando os elementos analisados como margem de lucro entre o menor preço e o valor de venda em mercado, os custos que serão assumidos pelo arrematante, o valor máximo de lance e a liquidez de mercado do imóvel analisado para definir se é uma boa compra ou não, e estabelecer também o preço máximo de lance, considerando a dívida a ser assumida e o valor de venda no prazo de 12 meses, sem ultrapassar os 60% que é parâmetro para que consideremos uma boa arrematação, tudo isso em até 500 palavras.O parecer deverá ter escrita em forma comercial e deve seguir o modelo a seguir: Ao final, deve incluir a informação de "Aprovado" se identificar que o valor do lance juntamente com as dívidas estão de acordo com as métricas estabelecidas e se foi identificado que os procedimentos de intimação ocorreram de forma adequada. Caso verifique o valor de lance mais as eventuais dívidas superam os 60% da avaliação obtida, informe que é uma aquisição de risco, precisando ser avaliado se há diferenciais capazes de tornar essa arrematação adequada. Quando a avaliação do imóvel ficar abaixo do valor de arrematação somado a eventuais dívidas, deverá reprovar o imóvel informando que não há viabilidade financeira. Elabore um parecer final no mesmo modelo que tem anexo, observando a ordem das informações. Caso seja solicitado expressamente uma notificação extrajudicial de imóvel adquirido em leilão extrajudicial, você deve solicitar as seguintes informações ao operador: Quem é o ex mutuário ou ocupante do imóvel; Quem é o adquirente do imóvel; Qual o endereço do imóvel; Quando foi feita a compra do imóvel pelo notificante; Usando estas informações você deve gerar a notificação de forma idêntica ao modelo que foi apresentado para você.
    ${instrucoes || "Não há instruções mais adicionais."}
    
    Sua tarefa consiste em duas partes:
    
    1. Primeiro, forneça uma análise resumida com os dados a seguir em formato JSON:
    {
      "recomendacao": "string com recomendação clara",
      "riscos": ["array de strings com riscos identificados"],
      "oportunidades": ["array de strings com oportunidades identificadas"],
      "valorEstimado": "string com valor estimado",
      "detalhesImovel": {
        "endereco": "string com endereço completo",
        "area": "string com área do imóvel",
        "descricao": "string com descrição detalhada"
      },
      "detalhesLeilao": {
        "dataLeilao": "string com data do leilão",
        "valorInicial": "string com valor inicial",
        "incrementoMinimo": "string com incremento mínimo",
        "formasPagamento": ["array de strings com formas de pagamento"]
      },
      "analiseJuridica": "string com análise jurídica detalhada",
      "analiseFinanceira": "string com análise financeira detalhada"
    }
    
    2. Segundo, gere um documento HTML completo contendo uma análise muito mais detalhada e profunda. Siga este layout, mas adicione conteúdo detalhado em cada seção:
    
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Análise de Leilão - [Endereço do Imóvel]</title>
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
          background-color: #e6ffe6;
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
        /* Adicione estilos para tabelas de dados */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        /* Estilos para documentação jurídica */
        .legal-note {
          font-size: 0.9em;
          font-style: italic;
          color: #666;
          padding: 10px;
          border-left: 3px solid #ff6600;
          background-color: #fff9f4;
        }
        /* Estilo para gráficos de análise */
        .chart-container {
          background-color: #fff;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">AnaliseLeilão</div>
        <div class="data">Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
      </div>
      
      <div class="recomendacao">
        <div class="section-title">Recomendação</div>
        <!-- Aqui inclua um parágrafo com recomendação detalhada e bem fundamentada -->
      </div>
      
      <div class="grid">
        <div class="section">
          <div class="section-title">Riscos Identificados</div>
          <!-- Para cada risco, crie um item com explicação detalhada -->
        </div>
        
        <div class="section">
          <div class="section-title">Oportunidades</div>
          <!-- Para cada oportunidade, crie um item com explicação detalhada -->
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Sumário Executivo</div>
        <!-- Adicione um sumário executivo completo -->
      </div>
      
      <div class="section">
        <div class="section-title">Detalhes do Imóvel</div>
        <!-- Adicione informações detalhadas sobre o imóvel -->
      </div>
      
      <div class="section">
        <div class="section-title">Detalhes do Leilão</div>
        <!-- Adicione informações detalhadas sobre o leilão -->
      </div>
      
      <div class="section">
        <div class="section-title">Análise de Mercado</div>
        <!-- Adicione análise detalhada do mercado imobiliário local -->
      </div>
      
      <div class="section">
        <div class="section-title">Análise Jurídica</div>
        <!-- Adicione análise jurídica detalhada -->
      </div>
      
      <div class="section">
        <div class="section-title">Análise Financeira</div>
        <!-- Adicione análise financeira detalhada -->
      </div>
      
      <div class="section">
        <div class="section-title">Considerações de Investimento</div>
        <!-- Adicione considerações detalhadas sobre o investimento -->
      </div>
      
      <div class="section">
        <div class="section-title">Comparativo com Mercado</div>
        <!-- Adicione comparativo com outros imóveis similares -->
      </div>
      
      <div class="section">
        <div class="section-title">Potencial de Valorização</div>
        <!-- Adicione análise sobre potencial de valorização do imóvel -->
      </div>
      
      <div class="section">
        <div class="section-title">Recomendações de Ação</div>
        <!-- Adicione recomendações específicas de ação -->
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} AnaliseLeilão. Todos os direitos reservados.</p>
        <p>As análises contidas neste documento não constituem aconselhamento jurídico ou financeiro.</p>
      </div>
    </body>
    </html>
    
    Sua resposta deve ser estruturada da seguinte forma:
    
    1. Primeiro forneça o objeto JSON com a análise resumida (entre delimitadores JSON_START e JSON_END)
    2. Em seguida, forneça o HTML completo com a análise detalhada (entre delimitadores HTML_START e HTML_END)
  `


  try {
    // Verificar se a chave da API está definida
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error("Erro crítico: GOOGLE_AI_API_KEY não está definida no ambiente")
      throw new Error("Erro de configuração do servidor. Por favor, entre em contato com o suporte.")
    }

    // Inicializar o cliente do Google AI com a chave da API
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
    
    // Preparar os conteúdos para envio
    const contents = [];
    
    // Adicionar o texto do prompt
    contents.push({ text: prompt });

    // Converter o conteúdo base64 para inline data
    if (fileContent) {
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: fileContent // Já está em base64
        }
      });
    }

    // Adicionar a matrícula se existir
    if (fileMatriculaContent) {
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: fileMatriculaContent // Já está em base64
        }
      });
    }

    // Configurar a chamada para o modelo
    const response = await ai.models.generateContent({
    //   model: "gemini-2.5-pro-exp-03-25",
      model: "gemini-2.5-flash-preview-04-17",
      contents: contents,
      config: {
        temperature: 0.5,
      }
    });
    //adiciona um arquivo de log para depuração
    // Essa é uma função auxiliar para ler o arquivo de resposta anterior para depuração
    // const response = await (async () => {
    //   try {
    //     // Importar fs e path para trabalhar com arquivos
    //     const fs = require('fs');
    //     const path = require('path');
    //     // Caminho para o arquivo de log para depuração
    //     const logFilePath = path.join(process.cwd(), 'logs', 'ai-response-07b03ebd-7f4a-4c52-a61b-fee7747d6009-2025-04-23T06-28-12-238Z.txt');
        
    //     // Verificar se o arquivo existe
    //     if (!fs.existsSync(logFilePath)) {
    //       console.warn(`Arquivo de depuração não encontrado: ${logFilePath}`);
    //       throw new Error("Arquivo de depuração não encontrado");
    //     }
        
    //     // Ler o conteúdo do arquivo
    //     const fileContent = fs.readFileSync(logFilePath, 'utf-8');
        
    //     // Retornar um objeto simulando a resposta da API
    //     return { text: fileContent };
    //   } catch (error) {
    //     console.error("Erro ao ler arquivo de depuração:", error);
    //     // Se falhar na leitura do arquivo, prosseguir com a chamada real à API
    //     const generatedContent = await ai.models.generateContent({
    //       model: "gemini-2.5-pro-exp-03-25",
    //       contents: contents,
    //       config: {
    //         temperature: 0.5,
    //       }
    //     });
    //     return generatedContent;
    //   }
    // })();

    const fullContent = response?.text || "";
    // try {
    //     const fs = require('fs');
    //     const path = require('path');
    //     const logDir = path.join(process.cwd(), 'logs');
        
    //     // Garantir que o diretório de logs exista
    //     if (!fs.existsSync(logDir)) {
    //       fs.mkdirSync(logDir, { recursive: true });
    //     }
        
    //     // Salvar o conteúdo completo com timestamp para identificação
    //     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    //     const logFilePath = path.join(logDir, `ai-response-${id}-${timestamp}.txt`);
    //     fs.writeFileSync(logFilePath, fullContent);
    //     // console.log(`Resposta completa salva em: ${logFilePath}`);
    //   } catch (logError) {
    //     console.error("Erro ao salvar log da resposta:", logError);
    //     // Não interrompe o fluxo se o log falhar
    //   }
    // Extrair o JSON e o HTML da resposta
    const extractContent = (content: string, startMarker: string, endMarker: string): string | null => {
        const escapeRegExp = (str: string) => {
            return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
        };
    
        // Função para remover os asteriscos no startMarker e endMarker
        const cleanMarker = (marker: string) => {
            return marker.replace(/\*/g, '').trim();
        };
    
        // Limpeza dos marcadores de início e fim
        const cleanedStartMarker = cleanMarker(startMarker);
        const cleanedEndMarker = cleanMarker(endMarker);
    
        // Escapa os marcadores antes de usá-los nas expressões regulares
        const escapedStart = escapeRegExp(cleanedStartMarker);
        const escapedEnd = escapeRegExp(cleanedEndMarker);
    
        // Tenta várias possibilidades de delimitadores
        const patterns: RegExp[] = [
            new RegExp(`${escapedStart}([\\s\\S]*?)${escapedEnd}`), // Genérico
            new RegExp(`\\*\\*${escapedStart}\\*\\*([\\s\\S]*?)${escapedEnd}`), // Comsterisco
            new RegExp(`\\\`\`\`json\\s*([\\s\\S]*?)\\\`\`\``), // Para JSON
            new RegExp(`\\\`\`\`html\\s*([\\s\\S]*?)\\\`\`\``), // Para HTML
        ];
    
        // Função para extrair um JSON válido de uma string
        const extractJSON = (str: string) => {
            let firstOpen = str.indexOf('{');
            let firstClose;
            let candidate;
            while (firstOpen !== -1) {
                firstClose = str.lastIndexOf('}');
                if (firstClose <= firstOpen) {
                    return null;
                }
                do {
                    candidate = str.substring(firstOpen, firstClose + 1);
                    try {
                        return JSON.parse(candidate); // Tenta fazer o parse do JSON
                    } catch (e) {
                        // Se falhar, continua tentando encontrar outro JSON
                    }
                    firstClose = str.substr(0, firstClose).lastIndexOf('}');
                } while (firstClose > firstOpen);
                firstOpen = str.indexOf('{', firstOpen + 1);
            }
            return null;
        };
    
        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match && match[1]) {
                let extractedContent = match[1].trim();
    
                // Limpa os delimitadores de Markdown (```json e ``` no começo e fim)
                extractedContent = extractedContent.replace(/^```json\s*/g, '').replace(/```$/g, '').trim();
    
                // Se os marcadores são JSON_START e JSON_END, tenta extrair o JSON
                if (cleanedStartMarker === "JSON_START" && cleanedEndMarker === "JSON_END") {
                    const jsonContent = extractJSON(extractedContent);
                    if (jsonContent) {
                        return JSON.stringify(jsonContent); // Retorna o JSON como string JSON
                    }
                }
    
                // Caso não seja JSON válido ou não seja a área de JSON, retorna o conteúdo original extraído
                return extractedContent;
            }
        }
    
        return null;
    };
    
    

      const jsonString = extractContent(fullContent, "JSON_START", "JSON_END");
      const htmlContent = extractContent(fullContent, "HTML_START", "HTML_END");

      console.log("jsonString", jsonString)
    //   console.log("htmlContent", htmlContent)
      
      if (!jsonString || !htmlContent) {
        throw new Error("Formato de resposta inválido da API");
      }
      const resultado = JSON.parse(jsonString);
        if (!resultado) {
            throw new Error("Erro ao processar o JSON da resposta da API");
        }
    // Retornar o resultado com o ID e o HTML
    return {
      id,
      ...resultado,
      html_content: htmlContent
    }
  } catch (error) {
    console.error("Erro ao analisar PDF com Google AI:", error)
    
    // Se for erro de quota, vamos propagar para fazer fallback para OpenRouter
    if (error instanceof Error && 
        (error.message.includes("QUOTA_EXCEEDED") || 
         error.message.includes("Resource has been exhausted") ||
         error.message.includes("Quota exceeded") ||
         error.message.includes("429"))) {
      throw new Error("QUOTA_EXCEEDED")
    }
    
    // Outros erros - retornamos um objeto de erro formatado
    let mensagemErro = "Não foi possível analisar o edital. Por favor, tente novamente."
    
    if (error instanceof Error) {
      if (error.message.includes("API")) {
        mensagemErro = error.message
      } else if (error.message.includes("JSON")) {
        mensagemErro = "Erro ao processar a resposta da análise. Por favor, tente novamente."
      }
    }

    // Retornar um resultado com mensagem de erro
    return {
      id,
      recomendacao: mensagemErro,
      riscos: ["Erro na análise do documento"],
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
            <p>${mensagemErro}</p>
            <p>Por favor, tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.</p>
          </div>
        </body>
        </html>
      `
    }
  }
}