import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PrecosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 gradient-banner">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Planos e Preços</h1>
              <p className="text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Escolha o plano ideal para suas necessidades de análise de leilões imobiliários
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24 bg-orbit-blue">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-orbit-blue border-orbit-gray/30">
                <CardHeader>
                  <CardTitle className="text-white">Básico</CardTitle>
                  <CardDescription className="text-gray-300">Para investidores iniciantes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">R$ 49,90</span>
                    <span className="text-gray-300 ml-1">/ 10 créditos</span>
                  </div>
                  <p className="text-sm text-gray-400 text-center">R$ 4,99 por análise</p>
                  <ul className="space-y-2 mt-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">10 análises de editais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise jurídica básica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise financeira básica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Acesso por 30 dias</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/cadastrar" className="w-full">
                    <Button className="w-full bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                      Começar Agora
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="bg-orbit-blue border-orbit-orange relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orbit-orange text-white text-xs font-bold py-1 px-3 rounded-full">
                  Mais Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Padrão</CardTitle>
                  <CardDescription className="text-gray-300">Para investidores regulares</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">R$ 129,90</span>
                    <span className="text-gray-300 ml-1">/ 30 créditos</span>
                  </div>
                  <p className="text-sm text-gray-400 text-center">R$ 4,33 por análise</p>
                  <ul className="space-y-2 mt-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">30 análises de editais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise jurídica detalhada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise financeira completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Acesso por 60 dias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Suporte por email</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/cadastrar" className="w-full">
                    <Button className="w-full bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                      Escolher Plano
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="bg-orbit-blue border-orbit-gray/30">
                <CardHeader>
                  <CardTitle className="text-white">Premium</CardTitle>
                  <CardDescription className="text-gray-300">Para investidores profissionais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">R$ 349,90</span>
                    <span className="text-gray-300 ml-1">/ 100 créditos</span>
                  </div>
                  <p className="text-sm text-gray-400 text-center">R$ 3,50 por análise</p>
                  <ul className="space-y-2 mt-6">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">100 análises de editais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise jurídica avançada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise financeira premium</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Acesso por 90 dias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Suporte prioritário</span>
                    </li>
                    {/* <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">Consulta com especialista</span>
                    </li> */}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/cadastrar" className="w-full">
                    <Button className="w-full bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                      Escolher Plano
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 gradient-banner">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Perguntas Frequentes</h2>
              <p className="text-gray-300">Tire suas dúvidas sobre nossos planos e preços</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">O que são créditos?</h3>
                <p className="text-gray-300">
                  Créditos são a moeda utilizada na plataforma para realizar análises de editais. Cada análise consome 1
                  crédito.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Os créditos expiram?</h3>
                <p className="text-gray-300">
                  Sim, os créditos têm validade de acordo com o plano escolhido: 30 dias para o plano Básico, 60 dias
                  para o plano Padrão e 90 dias para o plano Premium.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Posso cancelar minha assinatura?</h3>
                <p className="text-gray-300">
                  Não trabalhamos com assinatura. Você compra pacotes de créditos conforme sua necessidade, sem
                  compromisso mensal.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Como funciona o suporte?</h3>
                <p className="text-gray-300">
                  O suporte por email está disponível para os planos Padrão e Premium. O plano Premium conta com suporte
                  prioritário e uma consulta com especialista.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Posso comprar mais créditos?</h3>
                <p className="text-gray-300">
                  Sim, você pode comprar pacotes adicionais de créditos a qualquer momento, mesmo que ainda tenha
                  créditos disponíveis.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Quais formas de pagamento são aceitas?</h3>
                <p className="text-gray-300">
                  Aceitamos cartões de crédito, boleto bancário e PIX para a compra de créditos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-orbit-blue">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Comece a Investir com Confiança
              </h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Cadastre-se hoje e ganhe créditos gratuitos para testar nossa plataforma
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Link href="/cadastrar">
                  <Button size="lg" className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                    Criar Conta Grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
