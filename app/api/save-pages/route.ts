import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { slug, body } = await req.json()

    const filePath = path.join(process.cwd(), 'data', 'pages.json')

    console.log('📥 Ricevuta richiesta di salvataggio per slug:', slug)

    const fileContent = await fs.readFile(filePath, 'utf-8')
    const pages = JSON.parse(fileContent)

    const index = pages.findIndex((p: any) => p.slug === slug)
    if (index === -1) {
      console.warn(`❌ Pagina non trovata per slug: ${slug}`)
      return NextResponse.json({ message: 'Pagina non trovata' }, { status: 404 })
    }

    pages[index].body = body

    await fs.writeFile(filePath, JSON.stringify(pages, null, 2), 'utf-8')

    console.log('✅ Pagina salvata con successo per slug:', slug)

    return NextResponse.json({ message: 'Pagina salvata con successo' })
  } catch (error: any) {
    console.error('❌ Errore nel salvataggio della pagina:', error)
    return NextResponse.json({ message: 'Errore interno del server' }, { status: 500 })
  }
}
