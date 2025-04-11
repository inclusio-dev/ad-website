import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { readFile } from 'fs/promises'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'data', 'agenda.json')

  try {
    const file = await readFile(filePath, 'utf-8')
    const agenda = JSON.parse(file)

    for (const day of agenda.data) {
      for (const [slotIndex, slot] of day.events.entries()) {
        for (const [itemIndex, item] of slot.items.entries()) {
          if (item?.id?.toString() === params.id) {
            return NextResponse.json({
              session: {
                ...item,
                day: day.label,
                daySlug: day.slug,
                date: day.date,
                start: slot.start,
                slotIndex,
                itemIndex,
              },
            })
          }
        }
      }
    }

    return NextResponse.json({ error: 'Sessione non trovata' }, { status: 404 })
  } catch (err) {
    console.error('Errore GET /api/agenda/:id:', err)
    return NextResponse.json({ error: 'Errore interno server' }, { status: 500 })
  }
}