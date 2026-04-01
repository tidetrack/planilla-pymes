// Tipos generados manualmente del esquema de Supabase.
// Actualizar si se agregan columnas a la BD.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      movimientos: {
        Row: {
          id: string
          fecha: string
          monto: number
          tipo: 'Ingreso' | 'Egreso'
          cuenta: string
          tipo_cuenta: string | null
          proyecto: string | null
          uen: string | null
          medio: string | null
          moneda: 'ARS' | 'USD' | 'CtaCte' | null
          nota: string | null
          cotiz_usd_venta: number | null
          cotiz_usd_compra: number | null
          id_compromiso: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['movimientos']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['movimientos']['Insert']>
      }
    }
  }
}

// Alias convenientes para uso en la app
export type Movimiento = Database['public']['Tables']['movimientos']['Row']
export type MovimientoInsert = Database['public']['Tables']['movimientos']['Insert']
