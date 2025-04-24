"use server"

export interface AnalisePDFParams {
  id: string
  fileName: string
  fileContent: string
  tipoImovel: string
  matricula: string
  fileMatriculaContent?: string  // Conteúdo do arquivo da matrícula (opcional)
  fileMatriculaName?: string     // Nome do arquivo da matrícula (opcional)
  estado: string
  cidade: string
  instrucoes: string
}

export interface ResultadoAnalise {
  id: string
  recomendacao: string
  riscos: string[]
  oportunidades: string[]
  valorEstimado: string
  detalhesImovel: {
    endereco: string
    area: string
    descricao: string
  }
  detalhesLeilao: {
    dataLeilao: string
    valorInicial: string
    incrementoMinimo: string
    formasPagamento: string[]
  }
  analiseJuridica: string
  analiseFinanceira: string
  html_content?: string  // Conteúdo HTML gerado diretamente pela IA
}

// Configurações de API
export interface APIConfig {
  googleQuotaExceeded: boolean;  // Flag para indicar se a cota da Google AI foi excedida
  lastQuotaCheck: number;        // Timestamp da última verificação de cota
}

// Estado padrão da configuração
export const defaultAPIConfig: APIConfig = {
  googleQuotaExceeded: false,
  lastQuotaCheck: 0
}