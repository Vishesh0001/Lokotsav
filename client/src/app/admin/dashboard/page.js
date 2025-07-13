'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, Plus, ClipboardList, Edit3 } from 'lucide-react';
import Categories from '@/components/Categories';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-base p-8">
      <h1 className="text-4xl font-bold text-deepNavy mb-6 underline">Admin Dashboard</h1>

      {/* Welcome box */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <p className="text-lg text-gray-700">
          Welcome back, <span className="font-semibold text-accent">Admin</span>! Manage your platform from here.
        </p>
      </div>

      {/* Stats section - optional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-softPink/10 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-xl font-semibold text-deepNavy">120</p>
        </div>
        <div className="bg-accent/10 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600">Unapproved Events</p>
          <p className="text-xl font-semibold text-deepNavy">7</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-xl font-semibold text-deepNavy">45</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600">Upcoming Events</p>
          <p className="text-xl font-semibold text-deepNavy">22</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Button
          onClick={() => navigateTo('/admin/create-event')}
          className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent/80 text-white rounded-xl py-6 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </Button>

        <Button
          onClick={() => navigateTo('/admin/events')}
          className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-6 shadow-lg"
        >
          <Edit3 className="w-5 h-5" />
          <span>Edit/Delete Event</span>
        </Button>

        <Button
          onClick={() => navigateTo('/admin/unapproved-events')}
          className="w-full flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl py-6 shadow-lg"
        >
          <ClipboardList className="w-5 h-5" />
          <span>Unapproved Events</span>
        </Button>

        <Button
          onClick={() => navigateTo('/admin/users-list')}
          className="w-full flex items-center justify-center space-x-2 bg-softPink hover:bg-rose-400 text-white rounded-xl py-6 shadow-lg"
        >
          <User className="w-5 h-5" />
          <span>User List</span>
        </Button>
        <Link href='/admin/events'><Button    className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-300 text-white rounded-xl py-6 shadow-lg">
          All events</Button></Link>
      </div>
      <Categories/>
    </div>
  );
}
