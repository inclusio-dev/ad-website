import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'
import { v4 as uuid } from 'uuid'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'File mancante' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()
  const filename = `${uuid()}.${ext}`
  const filePath = path.join(process.cwd(), 'public', 'speakers', filename)

  await writeFile(filePath, new Uint8Array(buffer))

  return NextResponse.json({ filename })
}
