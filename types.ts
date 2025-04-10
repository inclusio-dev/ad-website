// Definizione dei tipi per i dati dell'agenda

export interface Speaker {
    id: number;
    profile_picture_url: string | null;
    first_name: string;
    last_name: string;
    email: string;
    phone_number_prefix: string | null;
    phone_number: string | null;
    geolocation: string;
    job_title: string;
    organization: string | null;
    website: string | null;
    social_linkedin_url: string | null;
    social_facebook_url: string | null;
    social_instagram_url: string | null;
    bio: string;
  }
  
  export interface AgendaItem {
    id: number | null;
    title: string;
    description: string | null;
    color: string;
    location: string | null;
    presenters: string | null;
    tags: string | null;
    speakers?: Speaker[];
  }
  
  export interface TimeSlot {
    start: string;
    items: AgendaItem[];
  }
  
  export interface AgendaDayData {
    id: number;
    date: string;
    label: string;
    events: TimeSlot[];
  }
  
  export interface AgendaData {
    data: AgendaDayData[];
  }
  
  // Tipi per i dati trasformati da Contentlayer
  export interface AgendaDayDocument {
    id: number;
    date: string;
    label: string;
    events: TimeSlot[];
    eventType: 'sessioni' | 'workshop';
    path: string;
    slug: string;
  }
  
  export interface AgendaEventDocument {
    id: number;
    title: string;
    description: string | null;
    date: string;
    start: string;
    color: string;
    location: string | null;
    presenters: string | null;
    tags?: string[] | string;
    dayId: number;
    dayType: 'sessioni' | 'workshop';
    speakers: Speaker[];
    path: string;
    slug: string;
  }



  