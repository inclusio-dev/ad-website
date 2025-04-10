"use client"

import { useState } from 'react';
import Link from 'next/link';
import { AgendaDayDocument } from '@/types';

interface AgendaCompactViewProps {
  days: AgendaDayDocument[];
  maxDays?: number;
  maxEventsPerDay?: number;
}

export const AgendaCompactView: React.FC<AgendaCompactViewProps> = ({ 
  days, 
  maxDays = 2, 
  maxEventsPerDay = 3 
}) => {
  // Filtriamo solo i giorni che hanno eventi con ID
  const daysWithEvents = days.filter(day => {
    let hasEvents = false;
    day.events.forEach(timeSlot => {
      timeSlot.items.forEach(item => {
        if (item.id) hasEvents = true;
      });
    });
    return hasEvents;
  });
  
  // Ordiniamo i giorni per data
  const sortedDays = [...daysWithEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const displayDays = sortedDays.slice(0, maxDays);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Prossimi eventi</h2>
      
      {displayDays.length === 0 ? (
        <p className="text-gray-500">Nessun evento in programma</p>
      ) : (
        displayDays.map((day) => {
          // Per ogni giorno, estraiamo gli eventi con ID
          const events: Array<{
            id: number;
            title: string;
            start: string;
            color: string;
            location: string | null;
          }> = [];
          
          day.events.forEach((timeSlot) => {
            timeSlot.items.forEach((item) => {
              if (item.id) {
                events.push({
                  id: item.id as number, // Sappiamo che esiste perché filtramo sopra
                  title: item.title,
                  start: timeSlot.start,
                  color: item.color,
                  location: item.location,
                });
              }
            });
          });
          
          // Prendiamo solo il numero di eventi richiesto
          const displayEvents = events.slice(0, maxEventsPerDay);
          
          return (
            <div key={day.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-3">
                {day.eventType === 'workshop' ? 'Workshop' : 'Sessioni'} - {new Date(day.date).toLocaleDateString('it-IT', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              
              <div className="space-y-3">
                {displayEvents.map((event) => (
                  <Link 
                    key={event.id} 
                    href={`/agenda/event/${event.id}`}
                    className="flex items-center p-3 border-l-4 rounded hover:bg-gray-50 transition-colors"
                    style={{ borderLeftWidth: '5px', borderLeftColor: event.color || '#808080' }}
                  >
                    <div className="font-mono text-gray-500 mr-4 w-16">
                      {event.start}
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      {event.location && (
                        <p className="text-sm text-gray-600">{event.location}</p>
                      )}
                    </div>
                  </Link>
                ))}
                
                {events.length > maxEventsPerDay && (
                  <div className="text-center pt-2">
                    <Link 
                      href={`/agenda/${day.eventType}/${day.id}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      + altri {events.length - maxEventsPerDay} eventi
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      
      {sortedDays.length > maxDays && (
        <div className="text-center mt-4">
          <Link 
            href="/agenda"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Visualizza l&apos;intera agenda
          </Link>
        </div>
      )}
    </div>
  );
};