import path from 'path'
import fs from 'fs/promises'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface AgendaItem {
  id: number
  title: string
  description?: string
  color?: string
  location?: string
  tags?: string
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = params.tag.toLowerCase()

  const filePath = path.join(process.cwd(), 'data', 'agenda.json')
  const raw = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(raw)

  const allItems: AgendaItem[] = data.data
    .flatMap((day: any) => day.events)
    .flatMap((event: any) => event.items)

  const matching = allItems.filter((item) =>
    item.tags?.toLowerCase().split(',').some((t) => t.trim().replace(/\s+/g, '-') === tag)
  )

  if (matching.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Eventi con tag: <span className="text-blue-600">#{tag}</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matching.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <Link href={`/agenda/event/${item.id}`}>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.description && (
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">{item.description}</p>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
