"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { SecuritySettings } from "@/components/profile/security-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import type { Profile } from "@/lib/database.types"

export default function ProfilePage() {
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

  // Se tiver usuário mas não tiver perfil, mostrar mensagem de erro
  if (user && !profile && !isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={null} />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Erro ao carregar perfil</h1>
          <p className="text-gray-300">Não foi possível carregar os dados do seu perfil. Por favor, tente novamente.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Meu Perfil</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-orbit-gray/30">
            <TabsTrigger value="profile" className="data-[state=active]:bg-orbit-orange data-[state=active]:text-white">
              Perfil
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-orbit-orange data-[state=active]:text-white"
            >
              Segurança
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm profile={profile} />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
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
