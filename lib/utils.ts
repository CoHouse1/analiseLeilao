"use server"

import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'

// Declare global variables
declare global {
  var googleQuotaExceeded: boolean;
  var lastQuotaCheck: number;
}

/**
 * Converte um PDF em base64 para um array de imagens em base64
 */
export async function convertPDFToImages(pdfBase64: string): Promise<string[]> {
  try {
    // Decodificar o PDF de base64 para buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64')
    
    // Carregar o PDF usando pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const totalPages = pdfDoc.getPageCount()
    
    const imagePromises: Promise<string>[] = []
    
    // Para cada página do PDF, renderizar uma imagem usando sharp
    for (let i = 0; i < totalPages; i++) {
      // Extrair apenas esta página do PDF
      const singlePagePdf = await PDFDocument.create()
      const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i])
      singlePagePdf.addPage(copiedPage)
      
      // Salvar como buffer
      const pageBuffer = await singlePagePdf.save()
      
      // Usar sharp para converter para PNG
      const imagePromise = sharp(pageBuffer, { density: 300 }) // Alta densidade para melhor qualidade
        .png({ quality: 100 })
        .toBuffer()
        .then(buffer => buffer.toString('base64'))
      
      imagePromises.push(imagePromise)
    }
    
    // Aguardar todas as conversões terminarem
    const images = await Promise.all(imagePromises)
    return images
  } catch (error) {
    console.error('Erro ao converter PDF para imagens:', error)
    throw new Error('Não foi possível converter o PDF para imagens')
  }
}

// Função para gerenciar o estado da API
export async function getAPIConfig(): Promise<any> {
  // Em uma implementação real, isso viria de um banco de dados ou armazenamento persistente
  // Por enquanto, vamos simular com variáveis globais
  return {
    googleQuotaExceeded: global.googleQuotaExceeded || false,
    lastQuotaCheck: global.lastQuotaCheck || 0
  };
}

export async function setAPIConfig(config: any): Promise<void> {
  // Em uma implementação real, isso seria salvo em um banco de dados
  global.googleQuotaExceeded = config.googleQuotaExceeded;
  global.lastQuotaCheck = config.lastQuotaCheck;
}


