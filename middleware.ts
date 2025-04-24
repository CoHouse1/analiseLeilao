import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar se é uma requisição de API ou de assets
  const isApiOrAssets =
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.includes(".")

  // Não aplicar redirecionamentos para APIs ou assets
  if (isApiOrAssets) {
    return res
  }

  // Obter a sessão atual
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas apenas para usuários não autenticados
  const authRoutes = ["/entrar", "/cadastrar", "/recuperar-senha", "/cadastro-sucesso"]
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname === route)

  // Redirecionar usuários autenticados para o dashboard se estiverem em rotas de autenticação
  if (isAuthRoute && session) {
    console.log("Middleware: Redirecionando para dashboard (rota de auth com sessão)")
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Não vamos mais redirecionar usuários não autenticados no middleware
  // Isso será feito pelo AuthProvider nos componentes client-side

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
