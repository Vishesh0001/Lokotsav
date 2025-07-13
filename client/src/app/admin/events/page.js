'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BookmarkButton from "@/components/BookmarkButton";
import { Frown, MapPin, Sparkles, Users, Clock } from "lucide-react";
import { decrypt } from "@/utils/crypto";
import Link from "next/link";
import secureFetch from '@/utils/securefetch';
import { toast } from 'sonner';
import { useEffect, useState, useCallback } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/v1/user/events", {
        cache: "no-store",
      });
      const responseText = await res.text();
      const decrypteddata = decrypt(responseText);
      setEvents(decrypteddata.data || []);
    } catch (error) {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      const response = await secureFetch('/deleteEvent', { id }, 'POST', true);
      if (response.code === 1) {
        toast.success('Event deleted successfully!');
        fetchEvents(); // Refresh after deletion
      } else {
        toast.error(response.message?.keyword || 'Deletion failed.');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Server error while deleting event.');
    }
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading events...</div>;
  }

  if (!events.length) {
    return (
      <div className="w-200 mx-auto m-7 p-6 border rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center h-64">
        <Frown className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-300 text-center">Oops! No events available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-base">
      {events.map((event) => (
        <Card
          key={event.id}
          className="relative bg-white border border-base/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
        >
          <CardHeader className="p-0">
            <div className="relative">
              <img
                className="rounded-t-2xl w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                src={event.cover_image}
                alt="event cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-deepNavy tracking-tight">
                  {event.event_title}
                </CardTitle>
                {event.is_featured ? (
                  <span className="flex items-center bg-softPink/20 text-softPink text-xs font-semibold px-3 py-1 rounded-full">
                    <Sparkles className="h-4 w-4 mr-1" /> Featured
                  </span>
                ) : (
                  <div></div>
                )}
              </div>
              <CardDescription className="text-sm text-gray-600 mt-2 leading-relaxed">
                {event.description?.length > 80
                  ? event.description.slice(0, 80) + "..."
                  : event.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-5 py-3 space-y-3">
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-accent" />
              <span className="text-sm font-medium">
                {event.location}, {event.city}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 mr-2 text-accent" />
              <span className="text-sm font-medium">
                {event.registrations} registrations
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-accent" />
              <span className="text-sm font-medium">
                {new Date(event.start_time).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          </CardContent>

          <CardFooter className="px-5 py-4 bg-base/10 flex justify-between items-center relative">
            <div className="text-sm text-gray-600">
              Category:{" "}
              <span className="capitalize text-deepNavy font-semibold">
                {event.category}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Link href={`/admin/edit-event/${event.id}`}>
                <button className="text-sm font-semibold text-white bg-accent hover:bg-accent/80 px-4 py-2 rounded-lg transition-colors duration-200">
                  Edit 
                </button>
              </Link>
              <button
                onClick={() => handleDelete(event.id)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
              >
                Delete
              </button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
