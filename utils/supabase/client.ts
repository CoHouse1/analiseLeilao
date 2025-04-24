import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseJwt } from "@/lib/actions";

export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { accessToken: async () => await getSupabaseJwt() || "" }
  );
}