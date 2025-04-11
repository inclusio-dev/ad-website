import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'Nessun file caricato' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = file.name.replace(/\s+/g, '-').toLowerCase()
  const filePath = path.join(process.cwd(), 'public', 'speakers', filename)

  try {
    await writeFile(filePath, new Uint8Array(buffer))
    return NextResponse.json({ success: true, filename })
  } catch (error) {
    console.error('Errore scrittura immagine speaker:', error)
    return NextResponse.json({ error: 'Errore durante l’upload' }, { status: 500 })
  }
}
