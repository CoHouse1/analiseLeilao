"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CreditPackages } from "@/components/credits/credit-packages"
import { TransactionHistory } from "@/components/credits/transaction-history"
import { useAuth } from "@/components/auth/auth-provider"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import type { Profile } from "@/lib/database.types"

export default function CreditsPage() {
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
        <h1 className="text-3xl font-bold mb-6 text-white">Comprar Créditos</h1>

        <div className="grid grid-cols-1 gap-8">
          <CreditPackages userId={user.id} />
          <TransactionHistory />
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
