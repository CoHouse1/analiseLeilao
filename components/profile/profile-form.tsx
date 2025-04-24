"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Profile } from "@/lib/database.types"

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { updateProfile } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error, data } = await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
      })

      if (error) {
        setError(error.message || "Ocorreu um erro ao atualizar o perfil")
      } else {
        setSuccess("Perfil atualizado com sucesso!")
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao atualizar o perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-orbit-blue border-orbit-gray/30">
      <CardHeader>
        <CardTitle className="text-white">Informações do Perfil</CardTitle>
        <CardDescription className="text-gray-300">Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
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

          {/* <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || undefined} alt={fullName} />
              <AvatarFallback className="bg-orbit-orange text-white text-xl">
                {getInitials(fullName || "Usuário")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 w-full max-w-xs">
              <Label htmlFor="avatarUrl" className="text-gray-200">
                URL da Foto de Perfil
              </Label>
              <div className="flex gap-2">
                <Input
                  id="avatarUrl"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
                />
                <Button type="button" variant="outline" size="icon" className="border-orbit-gray/50">
                  <Upload className="h-4 w-4 text-gray-300" />
                </Button>
              </div>
              <p className="text-xs text-gray-400">Informe a URL de uma imagem online para usar como foto de perfil</p>
            </div>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200"
            />
            <p className="text-xs text-gray-400">Seu email não pode ser alterado</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-200">
              Nome Completo
            </Label>
            <Input
              id="fullName"
              placeholder="Seu nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
