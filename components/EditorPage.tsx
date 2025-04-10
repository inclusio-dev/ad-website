'use client'

import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import type { ToolConstructable } from '@editorjs/editorjs'

// Tools
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Checklist from '@editorjs/checklist'
import Code from '@editorjs/code'
import Embed from '@editorjs/embed'
import ImageTool from '@editorjs/image'

export default function EditorPage({ slug }: { slug: string }) {
  const editorRef = useRef<EditorJS | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pageData, setPageData] = useState<any>(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch('/api/pages')
        const data = await res.json()
        const found = data.find((p: any) => p.slug === slug)
        setPageData(found)
      } catch (err) {
        console.error('Errore nel caricamento della pagina:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  useEffect(() => {
    if (!loading && pageData && !editorRef.current) {
      const editor = new EditorJS({
        holder: 'editor',
        autofocus: true,
        data: pageData.body, // ✅ Caricamento contenuto reale
        tools: {
          header: Header,
          list: {
            class: List as unknown as ToolConstructable,
            inlineToolbar: true,
          },
          checklist: Checklist as unknown as ToolConstructable,
          code: Code as unknown as ToolConstructable,
          embed: {
            class: Embed as unknown as ToolConstructable,
            config: {
              services: {
                youtube: true,
                twitter: true,
                codepen: true,
              },
            },
          },
          image: {
            class: ImageTool as unknown as ToolConstructable,
            config: {
              endpoints: {
                byFile: '/api/upload-image',
                byUrl: '',
              },
            },
          },
        },
        onReady() {
          editorRef.current = editor
        },
      })
    }

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [loading, pageData])

  const handleSave = async () => {
    if (!editorRef.current) return
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const output = await editorRef.current.save()

      const res = await fetch('/api/pages/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, body: output }),
      })

      if (!res.ok) throw new Error('Errore nella richiesta')

      setSaveMessage('✅ Salvataggio completato!')
    } catch (err) {
      console.error(err)
      setSaveMessage('❌ Errore durante il salvataggio.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 4000)
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Caricamento in corso…</p>
  }

  if (!pageData) {
    return <p className="text-center mt-10 text-red-600">Pagina non trovata.</p>
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        Modifica pagina: <code>{slug}</code>
      </h1>

      <div id="editor" className="bg-white border rounded p-4 min-h-[300px]" />

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isSaving ? 'Salvataggio in corso…' : '💾 Salva modifiche'}
        </button>

        {saveMessage && (
          <span className="text-sm text-gray-700">{saveMessage}</span>
        )}
      </div>
    </div>
  )
}
