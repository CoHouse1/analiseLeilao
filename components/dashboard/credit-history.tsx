"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowDown, ArrowUp, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CreditTransaction } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function CreditHistory() {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("credit_transactions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          throw error
        }

        setTransactions(data || [])
      } catch (err: any) {
        console.error("Erro ao buscar transações:", err)
        setError("Não foi possível carregar seu histórico de créditos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [supabase])

  if (isLoading) {
    return (
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Histórico de Créditos</CardTitle>
          <CardDescription className="text-gray-300">Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Histórico de Créditos</CardTitle>
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
        <CardTitle className="text-white">Histórico de Créditos</CardTitle>
        <CardDescription className="text-gray-300">Suas últimas transações de créditos</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-300">Nenhuma transação de crédito encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-md bg-orbit-gray/20">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      transaction.transaction_type === "use"
                        ? "bg-red-900/30 text-red-400"
                        : "bg-green-900/30 text-green-400"
                    }`}
                  >
                    {transaction.transaction_type === "use" ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {transaction.transaction_type === "use"
                        ? "Uso de Créditos"
                        : transaction.transaction_type === "purchase"
                          ? "Compra de Créditos"
                          : transaction.transaction_type === "refund"
                            ? "Reembolso de Créditos"
                            : "Bônus de Créditos"}
                    </p>
                    <p className="text-xs text-gray-400">{transaction.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`font-medium ${
                      transaction.transaction_type === "use" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {transaction.transaction_type === "use" ? "-" : "+"}
                    {transaction.amount}
                  </span>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(transaction.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
