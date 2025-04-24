"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, FileText, Search, Plus, Clock, Filter } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth/auth-provider"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { getSupabaseBrowser } from "@/lib/supabase/client"
import type { Profile, Analysis } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AnalysesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return
      }

      try {
        // Buscar perfil do usuário
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError)
          throw profileError
        }

        setProfile(profileData)

        // Buscar análises do usuário
        const query = supabase
          .from("analyses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        const { data: analysesData, error: analysesError } = await query

        if (analysesError) {
          console.error("Erro ao buscar análises:", analysesError)
          throw analysesError
        }

        setAnalyses(analysesData || [])
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setError("Não foi possível carregar suas análises. Por favor, tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push("/entrar?redirectTo=/dashboard/analises")
      } else {
        fetchData()
      }
    }
  }, [user, authLoading, router, supabase])

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (analysis.cidade && analysis.cidade.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (analysis.estado && analysis.estado.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (analysis.tipo_imovel && analysis.tipo_imovel.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || analysis.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (authLoading || isLoading) {
    return <LoadingScreen />
  }

  if (!user || !profile) {
    return null // O router.push acima vai redirecionar, então isso é só uma precaução
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Minhas Análises</h1>
            <p className="text-gray-300">Gerencie todas as suas análises de editais de leilão</p>
          </div>
          <Link href="/analise">
            <Button className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nova Análise
            </Button>
          </Link>
        </div>

        <Card className="bg-orbit-blue border-orbit-gray/30 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar análises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-orbit-gray/30 border-orbit-gray/50 text-gray-200 placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-orbit-gray/30 border-orbit-gray/50 text-gray-200">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent className="bg-orbit-blue border-orbit-gray/50">
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="failed">Falha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {filteredAnalyses.length === 0 ? (
          <Card className="bg-orbit-blue border-orbit-gray/30">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Nenhuma análise encontrada</h2>
              <p className="text-gray-300 text-center max-w-md mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Nenhuma análise corresponde aos filtros aplicados. Tente ajustar seus critérios de busca."
                  : "Você ainda não realizou nenhuma análise de edital. Comece agora mesmo!"}
              </p>
              {searchTerm || statusFilter !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                  className="border-orbit-gray/50 text-gray-300 hover:bg-orbit-gray/30"
                >
                  Limpar Filtros
                </Button>
              ) : (
                <Link href="/analise">
                  <Button className="bg-orbit-orange hover:bg-orbit-orange/90 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Análise
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAnalyses.map((analysis) => (
              <Link key={analysis.id} href={`/analise/resultado?id=${analysis.id}`}>
                <Card className="bg-orbit-blue border-orbit-gray/30 hover:bg-orbit-gray/20 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-orbit-gray/30 p-3">
                          <FileText className="h-6 w-6 text-orbit-orange" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{analysis.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {analysis.tipo_imovel && (
                              <span className="text-xs bg-orbit-gray/30 px-2 py-1 rounded text-gray-300">
                                {analysis.tipo_imovel}
                              </span>
                            )}
                            {analysis.cidade && (
                              <span className="text-xs bg-orbit-gray/30 px-2 py-1 rounded text-gray-300">
                                {analysis.cidade}
                              </span>
                            )}
                            {analysis.estado && (
                              <span className="text-xs bg-orbit-gray/30 px-2 py-1 rounded text-gray-300">
                                {analysis.estado}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-gray-400 mt-2">
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
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
