"use client"

export function Footer() {
  return (
    <footer className="border-t border-orbit-gray/30 bg-orbit-blue">
      <div className="container py-6">
        <p className="text-sm text-gray-400 text-center">
          &copy; {new Date().getFullYear()} AnaliseLeilão. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}