"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle, ArrowRight, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Analysis } from "@/lib/database.types"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function RecentAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const { data, error } = await supabase
          .from("analyses")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          throw error
        }

        setAnalyses(data || [])
      } catch (err: any) {
        console.error("Erro ao buscar análises:", err)
        setError("Não foi possível carregar suas análises recentes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyses()
  }, [supabase])

  if (isLoading) {
    return (
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Análises Recentes</CardTitle>
          <CardDescription className="text-gray-300">Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-orbit-blue border-orbit-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Análises Recentes</CardTitle>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-orbit-orange" />
            Análises Recentes
          </CardTitle>
          <CardDescription className="text-gray-300">Suas últimas análises de editais</CardDescription>
        </div>
        <Link href="/dashboard/analises">
          <Button variant="outline" size="sm" className="border-orbit-gray/50 text-gray-300 hover:bg-orbit-gray/30">
            Ver Todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {analyses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-300 mb-4">Você ainda não realizou nenhuma análise</p>
            <Link href="/analise">
              <Button className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">Realizar Primeira Análise</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <Link key={analysis.id} href={`/analise/resultado?id=${analysis.id}`}>
                <div className="flex items-center justify-between p-4 rounded-md bg-orbit-gray/20 hover:bg-orbit-gray/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orbit-gray/30 p-2">
                      <FileText className="h-4 w-4 text-orbit-orange" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{analysis.title}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(analysis.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        analysis.status === "completed"
                          ? "bg-green-900/30 text-green-400"
                          : analysis.status === "processing"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {analysis.status === "completed"
                        ? "Concluído"
                        : analysis.status === "processing"
                          ? "Processando"
                          : "Falha"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
