
import Link from "next/link"

import { AgendaCompactView } from "@/components/AgendaCompactView";
import { AgendaDayDocument, AgendaEventDocument } from "@/types";

export default function Home() {

 
  return (
    <div className="prose dark:prose-invert">
      <div className="container mx-auto py-10">
            <section className="mb-16">
              <h1 className="text-4xl font-bold mb-4">Accessibility Days 2025</h1>
              <p className="text-xl mb-6">15-16 maggio 2025 - Milano</p>
              <p className="text-lg mb-8">
                Benvenuti all&apos;Accessibility Days 2025, l&apos;evento dedicato all&apos;accessibilità e all&apos;inclusione digitale. 
                Due giorni di sessioni e workshop per approfondire le tematiche dell&apos;accessibilità.
              </p>
              <Link 
                href="/agenda"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Esplora l&apos;agenda completa
              </Link>
            </section>
      </div>
    </div>
  )
}
