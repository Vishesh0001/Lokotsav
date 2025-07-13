'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

import secureFetch from '@/utils/securefetch';
import { Loader2, Frown } from 'lucide-react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState('month'); // controls view state
const [date, setDate] = useState(new Date()); 

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await secureFetch('/events', {}, 'GET');
        if (res.code ==1) {
          const decrypted = res.data;
          const eventsList = decrypted.data ?? decrypted;

          const transformed = eventsList.map((event) => ({
            id: event.id,
            title: event.is_featured ? `${event.event_title} ★` : event.event_title,
            start: new Date(event.start_time),
            end: new Date(event.end_time || event.start_time),
          }));

          setEvents(transformed);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="ml-4 text-blue-800 text-lg font-semibold">Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Frown className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-600 text-lg">Failed to load calendar events.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl text-center font-bold mb-4 text-gray-800">Event Calendar</h1>
      <div className="bg-white p-4 rounded shadow h-[calc(100vh-100px)] overflow-auto">
  <Calendar
  localizer={localizer}
  events={events}
  view={view}
  onView={(v) => setView(v)}
  date={date} 
  onNavigate={(newDate) => setDate(newDate)} 
  startAccessor="start"
  endAccessor="end"
  onSelectEvent={(event) => router.push(`/event/${event.id}`)}
  style={{ height: 'calc(100vh - 100px)' }}
  views={['month', 'week', 'day', 'agenda']}
  eventPropGetter={() => ({
    style: {
      backgroundColor: '#3B82F6',
      color: 'white',
      borderRadius: '6px',
      padding: '4px',
    },
  })}
/>
      </div>
    </div>
  );
}
