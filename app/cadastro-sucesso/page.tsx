import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-md bg-orbit-blue border-orbit-gray/30">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-900/30 p-3">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-white text-center">Cadastro Realizado com Sucesso!</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Verifique seu email para confirmar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-gray-200">
            <p>
              Enviamos um link de confirmação para o seu email. Por favor, clique no link para ativar sua conta e
              começar a usar o AnaliseLeilão.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/entrar">
              <Button className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">Ir para o Login</Button>
            </Link>
          </CardFooter>
        </Card>
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
