"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ error: any; data: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)

        // Obter a sessão atual
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        if (currentSession) {
          console.log("Sessão atual: Autenticado")
          setSession(currentSession)
          setUser(currentSession.user)
        } else {
          console.log("Sessão atual: Não autenticado")
          setSession(null)
          setUser(null)
        }

        // Configurar o listener para mudanças de autenticação
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, eventSession) => {
          console.log("Evento de autenticação:", event)

          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
            console.log("Usuário autenticado:", eventSession?.user?.email)
            setSession(eventSession)
            setUser(eventSession?.user ?? null)
          } else if (event === "SIGNED_OUT") {
            console.log("Usuário desconectado")
            setSession(null)
            setUser(null)
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [supabase])

  // Efeito para verificar rotas protegidas
  useEffect(() => {
    if (isLoading) return

    // Lista de rotas protegidas
    const protectedRoutes = ["/dashboard", "/analise", "/analise/resultado", "/perfil", "/creditos"]
    const isProtectedRoute = protectedRoutes.some((route) => pathname?.startsWith(route))

    // Redirecionar usuários não autenticados em rotas protegidas
    if (isProtectedRoute && !session) {
      console.log("AuthProvider: Redirecionando para login (rota protegida sem sessão)")
      router.push(`/entrar?redirect=${encodeURIComponent(pathname || "/dashboard")}`)
    }
  }, [isLoading, session, pathname, router])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Tentando fazer login com:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Erro no login:", error.message)
        return { error }
      }

      console.log("Login bem-sucedido, redirecionando...")
      router.push("/dashboard")
      return { error: null }
    } catch (err: any) {
      console.error("Exceção no login:", err)
      return { error: err }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      return { error }
    } catch (err: any) {
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (err: any) {
      return { error: err }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      return { error }
    } catch (err: any) {
      return { error: err }
    }
  }

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    try {
      // Atualizar os metadados do usuário no Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          avatar_url: data.avatar_url,
        },
      })

      if (authError) {
        throw authError
      }

      // Atualizar o perfil na tabela profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)
        .select()
        .single()

      if (profileError) {
        throw profileError
      }

      return { error: null, data: profileData }
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err)
      return { error: err, data: null }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
