import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { MovimientoInsert } from '@/types/database'

// GET /api/movimientos
// Devuelve todos los movimientos ordenados por fecha descendente
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('movimientos')
    .select('*')
    .order('fecha', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/movimientos
// Carga un nuevo movimiento
// Body esperado: MovimientoInsert (ver src/types/database.ts)
export async function POST(request: NextRequest) {
  let body: MovimientoInsert

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  // Validaciones mínimas
  if (!body.fecha || !body.monto || !body.tipo || !body.cuenta) {
    return NextResponse.json(
      { error: 'Campos requeridos: fecha, monto, tipo, cuenta' },
      { status: 400 }
    )
  }

  if (!['Ingreso', 'Egreso'].includes(body.tipo)) {
    return NextResponse.json(
      { error: 'tipo debe ser Ingreso o Egreso' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('movimientos')
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
