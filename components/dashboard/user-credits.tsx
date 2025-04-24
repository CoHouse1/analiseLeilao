"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Coins, CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { UserCredits } from "@/lib/database.types"
import Link from "next/link"

export function UserCreditsCard() {
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const { data: userCredits, error } = await supabase.from("user_credits").select("*").single()

        if (error) {
          throw error
        }

        setCredits(userCredits)
      } catch (err: any) {
        console.error("Erro ao buscar créditos:", err)
        setError("Não foi possível carregar seus créditos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCredits()
  }, [supabase])

  const totalCredits = credits ? credits.free_credits + credits.paid_credits : 0
  const freeCreditsPercentage = credits && totalCredits > 0 ? (credits.free_credits / totalCredits) * 100 : 0

  if (isLoading) {
    return (
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Seus Créditos</CardTitle>
          <CardDescription className="text-gray-300">Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Seus Créditos</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-900/50 border-red-800 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-orbit-blue border-orbit-gray/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-orbit-orange" />
          Seus Créditos
        </CardTitle>
        <CardDescription className="text-gray-300">Gerencie seus créditos para análises</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-white">{totalCredits}</p>
            <p className="text-sm text-gray-300">créditos disponíveis</p>
          </div>
          <Link href="/creditos">
            <Button className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">
              <CreditCard className="mr-2 h-4 w-4" />
              Comprar Créditos
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Créditos Gratuitos</span>
            <span className="text-white font-medium">{credits?.free_credits || 0}</span>
          </div>
          <Progress value={freeCreditsPercentage} className="h-2 bg-orbit-gray/30" indicatorClassName="bg-green-500" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Créditos Pagos</span>
            <span className="text-white font-medium">{credits?.paid_credits || 0}</span>
          </div>
          <Progress
            value={100 - freeCreditsPercentage}
            className="h-2 bg-orbit-gray/30"
            indicatorClassName="bg-orbit-orange"
          />
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Cada análise de edital consome 1 crédito. Os créditos gratuitos são usados primeiro.
        </p>
      </CardContent>
    </Card>
  )
}
