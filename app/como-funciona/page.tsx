import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, FileText, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export default function ComoFuncionaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 gradient-banner">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Como Funciona o AnaliseLeilão
              </h1>
              <p className="text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Entenda como nossa plataforma analisa editais de leilões imobiliários para ajudar você a tomar decisões
                de investimento mais inteligentes
              </p>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="w-full py-12 md:py-24 bg-orbit-blue">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:gap-16">
              <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-orbit-orange/20 px-3 py-1 text-sm text-orbit-orange">
                    Passo 1
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                    Upload do Edital do Leilão
                  </h2>
                  <p className="text-gray-300 md:text-xl/relaxed">
                    Faça o upload do PDF do edital do leilão imobiliário que você deseja analisar. Nossa plataforma
                    aceita documentos de qualquer tamanho e formato, desde que estejam em PDF.
                  </p>
                </div>
                <div className="card-gradient rounded-lg p-6 shadow-lg border border-orbit-gray/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orbit-orange text-white">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-white">Upload do Edital</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">Suporte para editais de leilões judiciais e extrajudiciais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">Processamento rápido de documentos de qualquer tamanho</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">Suporte para informações adicionais sobre o imóvel</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center md:flex-row-reverse">
                <div className="space-y-4 md:order-last">
                  <div className="inline-block rounded-lg bg-orbit-orange/20 px-3 py-1 text-sm text-orbit-orange">
                    Passo 2
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                    Processamento Inteligente
                  </h2>
                  <p className="text-gray-300 md:text-xl/relaxed">
                    Nossa inteligência artificial analisa o documento em detalhes, extraindo informações relevantes
                    sobre o imóvel, condições do leilão, riscos jurídicos e oportunidades de investimento.
                  </p>
                </div>
                <div className="card-gradient rounded-lg p-6 shadow-lg border border-orbit-gray/30 md:order-first">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orbit-orange text-white">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-white">Processamento Inteligente</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise detalhada de todos os aspectos do edital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">
                        Identificação de cláusulas importantes e condições especiais
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">Avaliação de riscos jurídicos e financeiros</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 md:gap-12 items-center">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-orbit-orange/20 px-3 py-1 text-sm text-orbit-orange">
                    Passo 3
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Relatório Completo</h2>
                  <p className="text-gray-300 md:text-xl/relaxed">
                    Receba um relatório detalhado com recomendações claras sobre o investimento, análise de riscos e
                    oportunidades, avaliação do valor de mercado e muito mais.
                  </p>
                </div>
                <div className="card-gradient rounded-lg p-6 shadow-lg border border-orbit-gray/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orbit-orange text-white">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-white">Relatório Completo</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">Recomendação clara sobre o investimento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise financeira com estimativa de valor de mercado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orbit-orange shrink-0 mt-0.5" />
                      <span className="text-gray-200">Análise jurídica detalhada dos riscos e oportunidades</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 gradient-banner">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Recursos Exclusivos
              </h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Conheça os recursos que tornam o AnaliseLeilão a melhor ferramenta para investidores imobiliários
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-orbit-blue border-orbit-gray/30">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orbit-orange/20">
                      <FileText className="h-8 w-8 text-orbit-orange" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Análise Documental</h3>
                    <p className="text-gray-300">
                      Análise completa do edital, identificando cláusulas importantes, condições especiais e possíveis
                      armadilhas.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orbit-blue border-orbit-gray/30">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orbit-orange/20">
                      <BarChart3 className="h-8 w-8 text-orbit-orange" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Análise Financeira</h3>
                    <p className="text-gray-300">
                      Avaliação do valor de mercado do imóvel, potencial de valorização e retorno sobre investimento.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orbit-blue border-orbit-gray/30">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orbit-orange/20">
                      <Shield className="h-8 w-8 text-orbit-orange" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Análise Jurídica</h3>
                    <p className="text-gray-300">
                      Identificação de riscos legais, pendências judiciais e restrições que podem afetar o imóvel.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-orbit-blue">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Pronto para Começar?
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
