import path from 'path';
import fs from 'fs/promises';
import Link from 'next/link';
import { ClientFilteredAgenda } from '@/components/ClientFilteredAgenda' // ✅ aggiunto
import { AgendaSearchBar } from '@/components/AgendaSearchBar' // se già importato va bene

export default async function AgendaPage() {
  const jsonPath = path.join(process.cwd(), 'data', 'agenda.json');
  const rawData = await fs.readFile(jsonPath, 'utf-8');
  const agenda = JSON.parse(rawData);

  const sessionDays = agenda.data
    .filter((day: any) => day.label.toLowerCase().includes('sessioni'))
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const workshopDays = agenda.data
    .filter((day: any) => day.label.toLowerCase().includes('workshop'))
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // ✅ Tutti gli eventi per il filtro (client-side)
  const allItems = agenda.data
    .flatMap((day: any) =>
      day.events.flatMap((event: any) => event.items)
    );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Agenda</h1>

      {/* ✅ Barra di ricerca avanzata */}
      <ClientFilteredAgenda allItems={allItems} />

      {/* ✅ Sezioni fisse come prima */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
        {/* Sezione Sessioni */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Sessioni</h2>
          <div className="space-y-6">
            {sessionDays.map((day: any) => (
              <div key={day.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Link href={`/agenda/sessioni/${day.slug}`}>
                  <h3 className="text-xl font-semibold">{day.label}</h3>
                  <p className="text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="mt-4 text-blue-600">Visualizza programma →</p>
                </Link>
              </div>
            ))}
            {sessionDays.length === 0 && (
              <p className="text-gray-500">Nessuna sessione disponibile</p>
            )}
          </div>
        </div>

        {/* Sezione Workshop */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Workshop</h2>
          <div className="space-y-6">
            {workshopDays.map((day: any) => (
              <div key={day.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Link href={`/agenda/workshop/${day.slug}`}>
                  <h3 className="text-xl font-semibold">{day.label}</h3>
                  <p className="text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="mt-4 text-blue-600">Visualizza programma →</p>
                </Link>
              </div>
            ))}
            {workshopDays.length === 0 && (
              <p className="text-gray-500">Nessun workshop disponibile</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
