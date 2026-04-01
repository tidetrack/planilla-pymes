import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente público — para uso en componentes del lado del cliente
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Cliente con privilegios de servidor — solo usar en API routes y Server Components
// Nunca exponer al navegador
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey
)
