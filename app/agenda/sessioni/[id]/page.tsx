import path from 'path';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface AgendaItem {
  id: number | null;
  title: string;
  description?: string;
  color?: string;
  location?: string;
}

interface TimeSlot {
  start: string;
  items: AgendaItem[];
}

interface AgendaDay {
  id: number;
  date: string;
  label: string;
  events: TimeSlot[];
}

interface SessioniDayPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'data', 'agenda.json');
  const json = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(json);

  const sessioniDays = data.data.filter((day: any) =>
    day.label.toLowerCase().includes('sessioni')
  );

  return sessioniDays.map((day: any) => ({
    id: day.slug,
  }));
}


export default async function SessioniDayPage({ params }: SessioniDayPageProps) {
  const dayId = parseInt(params.id, 10);

  const filePath = path.join(process.cwd(), 'data', 'agenda.json');
  const json = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(json);

  const day = data.data.find(
    (day: any) => day.slug === params.id && day.label.toLowerCase().includes('sessioni')
  ) as AgendaDay | undefined;
  
  if (!day) {
    notFound();
  }

  const timeSlots = day.events;

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/agenda" className="text-blue-600 mb-6 inline-block">
          ← Torna all&apos;agenda completa
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">{day.label}</h1>
        <p className="text-xl text-gray-600 mb-8">
          {new Date(day.date).toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
          })}
        </p>

        <div className="space-y-12">
          {timeSlots.map((timeSlot, index) => (
            <div key={index} className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-4">{timeSlot.start}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {timeSlot.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                    style={{ borderLeftWidth: '5px', borderLeftColor: item.color || '#808080' }}
                  >
                    {item.id ? (
                      <Link href={`/agenda/event/${item.id}`}>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                      </Link>
                    ) : (
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    )}
                    
                    {item.location && (
                      <p className="text-gray-500 mt-2">📍 {item.location}</p>
                    )}
                    
                    {item.description && (
                      <p className="mt-3 text-gray-700 line-clamp-3">{item.description}</p>
                    )}
                    
                    {item.id && (
                      <Link href={`/agenda/event/${item.id}`} className="text-blue-600 mt-3 inline-block">
                        Dettagli →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
