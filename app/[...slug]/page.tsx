'use client'

import { useState, useEffect } from 'react'
import { renderEditorJsContent } from "@/lib/editorjs-renderer"

export default function PagePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const [page, setPage] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/pages?slug=${slug}`, {
          cache: 'no-store',
        })

        if (!res.ok) throw new Error(`Errore nel caricamento ${res.status}`)
        const data = await res.json()

        const foundPage = data.find((p: any) => p.slug === slug)
        if (!foundPage) {
          console.warn('Pagina non trovata per slug:', slug)
          setPage(null)
        } else {
          setPage(foundPage)
        }
      } catch (error) {
        console.error('Errore nel recupero della pagina:', error)
        setPage(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  if (loading) {
    return <p className="text-center mt-10">Caricamento in corso...</p>
  }

  if (!page) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p>Pagina non trovata.</p>
      </div>
    )
  }

  return (
    <div className="prose dark:prose-invert max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      {renderEditorJsContent(page.body)}
    </div>
  )
}
