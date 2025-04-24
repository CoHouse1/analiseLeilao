
import { Metadata } from "next"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Footer } from "@/components/footer"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ResultadoAnalise } from "@/components/resultado-analise"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Database } from "@/lib/database.types"

export const metadata: Metadata = {
  title: "Resultado da Análise | AnaliseLeilão",
  description: "Resultado detalhado da análise do edital de leilão",
}

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  // Aguardar os parâmetros da URL de forma assíncrona
  const resolvedParams = await searchParams;
  const id = resolvedParams.id;
  
  // Inicializar o cliente Supabase para buscar o perfil do usuário
  const cookiesStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies });
  
  
  // Buscar o usuário atual e seu perfil
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    profile = data;
  }
  
  // Verificar se o ID foi fornecido
  if (!id) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={profile} />
        <main className="flex-1 container py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-orbit-blue border-orbit-gray/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                  <h1 className="text-2xl font-bold text-white">ID da análise não fornecido</h1>
                  <p className="text-gray-300">Não foi possível encontrar a análise solicitada.</p>
                  <Link href="/dashboard/analises">
                    <Button className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar para Análises
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Se tudo estiver ok, mostrar o resultado
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Resultado da Análise</h1>
            <Link href="/dashboard/analises">
              <Button variant="outline" className="border-orbit-gray/50 text-gray-300 hover:bg-orbit-gray/30">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Análises
              </Button>
            </Link>
          </div>
          <ResultadoAnalise id={id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
