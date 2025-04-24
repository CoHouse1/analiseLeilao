"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserCreditsCard } from "@/components/dashboard/user-credits"
import { RecentAnalyses } from "@/components/dashboard/recent-analyses"
import { CreditHistory } from "@/components/dashboard/credit-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import type { Profile } from "@/lib/database.types"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Erro ao buscar perfil:", error)
        } else {
          setProfile(data)
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchProfile()
    }
  }, [user, authLoading, supabase])

  // Mostrar tela de carregamento enquanto verifica autenticação ou busca dados
  if (authLoading || (isLoading && user)) {
    return <LoadingScreen />
  }

  // Se não tiver usuário, mostrar mensagem (o redirecionamento será feito pelo AuthProvider)
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={null} />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Carregando...</h1>
          <p className="text-gray-300">Verificando autenticação...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <UserCreditsCard />
          </div>
          <div className="md:col-span-1">
            <Card className="bg-orbit-blue border-orbit-gray/30 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orbit-orange" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-md bg-orbit-gray/20">
                    <span className="text-gray-300">Análises Realizadas</span>
                    <span className="text-xl font-bold text-white">0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-md bg-orbit-gray/20">
                    <span className="text-gray-300">Créditos Utilizados</span>
                    <span className="text-xl font-bold text-white">0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-md bg-orbit-gray/20">
                    <span className="text-gray-300">Última Análise</span>
                    <span className="text-white">Nunca</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentAnalyses />
          <CreditHistory />
        </div>
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
