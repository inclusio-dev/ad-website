'use client'

import { useState } from 'react'
import { AgendaSearchBar } from './AgendaSearchBar'
import Link from 'next/link'

import type { AgendaItem } from '@/types'

export function ClientFilteredAgenda({ allItems }: { allItems: AgendaItem[] }) {
  const [filtered, setFiltered] = useState<AgendaItem[] | null>(null)

  const handleReset = () => {
    setFiltered(null)
  }

  return (
    <div className="mb-12">
      <AgendaSearchBar allItems={allItems} onFilter={setFiltered} />

      {/* Bottone di reset visibile solo se c’è una ricerca */}
      {filtered !== null && (
        <div className="mt-4">
          <button
            onClick={handleReset}
            className="text-sm px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            🔄 Reset filtri
          </button>
        </div>
      )}

      {filtered !== null && (
        <>
          {filtered.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mt-8 mb-4">
                Risultati della ricerca ({filtered.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item, index) => (
                  <div
                    key={item.id ?? `event-${index}`}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/agenda/event/${item.id}`}>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 mt-8">Nessun risultato trovato.</p>
          )}
        </>
      )}
    </div>
  )
}
