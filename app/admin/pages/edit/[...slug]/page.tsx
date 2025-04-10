'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// ✅ Import dinamico del componente EditorPage
const EditorPage = dynamic(() =>
  import('@/components/EditorPage').then((mod) => mod.default),
  { ssr: false }
)

interface Page {
  slug: string
  title: string
  description?: string
  body?: string
}

export default function AdminEditPage({ params }: { params: { slug: string[] } }) {
  const router = useRouter()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Unisce lo slug in formato tipo: "chi-siamo/associazione"
  const joinedSlug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch('/api/pages')
        if (!res.ok) throw new Error(`Errore HTTP ${res.status}`)

        const pages: Page[] = await res.json()
        const found = pages.find((p) => p.slug === joinedSlug)

        if (!found) {
          console.warn('Pagina non trovata per slug:', joinedSlug)
          setPage(null)
        } else {
          setPage(found)
        }
      } catch (error) {
        console.error('Errore nel caricamento:', error)
        setPage(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [joinedSlug])

  // ✅ UI per caricamento
  if (loading) {
    return <p className="text-center mt-10">Caricamento in corso...</p>
  }

  // ✅ UI se la pagina non viene trovata
  if (!page) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p>Pagina non trovata.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 underline text-blue-600"
        >
          Torna indietro
        </button>
      </div>
    )
  }

  // ✅ EditorPage riceve lo slug da usare internamente
  return <EditorPage slug={joinedSlug} />
}
