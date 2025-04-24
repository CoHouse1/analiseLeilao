import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable")
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
}

// Cria um cliente Supabase com a chave de serviço para operações do lado do servidor
export const supabaseAdmin = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
