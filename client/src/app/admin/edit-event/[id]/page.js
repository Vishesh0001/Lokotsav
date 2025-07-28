'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import secureFetch from '@/utils/securefetch';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [eventData, setEventData] = useState(null);
('id',id);

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await secureFetch('/get-event-by-id', { id }, 'POST',true);
      if (response.code == 1) {
        setEventData(response.data);
      } else {
        toast(response.message.keyword);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await secureFetch('/update-event', { ...eventData }, 'POST',true);
    if (response.code == 1) {
      toast('Event updated successfully');
      router.push('/admin/dashboard');
    } else {
      toast(response.message.keyword);
    }
  };

  if (!eventData) return <div className="p-6">Loading event data...</div>;

  return (
    <div className="text-gray-600 bg-gray-600 max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-deepNavy">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="event_title" value={eventData.event_title} onChange={handleChange} placeholder="Event Title" required />
        <Input name="category" value={eventData.category} onChange={handleChange} placeholder="Category" required />
        <Input name="city" value={eventData.city} onChange={handleChange} placeholder="City" required />
        <Input name="location" value={eventData.location} onChange={handleChange} placeholder="Location" required />
        <Input name="start_time" type="datetime-local" value={eventData.start_time} onChange={handleChange} required />
        <Input name="end_time" type="datetime-local" value={eventData.end_time} onChange={handleChange} required />
        <Textarea name="description" value={eventData.description} onChange={handleChange} placeholder="Description" required />
        <Textarea name="tips" value={eventData.tips} onChange={handleChange} placeholder="Tips (optional)" />
        <Textarea name="cultural_significance" value={eventData.cultural_significance} onChange={handleChange} placeholder="Cultural Significance (optional)" />
        <Input name="cover_image" value={eventData.cover_image} onChange={handleChange} placeholder="Cover Image URL" />
        <Button type="submit" className="bg-accent hover:bg-accent/80 text-white">Update Event</Button>
      </form>
    </div>
  );
}
