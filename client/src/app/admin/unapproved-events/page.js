'use client';

import { useEffect, useState } from 'react';
import secureFetch from '@/utils/securefetch';
import { toast } from 'sonner';

const UnapprovedEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events on load
  useEffect(() => {
    const fetchUnapprovedEvents = async () => {
      try {
        const res = await secureFetch('/unapproved', {}, 'GET',true);
console.log(res);

        if (res.code == 1) {
          setEvents(res.data || []);
        } else {
          toast.error('Failed to fetch events.');
        }
      } catch (error) {
        toast.error('Something went wrong while fetching events.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnapprovedEvents();
  }, []);

  // Placeholder handlers (replace with your real logic)
  const handleApprove = (id) => {
    console.log('Approve', id);
    // your logic here
  };

  const handleView = (id) => {
    console.log('View Details', id);
    // your logic here
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
    // your logic here
  };

  return (
    <section className="min-h-screen p-6 bg-base">
      <h1 className="text-3xl font-bold text-deepNavy mb-6">Pending Event Approvals</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">No pending events to approve.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              {/* Event Info */}
              <div className="flex-1 space-y-1">
                <h2 className="text-lg font-semibold text-deepNavy">{event.event_title}</h2>
                <p className="text-sm text-gray-600">
                  <span className="text-accent font-medium">Category:</span> {event.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="text-accent font-medium">Start Time:</span>{' '}
                  {new Date(event.start_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="text-accent font-medium">Created by:</span> {event.username}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-wrap gap-2">
                <button
                  onClick={() => handleApprove(event.id)}
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleView(event.id)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UnapprovedEventsPage;

