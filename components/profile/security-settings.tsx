"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Lock, Laptop, Smartphone, Trash2, LogOut } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { updatePassword } = useAuth()
  const supabase = getSupabaseBrowser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await updatePassword(newPassword)

      if (error) {
        setError(error.message || "Ocorreu um erro ao atualizar a senha")
      } else {
        setSuccess("Senha atualizada com sucesso!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao atualizar a senha")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Alterar Senha</CardTitle>
          <CardDescription className="text-gray-300">Atualize sua senha de acesso</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-900/50 border-green-800 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-gray-200">
                Senha Atual
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-200">
                Nova Senha
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-200">
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-orbit-orange hover:bg-orbit-orange/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Autenticação de Dois Fatores</CardTitle>
          <CardDescription className="text-gray-300">
            Adicione uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-orbit-orange" />
                <h4 className="text-sm font-medium text-white">Autenticação de Dois Fatores</h4>
              </div>
              <p className="text-xs text-gray-400">
                Proteja sua conta com autenticação de dois fatores via SMS ou aplicativo autenticador
              </p>
            </div>
            <Switch disabled />
          </div>
          <Alert className="bg-yellow-900/20 border-yellow-800/50 text-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              A autenticação de dois fatores estará disponível em breve. Fique atento às atualizações!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card> */}

      {/* <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Sessões Ativas</CardTitle>
          <CardDescription className="text-gray-300">Gerencie os dispositivos conectados à sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-orbit-gray/20">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-white">Este dispositivo</h4>
                  <p className="text-xs text-gray-400">Navegador • Última atividade: agora</p>
                </div>
                <Button variant="outline" size="sm" disabled className="border-orbit-gray/50 text-gray-300">
                  Atual
                </Button>
              </div>
            </div>
            <Alert className="bg-blue-900/20 border-blue-800/50 text-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O gerenciamento de sessões ativas estará disponível em breve. Fique atento às atualizações!
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
