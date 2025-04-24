"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UploadForm } from "@/components/upload-form"
import { useAuth } from "@/components/auth/auth-provider"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import type { Profile } from "@/lib/database.types"

export default function AnalisePage() {
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

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Análise de Edital de Leilão</h1>
            <p className="text-gray-300">
              Faça upload do edital do leilão imobiliário para obter uma análise detalhada e recomendações de
              investimento.
            </p>
          </div>
          <UploadForm />
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
