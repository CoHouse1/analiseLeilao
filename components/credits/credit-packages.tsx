"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, CreditCard } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { processPayment } from "@/lib/actions"

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  popular?: boolean
}

interface CreditPackagesProps {
  userId: string
}

export function CreditPackages({ userId }: CreditPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const packages: CreditPackage[] = [
    {
      id: "basic",
      name: "Básico",
      credits: 10,
      price: 49.9,
    },
    {
      id: "standard",
      name: "Padrão",
      credits: 30,
      price: 129.9,
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      credits: 100,
      price: 349.9,
    },
  ]

  const handlePurchase = async () => {
    if (!selectedPackage) return

    const pkg = packages.find((p) => p.id === selectedPackage)
    if (!pkg) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await processPayment({
        userId,
        packageId: pkg.id,
        amount: pkg.price,
        credits: pkg.credits,
      })

      if (result.success) {
        setSuccess(`Compra realizada com sucesso! ${pkg.credits} créditos foram adicionados à sua conta.`)
      } else {
        setError(result.error || "Ocorreu um erro ao processar o pagamento.")
      }
    } catch (err: any) {
      console.error("Erro ao processar pagamento:", err)
      setError("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Escolha o Pacote de Créditos</h2>
        <p className="text-gray-300 max-w-2xl">
          Adquira créditos para realizar análises de editais de leilões imobiliários. Quanto mais créditos você comprar,
          maior o desconto.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200 mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/50 border-green-800 text-green-200 mb-6">
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`bg-orbit-blue border-orbit-gray/30 relative ${
              selectedPackage === pkg.id ? "ring-2 ring-orbit-orange" : ""
            } ${pkg.popular ? "border-orbit-orange" : ""}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orbit-orange text-white text-xs font-bold py-1 px-3 rounded-full">
                Mais Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-white">{pkg.name}</CardTitle>
              <CardDescription className="text-gray-300">{pkg.credits} créditos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">R$ {pkg.price.toFixed(2)}</p>
                <p className="text-sm text-gray-400 mt-1">R$ {(pkg.price / pkg.credits).toFixed(2)} por crédito</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Análise completa de editais</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Recomendações personalizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Acesso aos relatórios</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  selectedPackage === pkg.id
                    ? "bg-orbit-orange hover:bg-orbit-orange/90"
                    : "bg-orbit-gray/30 hover:bg-orbit-gray/40"
                } text-white`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {selectedPackage === pkg.id ? "Selecionado" : "Selecionar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          size="lg"
          className="bg-orbit-orange hover:bg-orbit-orange/90 text-white"
          disabled={!selectedPackage || isLoading}
          onClick={handlePurchase}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          {isLoading ? "Processando..." : "Finalizar Compra"}
        </Button>
      </div>
    </div>
  )
}
