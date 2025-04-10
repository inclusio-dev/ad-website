'use client'

import { useEffect, useState } from 'react'
import type { AgendaItem } from '@/types'

interface Props {
  allItems: AgendaItem[]
  onFilter: (filtered: AgendaItem[] | null) => void
}

export const AgendaSearchBar = ({ allItems, onFilter }: Props) => {
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [speakers, setSpeakers] = useState<string[]>([])

  useEffect(() => {
    const tagSet = new Set<string>()
    const speakerSet = new Set<string>()

    allItems.forEach((item) => {
      if (item.tags) {
        if (Array.isArray(item.tags)) {
          item.tags.forEach(tag => tag && tagSet.add(tag.toLowerCase()))
        } else if (typeof item.tags === 'string') {
          item.tags.split(',').forEach(tag => tagSet.add(tag.trim().toLowerCase()))
        }
      }

      item.speakers?.forEach(speaker =>
        speakerSet.add(`${speaker.first_name} ${speaker.last_name}`)
      )
    })

    setTags(Array.from(tagSet).sort())
    setSpeakers(Array.from(speakerSet).sort())
  }, [allItems])

  useEffect(() => {
    const hasActiveFilter = query || selectedTag || selectedSpeaker

    if (!hasActiveFilter) {
      onFilter(null)
      return
    }

    const filtered = allItems.filter((item) => {
      const keywordMatch =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())

      const tagList: string[] =
        Array.isArray(item.tags)
          ? item.tags.map(tag => tag.toLowerCase())
          : typeof item.tags === 'string'
          ? item.tags.split(',').map(tag => tag.trim().toLowerCase())
          : []

      const tagMatch =
        !selectedTag || tagList.includes(selectedTag)

      const speakerList: string[] =
        item.speakers?.map(s => `${s.first_name} ${s.last_name}`.toLowerCase()) || []

      const speakerMatch =
        !selectedSpeaker || speakerList.includes(selectedSpeaker.toLowerCase())

      return keywordMatch && tagMatch && speakerMatch
    })

    onFilter(filtered)
  }, [query, selectedTag, selectedSpeaker, allItems, onFilter])

  const resetFilter = (key: 'query' | 'tag' | 'speaker') => {
    if (key === 'query') setQuery('')
    if (key === 'tag') setSelectedTag(null)
    if (key === 'speaker') setSelectedSpeaker(null)
  }

  return (
    <div className="mb-10 space-y-6" role="search" aria-label="Ricerca avanzata eventi agenda">
      {/* Messaggio accessibile */}
      <p id="search-instructions" className="text-sm text-gray-700">
        Puoi combinare la ricerca per <strong>tag</strong>, <strong>relatore</strong> e <strong>parola chiave</strong>.
      </p>

      <div>
        <label htmlFor="query" className="block text-sm font-medium text-gray-800">
          Cerca per parola chiave
        </label>
        <input
          id="query"
          name="query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-1 w-full border px-4 py-2 rounded-md shadow-sm"
          placeholder="Es. normativa, accessibilità, intelligenza artificiale"
          aria-describedby="search-instructions"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-800">
            Filtra per tag
          </label>
          <select
            id="tag"
            name="tag"
            value={selectedTag ?? ''}
            onChange={(e) =>
              setSelectedTag(e.target.value === '' ? null : e.target.value)
            }
            className="mt-1 border px-3 py-2 rounded-md"
          >
            <option value="">-- Nessun tag selezionato --</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="speaker" className="block text-sm font-medium text-gray-800">
            Filtra per relatore
          </label>
          <select
            id="speaker"
            name="speaker"
            value={selectedSpeaker ?? ''}
            onChange={(e) =>
              setSelectedSpeaker(e.target.value === '' ? null : e.target.value)
            }
            className="mt-1 border px-3 py-2 rounded-md"
          >
            <option value="">-- Nessun relatore selezionato --</option>
            {speakers.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(query || selectedTag || selectedSpeaker) && (
        <div
          className="flex flex-wrap items-center gap-2 text-sm mt-2"
          role="region"
          aria-live="polite"
          aria-label="Filtri attivi"
        >
          {query && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              🔍 `&quot;`{query}`&quot;`
              <button
                onClick={() => resetFilter('query')}
                className="ml-2 text-blue-800 hover:underline focus:outline-none"
                aria-label="Rimuovi filtro per parola chiave"
              >
                ×
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              🏷️ {selectedTag}
              <button
                onClick={() => resetFilter('tag')}
                className="ml-2 text-green-800 hover:underline focus:outline-none"
                aria-label={`Rimuovi filtro per tag ${selectedTag}`}
              >
                ×
              </button>
            </span>
          )}
          {selectedSpeaker && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              🎤 {selectedSpeaker}
              <button
                onClick={() => resetFilter('speaker')}
                className="ml-2 text-purple-800 hover:underline focus:outline-none"
                aria-label={`Rimuovi filtro per relatore ${selectedSpeaker}`}
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
