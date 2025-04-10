'use client'

import React from 'react'
import type { OutputData } from '@editorjs/editorjs'

export default function EditorOutput({ content }: { content: OutputData }) {
  if (!content || !content.blocks || !Array.isArray(content.blocks)) {
    return <p>Nessun contenuto disponibile.</p>
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      {content.blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={index}>{block.data?.text}</p>

          case 'header':
            const level = block.data?.level || 2
            const Tag = `h${level}` as keyof JSX.IntrinsicElements
            return <Tag key={index}>{block.data?.text}</Tag>

            case 'list':
              const rawItems: any[] = Array.isArray(block.data?.items) ? block.data.items : []
            
              const listItems = rawItems.map((item: any) => {
                // Se è oggetto con content, usa quello. Altrimenti stringify come fallback
                return typeof item === 'string'
                  ? item
                  : typeof item === 'object' && item.content
                  ? item.content
                  : JSON.stringify(item)
              })
            
              if (block.data?.style === 'ordered') {
                return (
                  <ol key={index}>
                    {listItems.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ol>
                )
              } else {
                return (
                  <ul key={index}>
                    {listItems.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                )
              }            

          case 'checklist':
            const checklistItems = Array.isArray(block.data?.items) ? block.data.items : []
            return (
              <div key={index}>
                {checklistItems.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      readOnly
                      className="accent-blue-600"
                    />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            )

          case 'code':
            return (
              <pre key={index}>
                <code>{block.data?.code}</code>
              </pre>
            )

          case 'embed':
            return (
              <div
                key={index}
                className="embed w-full my-4"
                dangerouslySetInnerHTML={{ __html: block.data?.embed }}
              />
            )

          case 'image':
            const imageUrl = block.data?.file?.url || block.data?.url
            return (
              <div key={index} className="my-6">
                <img
                  src={imageUrl}
                  alt={block.data?.caption || ''}
                  className="rounded-lg mx-auto"
                />
                {block.data?.caption && (
                  <p className="text-center text-sm text-gray-500">{block.data.caption}</p>
                )}
              </div>
            )

          default:
            return (
              <div key={index}>
                <p>🧩 Blocco non supportato: <code>{block.type}</code></p>
              </div>
            )
        }
      })}
    </div>
  )
}
