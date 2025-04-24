"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth/auth-provider"
import { useState, useEffect } from "react"
import type { Profile } from "@/lib/database.types"
import { getSupabaseBrowser } from "@/lib/supabase/client"

interface HeaderProps {
  user?: Profile | null
}

export function Header({ user: userProp }: HeaderProps) {
  const { user: authUser, signOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  
  // Usar o usuário fornecido como prop, ou buscar os dados do perfil quando 
  // o usuário estiver autenticado mas não tiver os dados de perfil passados
  useEffect(() => {
    const fetchProfile = async () => {
      // Se já temos dados do perfil via prop, usamos esses dados
      if (userProp) {
        setProfile(userProp)
        return
      }
      
      // Se não temos dados do usuário autenticado, não há nada para buscar
      if (!authUser) {
        setProfile(null)
        return
      }
      
      // Buscar dados do perfil do usuário no Supabase
      try {
        const supabase = getSupabaseBrowser()
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single()
        
        if (error) {
          console.error("Erro ao buscar perfil:", error)
          return
        }
        
        setProfile(data)
      } catch (error) {
        console.error("Erro ao buscar perfil:", error)
      }
    }
    
    fetchProfile()
  }, [userProp, authUser])

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Determinar se o usuário está autenticado com base nos dados disponíveis
  const isAuthenticated = Boolean(userProp || profile)
  const userData = userProp || profile

  return (
    <div className="w-full">
      <div className="notification-banner text-white py-2 px-4 text-center text-sm">
        <span>50 créditos grátis para testar</span>
        <span className="mx-4">•</span>
        <span>Acesse todos os recursos</span>
      </div>
      <header className="bg-orbit-blue border-b border-orbit-gray/30">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-orbit-orange" />
            <Link href="/" className="text-xl font-bold text-white">
              AnaliseLeilão
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white">
              Início
            </Link>
            <Link href="/como-funciona" className="text-sm font-medium text-gray-300 hover:text-white">
              Como Funciona
            </Link>
            <Link href="/precos" className="text-sm font-medium text-gray-300 hover:text-white">
              Preços
            </Link>
            <Link href="/contato" className="text-sm font-medium text-gray-300 hover:text-white">
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.avatar_url || undefined} alt={userData?.full_name || "Usuário"} />
                    <AvatarFallback className="bg-orbit-orange text-white">
                      {getInitials(userData?.full_name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{userData?.full_name || "Usuário"}</span>
                    <Link href="/perfil" className="text-xs text-gray-400 hover:text-gray-300">
                      Meu Perfil
                    </Link>
                  </div>
                </div>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon" className="text-gray-300">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-orbit-blue border-orbit-gray/30 w-[300px] p-0">
                    {/* Menu mobile content goes here, simplified for the main header */}
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b border-orbit-gray/30">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-6 w-6 text-orbit-orange" />
                            <span className="text-xl font-bold text-white">AnaliseLeilão</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-gray-300" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border-t border-orbit-gray/30">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-300 hover:bg-orbit-gray/20 hover:text-white"
                          onClick={handleSignOut}
                          disabled={isLoggingOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {isLoggingOut ? "Saindo..." : "Sair"}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden md:flex text-gray-300 hover:text-white"
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Saindo..." : "Sair"}
                </Button>
                
                <Link href="/dashboard">
                  <Button size="sm" className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/entrar">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastrar">
                  <Button size="sm" className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                    Começar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
