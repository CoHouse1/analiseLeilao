import { Header } from "@/components/header"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <ResetPasswordForm />
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
