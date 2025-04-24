"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, AlertCircle, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { analisarEdital } from "@/lib/actions"
import { getSupabaseBrowser } from "@/lib/supabase/client"
// Lista completa de estados brasileiros
const estadosBrasileiros = [
  { valor: "AC", nome: "Acre" },
  { valor: "AL", nome: "Alagoas" },
  { valor: "AP", nome: "Amapá" },
  { valor: "AM", nome: "Amazonas" },
  { valor: "BA", nome: "Bahia" },
  { valor: "CE", nome: "Ceará" },
  { valor: "DF", nome: "Distrito Federal" },
  { valor: "ES", nome: "Espírito Santo" },
  { valor: "GO", nome: "Goiás" },
  { valor: "MA", nome: "Maranhão" },
  { valor: "MT", nome: "Mato Grosso" },
  { valor: "MS", nome: "Mato Grosso do Sul" },
  { valor: "MG", nome: "Minas Gerais" },
  { valor: "PA", nome: "Pará" },
  { valor: "PB", nome: "Paraíba" },
  { valor: "PR", nome: "Paraná" },
  { valor: "PE", nome: "Pernambuco" },
  { valor: "PI", nome: "Piauí" },
  { valor: "RJ", nome: "Rio de Janeiro" },
  { valor: "RN", nome: "Rio Grande do Norte" },
  { valor: "RS", nome: "Rio Grande do Sul" },
  { valor: "RO", nome: "Rondônia" },
  { valor: "RR", nome: "Roraima" },
  { valor: "SC", nome: "Santa Catarina" },
  { valor: "SP", nome: "São Paulo" },
  { valor: "SE", nome: "Sergipe" },
  { valor: "TO", nome: "Tocantins" },
];

