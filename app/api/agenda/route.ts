import { NextResponse } from 'next/server';
import agenda from '@/data/agenda.json';

export async function GET() {
  try {
    // Nessuna trasformazione, ritorni la struttura originale
    const structuredAgenda = agenda.data.map((day) => ({
      id: day.id,
      date: day.date,
      label: day.label,
      slug: day.slug,
      events: day.events.map((event) => ({
        start: event.start,
        items: event.items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          job_title: 'job_title' in item ? item.job_title : null,
          color: item.color,
          location: item.location,
          speakers: 'speakers' in item ? item.speakers : [],
        })),
      })),
    }));

    console.log('Struttura agenda restituita:', structuredAgenda.length);
    return NextResponse.json(structuredAgenda);
  } catch (error) {
    console.error('Errore GET:', error);
    return new Response(JSON.stringify({ error: 'Errore nel caricamento dei dati agenda' }), {
      status: 500,
    });
  }
}
