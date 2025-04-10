export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: 0, message: 'URL mancante o invalido' }, { status: 400 })
    }

    return NextResponse.json({
      success: 1,
      meta: {
        title: 'Anteprima link test',
        description: 'Questa è una descrizione simulata.',
        image: 'https://placehold.co/600x300?text=Preview'
      }
    })
  } catch (error) {
    return NextResponse.json({ success: 0, message: 'Errore interno' }, { status: 500 })
  }
}
