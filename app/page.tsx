import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, BarChart3, Shield, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 gradient-banner">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-4 mb-6">
                    <span className="bg-orbit-gray/50 text-sm px-3 py-1 rounded-full text-gray-300">
                      Análise de Editais
                    </span>
                    <span className="bg-orbit-gray/50 text-sm px-3 py-1 rounded-full text-gray-300">
                      Para Investidores
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Análise Inteligente de Leilões Imobiliários
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Descubra oportunidades de investimento em leilões imobiliários com análise detalhada de editais e
                    recomendações personalizadas.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/cadastrar">
                    <Button size="lg" className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                      Começar Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/como-funciona">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-orbit-gray/20"
                    >
                      Saiba Mais
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 lg:flex-1">
                <div className="card-gradient rounded-lg p-6 shadow-lg border border-orbit-gray/30">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange" />
                      <p className="text-sm md:text-base text-gray-200">Análise completa de editais de leilão</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange" />
                      <p className="text-sm md:text-base text-gray-200">Identificação de riscos e oportunidades</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange" />
                      <p className="text-sm md:text-base text-gray-200">Recomendações de investimento claras</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange" />
                      <p className="text-sm md:text-base text-gray-200">Avaliação de valor de mercado</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange" />
                      <p className="text-sm md:text-base text-gray-200">Análise jurídica dos documentos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-orbit-blue">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Como Funciona
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Análise detalhada de leilões imobiliários em apenas três passos simples
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 rounded-lg border border-orbit-gray/30 p-6 shadow-sm card-gradient">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orbit-orange text-white">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">Faça Upload do Edital</h3>
                <p className="text-gray-300">Envie o PDF do edital do leilão imobiliário que deseja analisar.</p>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border border-orbit-gray/30 p-6 shadow-sm card-gradient">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orbit-orange text-white">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">Processamento Inteligente</h3>
                <p className="text-gray-300">
                  Nossa IA analisa todos os detalhes do documento, identificando riscos e oportunidades.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border border-orbit-gray/30 p-6 shadow-sm card-gradient">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orbit-orange text-white">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">Receba a Análise</h3>
                <p className="text-gray-300">
                  Obtenha um relatório detalhado com recomendações claras sobre o investimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 gradient-banner">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Recursos Poderosos
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tudo o que você precisa para tomar decisões de investimento inteligentes
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orbit-orange/20">
                  <BarChart3 className="h-8 w-8 text-orbit-orange" />
                </div>
                <h3 className="text-xl font-bold text-white">Análise Financeira</h3>
                <p className="text-gray-300">
                  Avaliação detalhada do valor de mercado, potencial de valorização e retorno sobre investimento.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orbit-orange/20">
                  <Shield className="h-8 w-8 text-orbit-orange" />
                </div>
                <h3 className="text-xl font-bold text-white">Análise Jurídica</h3>
                <p className="text-gray-300">
                  Identificação de riscos legais, pendências judiciais e restrições que podem afetar o imóvel.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orbit-orange/20">
                  <FileText className="h-8 w-8 text-orbit-orange" />
                </div>
                <h3 className="text-xl font-bold text-white">Relatórios Detalhados</h3>
                <p className="text-gray-300">
                  Relatórios completos com todas as informações necessárias para tomar decisões informadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-orbit-blue">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Comece a Investir com Confiança
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Cadastre-se hoje e ganhe créditos gratuitos para testar nossa plataforma
                </p>
              </div>
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
