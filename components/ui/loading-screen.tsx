import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-orbit-darkBlue z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-orbit-orange animate-spin" />
        <p className="mt-4 text-white text-lg">Carregando...</p>
      </div>
    </div>
  )
}
