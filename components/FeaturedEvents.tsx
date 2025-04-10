"use client"

import Link from 'next/link';
import { AgendaEventDocument } from '@/types';

interface FeaturedEventsProps {
  events: AgendaEventDocument[];
  maxEvents?: number;
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ 
  events, 
  maxEvents = 3 
}) => {
  // Filtra gli eventi che hanno un ID e una data futura
  const relevantEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
  
  // Ordina gli eventi per data e ora
  const sortedEvents = [...relevantEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // Se le date sono uguali, ordina per ora
    const [hoursA, minutesA] = a.start.split(':').map(Number);
    const [hoursB, minutesB] = b.start.split(':').map(Number);
    
    if (hoursA !== hoursB) {
      return hoursA - hoursB;
    }
    
    return minutesA - minutesB;
  });
  
  // Prendi solo il numero specificato di eventi
  const displayEvents = sortedEvents.slice(0, maxEvents);
  
  if (displayEvents.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Eventi in evidenza</h2>
      
      <div className="space-y-4">
        {displayEvents.map((event) => (
          <Link 
            key={event.id} 
            href={`/agenda/event/${event.id}`}
            className="block p-4 border-l-4 rounded hover:bg-gray-50 transition-colors"
            style={{ borderLeftWidth: '5px', borderLeftColor: event.color || '#808080' }}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                {event.location && (
                  <p className="text-sm text-gray-600">{event.location}</p>
                )}
                <p className="text-xs mt-1 text-gray-500">
                  {event.dayType === 'workshop' ? 'Workshop' : 'Sessione'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {new Date(event.date).toLocaleDateString('it-IT', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </p>
                <p className="text-sm text-gray-600">{event.start}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {sortedEvents.length > maxEvents && (
        <div className="text-center mt-4">
          <Link 
            href="/agenda"
            className="text-blue-600 hover:underline"
          >
            Visualizza tutti gli eventi →
          </Link>
        </div>
      )}
    </div>
  );
};