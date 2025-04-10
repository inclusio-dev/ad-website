'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PageMeta {
  slug: string
  title: string
}

export default function PagesList() {
  const [pages, setPages] = useState<PageMeta[]>([])
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login')
    } else {
      fetch('/api/pages')
        .then(res => res.json())
        .then(data => {
          setPages(data.map((p: any) => ({ slug: p.slug, title: p.title })))
        })
    }
  }, [router])

  return (
    <div className="max-w-2xl mx-auto mt-12 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Pagine modificabili</h1>
      {pages.map(page => (
        <div key={`${page.slug}-${page.title}`}>
          <button
            onClick={() => router.push(`/admin/pages/edit/${page.slug}`)}
            className="text-blue-600 hover:underline"
          >
            ✏️ {page.title}
          </button>
        </div>
      ))}
    </div>
  )
}
