"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, User, CreditCard, FileText, LogOut, Menu, X, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth/auth-provider"
import { useState } from "react"
import type { Profile } from "@/lib/database.types"

interface DashboardHeaderProps {
  user: Profile | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { signOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  return (
    <div className="w-full">
      <div className="notification-banner text-white py-2 px-4 text-center text-sm">
        <span>50 créditos gratuitos para testar</span>
        <span className="mx-4">•</span>
        <span>Acesse todos os recursos</span>
      </div>
      <header className="bg-orbit-blue border-b border-orbit-gray/30">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-orbit-orange" />
            <Link href="/dashboard" className="text-xl font-bold text-white">
              AnaliseLeilão
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link href="/analise" className="text-sm font-medium text-gray-300 hover:text-white">
              Nova Análise
            </Link>
            <Link href="/dashboard/analises" className="text-sm font-medium text-gray-300 hover:text-white">
              Minhas Análises
            </Link>
            <Link href="/creditos" className="text-sm font-medium text-gray-300 hover:text-white">
              Créditos
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url || undefined} alt={user?.full_name || "Usuário"} />
                <AvatarFallback className="bg-orbit-orange text-white">
                  {getInitials(user?.full_name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{user?.full_name || "Usuário"}</span>
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
                    <div className="flex items-center gap-3 p-3 rounded-md bg-orbit-gray/20">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar_url || undefined} alt={user?.full_name || "Usuário"} />
                        <AvatarFallback className="bg-orbit-orange text-white">
                          {getInitials(user?.full_name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{user?.full_name || "Usuário"}</p>
                        <p className="text-sm text-gray-400">{user?.email || ""}</p>
                      </div>
                    </div>
                  </div>

                  <nav className="flex-1 p-4">
                    <div className="space-y-1">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-md hover:bg-orbit-gray/20">
                          <Activity className="h-5 w-5 text-orbit-orange" />
                          <span className="text-gray-200">Dashboard</span>
                        </div>
                      </Link>
                      <Link href="/analise" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-md hover:bg-orbit-gray/20">
                          <FileText className="h-5 w-5 text-orbit-orange" />
                          <span className="text-gray-200">Nova Análise</span>
                        </div>
                      </Link>
                      <Link href="/dashboard/analises" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-md hover:bg-orbit-gray/20">
                          <FileText className="h-5 w-5 text-orbit-orange" />
                          <span className="text-gray-200">Minhas Análises</span>
                        </div>
                      </Link>
                      <Link href="/creditos" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-md hover:bg-orbit-gray/20">
                          <CreditCard className="h-5 w-5 text-orbit-orange" />
                          <span className="text-gray-200">Créditos</span>
                        </div>
                      </Link>
                      <Link href="/perfil" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-md hover:bg-orbit-gray/20">
                          <User className="h-5 w-5 text-orbit-orange" />
                          <span className="text-gray-200">Meu Perfil</span>
                        </div>
                      </Link>
                    </div>
                  </nav>

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
          </div>
        </div>
      </header>
    </div>
  )
}
