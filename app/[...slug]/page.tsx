'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Caricamento dinamico di EditorOutput
const EditorOutput = dynamic(() => import('@/components/EditorOutput'), {
  ssr: false, // Disabilita SSR per il componente EditorOutput
})

export default function PagePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const [page, setPage] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/pages?slug=${slug}`)
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
    <article className="prose dark:prose-invert max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      {page.description && <p className="text-lg text-gray-500 mb-4">{page.description}</p>}
      {/* Utilizza EditorOutput per visualizzare il contenuto */}
      <EditorOutput content={page.body} />
    </article>
  )
}
