import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AnaliseLeilão - Análise de Leilões Imobiliários",
  description: "Análise detalhada de editais de leilões imobiliários para investimentos inteligentes",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
