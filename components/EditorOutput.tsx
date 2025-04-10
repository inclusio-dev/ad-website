import { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'

export default function EditorOutput({ content }: { content: any }) {
  const editorRef = useRef<any>(null)

  useEffect(() => {
    if (editorRef.current) {
      // Crea un'istanza di EditorJS solo se non esiste già
      new EditorJS({
        holder: 'editor-output',
        data: content, // Qui passiamo i dati della pagina (es. blocks)
        readOnly: true, // Modalità di sola lettura
      })
    }
  }, [content])

  return (
    <div id="editor-output" className="editor-output-container">
      {/* L'editor si renderizza qui */}
    </div>
  )
}
