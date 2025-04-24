"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CreditCard } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Transaction } from "@/lib/database.types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setTransactions(data || [])
      } catch (err: any) {
        console.error("Erro ao buscar transações:", err)
        setError("Não foi possível carregar seu histórico de transações")
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
          <CardTitle className="text-white">Histórico de Transações</CardTitle>
          <CardDescription className="text-gray-300">Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Histórico de Transações</CardTitle>
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
          <CreditCard className="h-5 w-5 text-orbit-orange" />
          Histórico de Transações
        </CardTitle>
        <CardDescription className="text-gray-300">Suas compras de créditos</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-300">Você ainda não realizou nenhuma compra de créditos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-orbit-gray/30">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Data</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Créditos</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Método</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-orbit-gray/30">
                    <td className="py-3 px-4 text-white">
                      {format(new Date(transaction.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </td>
                    <td className="py-3 px-4 text-white">R$ {transaction.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-white">{transaction.credits_added}</td>
                    <td className="py-3 px-4 text-white">{transaction.payment_method || "Cartão de Crédito"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === "completed"
                            ? "bg-green-900/30 text-green-400"
                            : transaction.status === "pending"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : transaction.status === "failed"
                                ? "bg-red-900/30 text-red-400"
                                : "bg-gray-900/30 text-gray-400"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Concluído"
                          : transaction.status === "pending"
                            ? "Pendente"
                            : transaction.status === "failed"
                              ? "Falha"
                              : transaction.status === "refunded"
                                ? "Reembolsado"
                                : transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
