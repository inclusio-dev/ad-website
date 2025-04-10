import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET() {
  const filePath = path.join(process.cwd(), 'data/pages.json')

  try {
    const data = await fs.readFile(filePath, 'utf8')
    const pages = JSON.parse(data)
    return NextResponse.json(pages)
  } catch (err) {
    console.error('Errore nel leggere pages.json:', err)
    return NextResponse.json({ error: 'Errore nel leggere il file' }, { status: 500 })
  }
}
