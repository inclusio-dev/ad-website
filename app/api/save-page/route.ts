import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

// Tipi per la struttura di una pagina
interface Page {
  slug: string
  title: string
  description: string
  body: string // I dati dell'editor, es. JSON
}

interface SavePageRequestBody {
  slug: string
  body: string // I dati modificati dell'editor
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verifica che il metodo sia POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo non permesso' })
  }

  const { slug, body }: SavePageRequestBody = req.body

  // Percorso del file JSON
  const filePath = path.join(process.cwd(), 'data', 'pages.json')

  try {
    // Leggi il file JSON
    const pages: Page[] = JSON.parse(await fs.promises.readFile(filePath, 'utf8'))

    // Trova la pagina con lo slug corrispondente
    const pageIndex = pages.findIndex((page) => page.slug === slug)
    if (pageIndex === -1) {
      return res.status(404).json({ message: 'Pagina non trovata' })
    }

    // Aggiorna la pagina con i nuovi contenuti
    pages[pageIndex].body = body

    // Salva il file JSON con i dati aggiornati
    await fs.promises.writeFile(filePath, JSON.stringify(pages, null, 2))

    // Rispondi con un messaggio di successo
    return res.status(200).json({ message: 'Pagina salvata con successo' })
  } catch (error) {
    console.error('Errore nel salvataggio della pagina:', error)
    res.status(500).json({ message: 'Errore interno del server' })
  }
}