export function UploadForm() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [fileMatricula, setFileMatricula] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tipoImovel, setTipoImovel] = useState("")
  const [matricula, setMatricula] = useState("")
  const [estado, setEstado] = useState("")
  const [cidade, setCidade] = useState("")
  const [instrucoes, setInstrucoes] = useState("")
  // Fases do processamento para feedback ao usuário
  const [etapaProcessamento, setEtapaProcessamento] = useState<number>(0)
  const [subEtapa, setSubEtapa] = useState<number>(0)

  // Validação de formulário
  const [formValidado, setFormValidado] = useState(true)
  const [camposComErro, setCamposComErro] = useState<string[]>([])

  const validatePDFFile = (selectedFile: File | null): string | null => {
    if (!selectedFile) return null

    if (selectedFile.type !== "application/pdf") {
      return "Por favor, selecione um arquivo PDF."
    }
    
    // Limite de 10MB (10 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      return `O arquivo não pode ser maior que 10MB. Tamanho atual: ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`
    }
    return null
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const errorMsg = validatePDFFile(selectedFile)
      if (errorMsg) {
        setError(errorMsg)
        setFile(null)
        return
      }
      setError(null)
      setFile(selectedFile)
    }
  }, [])

  const handleFileMatriculaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const errorMsg = validatePDFFile(selectedFile)
      if (errorMsg) {
        setError(errorMsg)
        setFileMatricula(null)
        return
      }
      setError(null)
      setFileMatricula(selectedFile)
    }
  }, [])

  const validarFormulario = useCallback(() => {
    const erros: string[] = []
    
    if (!file) {
      erros.push("file")
    }
    
    // Os campos abaixo são opcionais, mas melhoram a análise
    // Poderíamos adicionar validações específicas se necessário
    
    setCamposComErro(erros)
    return erros.length === 0
  }, [file])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar formulário antes de enviar
    if (!validarFormulario()) {
      setFormValidado(false)
      setError("Por favor, selecione um arquivo PDF do edital para análise.")
      return
    }

    setLoading(true)
    setError(null)
    setFormValidado(true)
    setEtapaProcessamento(1) // Iniciando processamento

    try {
      const formData = new FormData()
      formData.append("file", file!)
      
      // Adicionar a matrícula se existir
      if (fileMatricula) {
        formData.append("fileMatricula", fileMatricula)
      }
      
      formData.append("tipoImovel", tipoImovel)
      formData.append("matricula", matricula)
      formData.append("estado", estado)
      formData.append("cidade", cidade)
      formData.append("instrucoes", instrucoes)

      // Pegar os cookies do navegador para passá-los para o servidor
const supabase = getSupabaseBrowser()
const { data } = await supabase.auth.getSession()
const accessToken = data.session?.access_token
      if (!accessToken) {
        throw new Error("Não autenticado. Por favor, faça login.")
      }
      
      // Feedback mais detalhado para o usuário
      setEtapaProcessamento(2) // Enviando arquivo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Etapa 3 com sub-etapas para feedback mais detalhado
      setEtapaProcessamento(3) // Fase de análise documental
      
      // Simular progresso nas sub-etapas enquanto espera a resposta da API
      const intervaloProgresso = setInterval(() => {
        setSubEtapa(prev => {
          if (prev < 5) return prev + 1;
          return prev;
        });
      }, 4000);
      
      const response = await fetch("/api/analise", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao processar a análise");
      }
      
      const resultado = await response.json();
      
      clearInterval(intervaloProgresso);
      setEtapaProcessamento(4) // Análise concluída

      // Redirecionar para a página de resultados
      router.push(`/analise/resultado?id=${resultado.id}`)
    } catch (err: any) {
      console.error("Erro ao processar análise:", err)
      
      // Determinar mensagem específica de erro baseado na resposta
      let mensagemErro = "Ocorreu um erro ao processar o arquivo. Por favor, tente novamente."
      
      if (err.message) {
        if (err.message.includes("não autenticado")) {
          mensagemErro = "Você precisa estar logado para realizar esta operação. Por favor, faça login."
        } else if (err.message.includes("créditos suficientes")) {
          mensagemErro = "Você não possui créditos suficientes para realizar esta análise. Adquira mais créditos."
        } else if (err.message.includes("tamanho") || err.message.includes("size")) {
          mensagemErro = "O arquivo excede o tamanho máximo permitido. O limite é de 10MB."
        } else {
          mensagemErro = err.message
        }
      }
      
      setError(mensagemErro)
    } finally {
      setLoading(false)
      setEtapaProcessamento(0)
      setSubEtapa(0)
    }
  }

  // Mostrar texto com base na etapa atual de processamento
  const obterTextoEtapa = () => {
    switch (etapaProcessamento) {
      case 1:
        return "Preparando documentos para análise..."
      case 2:
        return "Enviando arquivos para processamento..."
      case 3:
        // Sub-etapas para a fase de análise
        switch (subEtapa) {
          case 0:
            return "Extraindo informações do edital..."
          case 1:
            return "Verificando condições do leilão..."
          case 2:
            return "Analisando minuciosamente o documento..."
          case 3:
            return "Identificando possíveis riscos jurídicos..."
          case 4:
            return "Avaliando requisitos e prazos do leilão..."
          case 5:
            return "Finalizando relatório de viabilidade... (Pode levar alguns minutos)"
          default:
            return "Processando documentação do leilão..."
        }
      case 4:
        return "Análise concluída! Preparando relatório..."
      default:
        return "Processando sua solicitação..."
    }
  }

  // Calcular progresso com base na etapa atual e sub-etapas
  const calcularProgresso = () => {
    switch (etapaProcessamento) {
      case 0: return 0
      case 1: return 10
      case 2: return 30
      case 3: 
        // Distribuir o progresso de 40% a 90% entre as sub-etapas
        return 40 + (subEtapa * 10)
      case 4: return 100
      default: return 0
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Upload do Edital</CardTitle>
          <CardDescription className="text-gray-300">Faça upload do arquivo PDF do edital do leilão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div 
              className={`flex flex-col items-center justify-center border-2 border-dashed 
                ${camposComErro.includes("file") ? "border-red-500" : "border-orbit-gray/50"} 
                rounded-lg p-12 bg-orbit-gray/20 transition-colors`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-10 w-10 text-orbit-orange" />
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-gray-300">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                    className="border-orbit-gray/50 text-gray-300 hover:bg-orbit-gray/30"
                  >
                    Alterar arquivo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-gray-300">Solte aqui o arquivo PDF do edital ou</p>
                    <Label htmlFor="file-upload" className="text-orbit-orange cursor-pointer hover:underline">
                      clique para anexar
                    </Label>
                  </div>
                  <p className="text-xs text-gray-400">O tamanho máximo do arquivo é 10MB</p>
                </div>
              )}
              <Input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Área de upload da matrícula */}
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Upload da Matrícula (Opcional)</CardTitle>
          <CardDescription className="text-gray-300">Faça upload do arquivo PDF da matrícula do imóvel para análise mais completa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div 
              className={`flex flex-col items-center justify-center border-2 border-dashed 
                border-orbit-gray/50 
                rounded-lg p-12 bg-orbit-gray/20 transition-colors`}
            >
              {fileMatricula ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-10 w-10 text-orbit-orange" />
                  <p className="font-medium text-white">{fileMatricula.name}</p>
                  <p className="text-sm text-gray-300">{(fileMatricula.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFileMatricula(null)}
                    className="border-orbit-gray/50 text-gray-300 hover:bg-orbit-gray/30"
                  >
                    Remover arquivo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-gray-300">Solte aqui o arquivo PDF da matrícula ou</p>
                    <Label htmlFor="file-matricula-upload" className="text-orbit-orange cursor-pointer hover:underline">
                      clique para anexar
                    </Label>
                  </div>
                  <p className="text-xs text-gray-400">O tamanho máximo do arquivo é 10MB</p>
                </div>
              )}
              <Input id="file-matricula-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileMatriculaChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Informações do Imóvel</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-full p-1 bg-orbit-gray/30 cursor-help">
                    <Info className="h-4 w-4 text-gray-300" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-orbit-blue border-orbit-gray/50 text-gray-200">
                  <p>Fornecer estas informações melhora a qualidade da análise</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="text-gray-300">
            Preencha os dados do imóvel para uma análise mais precisa (opcional)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoImovel" className="text-gray-200">
                Tipo do Imóvel
              </Label>
              <Select value={tipoImovel} onValueChange={setTipoImovel}>
                <SelectTrigger id="tipoImovel" className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-orbit-blue border-orbit-gray/50">
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula" className="text-gray-200">
                Matrícula/CNM
              </Label>
              <Input
                id="matricula"
                placeholder="Digite a matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-gray-200">
                Estado
              </Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger id="estado" className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent className="bg-orbit-blue border-orbit-gray/50 h-[300px] overflow-y-auto">
                  {estadosBrasileiros.map((estado) => (
                    <SelectItem key={estado.valor} value={estado.valor}>
                      {estado.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-gray-200">
                Cidade
              </Label>
              <Input
                id="cidade"
                placeholder="Digite o município"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Instruções Adicionais</CardTitle>
          <CardDescription className="text-gray-300">
            Forneça informações adicionais ou perguntas específicas sobre o edital (opcional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Exemplo: Quero saber se há riscos jurídicos neste leilão. Verifique se o imóvel possui dívidas de IPTU ou condomínio."
            className="min-h-[120px] bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
            value={instrucoes}
            onChange={(e) => setInstrucoes(e.target.value)}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <Card className="bg-orbit-blue border-orbit-gray/30">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-200">{obterTextoEtapa()}</span>
                <span className="text-sm text-gray-400">{calcularProgresso()}%</span>
              </div>
              <Progress value={calcularProgresso()} className="h-2 bg-orbit-gray/30" indicatorClassName="bg-orbit-orange" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Esta análise consumirá 1 crédito da sua conta
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="bg-orbit-orange hover:bg-orbit-orange/90 text-white"
        >
          {loading ? "Processando..." : "Analisar Documentos"}
        </Button>
      </div>
    </form>
  )
}
