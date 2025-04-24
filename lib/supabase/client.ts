"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Verificar se as variáveis de ambiente estão definidas
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Cria um cliente Supabase para operações do lado do cliente
export const createClientSupabase = () => {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      storageKey: "supabase-auth",
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

// Singleton para evitar múltiplas instâncias
let clientSingleton: ReturnType<typeof createClientSupabase>

export function getSupabaseBrowser() {
  if (clientSingleton) return clientSingleton
  clientSingleton = createClientSupabase()
  return clientSingleton
}
