"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Iniciando processo de login")
      const { error } = await signIn(email, password)

      if (error) {
        console.error("Erro retornado pelo signIn:", error)
        setError(typeof error === "string" ? error : error.message || "Falha na autenticação")
      } else {
        console.log("Login bem-sucedido, redirecionando para dashboard")
        // Adicionando um pequeno atraso para garantir que o estado de autenticação seja atualizado
        setTimeout(() => {
          router.push("/dashboard")
        }, 500)
      }
    } catch (err: any) {
      console.error("Exceção no processo de login:", err)
      setError(err.message || "Ocorreu um erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-orbit-blue border-orbit-gray/30">
      <CardHeader>
        <CardTitle className="text-white">Entrar</CardTitle>
        <CardDescription className="text-gray-300">Entre com sua conta para acessar o sistema</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-200">
                Senha
              </Label>
              <Link href="/recuperar-senha" className="text-sm text-orbit-orange hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-orbit-orange hover:bg-orbit-orange/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
          <div className="text-center text-sm text-gray-300">
            Não tem uma conta?{" "}
            <Link href="/cadastrar" className="text-orbit-orange hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
