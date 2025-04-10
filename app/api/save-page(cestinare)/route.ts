// app/api/save-pages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const { slug, body } = await req.json()

  const filePath = path.join(process.cwd(), 'data/pages.json')

  try {
    const file = await fs.readFile(filePath, 'utf-8')
    const pages = JSON.parse(file)

    const index = pages.findIndex((p: any) => p.slug === slug)
    if (index === -1) {
      return NextResponse.json({ message: 'Pagina non trovata' }, { status: 404 })
    }

    pages[index].body = body

    await fs.writeFile(filePath, JSON.stringify(pages, null, 2), 'utf-8')

    return NextResponse.json({ message: 'Pagina salvata con successo' })
  } catch (error) {
    console.error('Errore salvataggio:', error)
    return NextResponse.json({ message: 'Errore interno del server' }, { status: 500 })
  }
}
