"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Mail, MapPin, Phone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ContatoPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Simulação de envio de mensagem
    try {
      // Aqui seria a integração com um serviço de email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("Mensagem enviada com sucesso! Entraremos em contato em breve.")
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err: any) {
      setError("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 gradient-banner">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Entre em Contato</h1>
              <p className="text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Estamos aqui para ajudar. Entre em contato conosco para tirar dúvidas, fazer sugestões ou solicitar
                suporte.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-12 md:py-24 bg-orbit-blue">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
              <div>
                <Card className="bg-orbit-blue border-orbit-gray/30">
                  <CardHeader>
                    <CardTitle className="text-white">Envie uma Mensagem</CardTitle>
                    <CardDescription className="text-gray-300">
                      Preencha o formulário abaixo para entrar em contato conosco
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      {success && (
                        <Alert className="bg-green-900/50 border-green-800 text-green-200">
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-200">
                          Nome Completo
                        </Label>
                        <Input
                          id="name"
                          placeholder="Seu nome completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-200">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-200">
                          Assunto
                        </Label>
                        <Select value={subject} onValueChange={setSubject} required>
                          <SelectTrigger id="subject" className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200">
                            <SelectValue placeholder="Selecione um assunto" />
                          </SelectTrigger>
                          <SelectContent className="bg-orbit-blue border-orbit-gray/50">
                            <SelectItem value="suporte">Suporte Técnico</SelectItem>
                            <SelectItem value="vendas">Informações de Vendas</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="parceria">Parcerias</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-200">
                          Mensagem
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Digite sua mensagem aqui..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          className="min-h-[120px] bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-orbit-orange hover:bg-orbit-orange/90 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Enviando..." : "Enviar Mensagem"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Informações de Contato</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-orbit-orange mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Email</h3>
                        <p className="text-gray-300">contato@analiseleilao.com.br</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-orbit-orange mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Telefone</h3>
                        <p className="text-gray-300">(11) 4002-8922</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-orbit-orange mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Endereço</h3>
                        <p className="text-gray-300">
                          Av. Paulista, 1000, Bela Vista
                          <br />
                          São Paulo - SP, 01310-100
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="bg-orbit-blue border-orbit-gray/30">
                  <CardHeader>
                    <CardTitle className="text-white">Horário de Atendimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Segunda a Sexta</span>
                        <span className="text-white">9h às 18h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Sábado</span>
                        <span className="text-white">9h às 13h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Domingo e Feriados</span>
                        <span className="text-white">Fechado</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orbit-blue border-orbit-gray/30">
                  <CardHeader>
                    <CardTitle className="text-white">FAQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-white">Quanto tempo para resposta?</h3>
                        <p className="text-gray-300">Respondemos todas as mensagens em até 24 horas úteis.</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Oferecem suporte por telefone?</h3>
                        <p className="text-gray-300">
                          Sim, durante o horário comercial para clientes dos planos Padrão e Premium.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-orbit-gray/30 bg-orbit-blue">
        <div className="container py-6">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} AnaliseLeilão. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
