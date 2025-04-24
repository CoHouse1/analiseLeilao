"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao enviar o email de recuperação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-orbit-blue border-orbit-gray/30">
      <CardHeader>
        <CardTitle className="text-white">Recuperar Senha</CardTitle>
        <CardDescription className="text-gray-300">Enviaremos um link para redefinir sua senha</CardDescription>
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
              <AlertDescription>Email enviado com sucesso! Verifique sua caixa de entrada.</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-orbit-orange hover:bg-orbit-orange/90 text-white"
            disabled={isLoading || success}
          >
            {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
          </Button>
          <div className="text-center text-sm text-gray-300">
            <Link href="/entrar" className="text-orbit-orange hover:underline">
              Voltar para o login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
