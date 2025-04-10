"use client"

import { useState, useEffect } from 'react';
import { AgendaDayDocument } from '@/types';

interface AgendaFilterProps {
  allDays: AgendaDayDocument[];
  onFilter: (filteredDays: AgendaDayDocument[]) => void;
}

export const AgendaFilter: React.FC<AgendaFilterProps> = ({ allDays, onFilter }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Estrai date uniche
  const dates = [...new Set(allDays.map((day) => day.date))].sort().map(date => ({
    value: date,
    label: new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }));
  
  // Estrai location uniche
  const locations = new Set<string>();
  allDays.forEach(day => {
    day.events.forEach(timeSlot => {
      timeSlot.items.forEach(item => {
        if (item.location) {
          locations.add(item.location);
        }
      });
    });
  });
  
  // Aggiorna i filtri quando cambiano
  useEffect(() => {
    const filteredDays = allDays.map(day => {
      // Filtro per tipo (sessioni/workshop)
      if (selectedType !== 'all' && day.eventType !== selectedType) {
        return null;
      }
      
      // Filtro per data
      if (selectedDate !== 'all' && day.date !== selectedDate) {
        return null;
      }
      
      // Filtra gli eventi di questo giorno
      const filteredEvents = day.events.map(timeSlot => {
        const filteredItems = timeSlot.items.filter(item => {
          // Filtro per location
          if (selectedLocation !== 'all' && item.location !== selectedLocation) {
            return false;
          }
          
          // Filtro per ricerca di testo
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const titleMatch = item.title?.toLowerCase().includes(query);
            const descMatch = item.description?.toLowerCase().includes(query);
            const presenterMatch = item.presenters?.toLowerCase().includes(query);
            const tagsMatch = item.tags?.toLowerCase().includes(query);
            
            if (!titleMatch && !descMatch && !presenterMatch && !tagsMatch) {
              return false;
            }
          }
          
          return true;
        });
        
        if (filteredItems.length === 0) {
          return null;
        }
        
        return {
          ...timeSlot,
          items: filteredItems,
        };
      }).filter(Boolean) as typeof day.events;
      
      if (filteredEvents.length === 0) {
        return null;
      }
      
      return {
        ...day,
        events: filteredEvents,
      };
    }).filter(Boolean) as AgendaDayDocument[];
    
    onFilter(filteredDays);
  }, [selectedType, selectedDate, selectedLocation, searchQuery, allDays, onFilter]);
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Filtra Eventi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">Tutti i tipi</option>
            <option value="sessioni">Sessioni</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">Tutte le date</option>
            {dates.map(date => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Luogo</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">Tutti i luoghi</option>
            {Array.from(locations).sort().map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cerca</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per titolo, descrizione..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};