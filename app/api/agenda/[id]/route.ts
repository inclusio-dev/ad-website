// app/api/agenda/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { readFile, writeFile } from 'fs/promises'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'data', 'agenda.json')
  const file = await readFile(filePath, 'utf-8')
  const agenda = JSON.parse(file)

  for (const day of agenda.data) {
    for (const [slotIndex, slot] of day.events.entries()) {
      const items = slot.items || []
      const found = items.find((e: any) => e && e.id?.toString() === params.id)
      if (found) {
        return NextResponse.json({
          session: {
            ...found,
            date: day.date,
            slotIndex,
          },
        })
      }
    }
  }

  return NextResponse.json({ error: 'Sessione non trovata' }, { status: 404 })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'data', 'agenda.json')
  const file = await readFile(filePath, 'utf-8')
  const agenda = JSON.parse(file)
  const updatedData = await req.json()

  let updated = false

  for (const day of agenda.data) {
    for (const slot of day.events) {
      const items = slot.items || []
      const index = items.findIndex((e: any) => e && e.id?.toString() === params.id)
      if (index !== -1) {
        // 🔄 Aggiorna l’oggetto
        slot.items[index] = { ...slot.items[index], ...updatedData }
        updated = true
        break
      }
    }
    if (updated) break
  }

  if (!updated) {
    return NextResponse.json({ error: 'Sessione non trovata' }, { status: 404 })
  }

  await writeFile(filePath, JSON.stringify(agenda, null, 2), 'utf-8')
  return NextResponse.json({ success: true })
}
