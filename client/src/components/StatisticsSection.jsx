'use client'
import { useEffect, useState } from 'react';
import { Users, Calendar, Sparkles, Ticket, MapPin, Grid3X3 } from 'lucide-react';
import secureFetch from '@/utils/securefetch';
import { Skeleton } from './ui/skeleton';
export default function StatsSection() {
   
  const [activeUsers, setActiveUsers] = useState(0)
  const [eventCount, setEventCount] = useState(0)
  const [FeaturedEventCount, setFeaturedEventCount] = useState(0)
  const [ticketsSold, setTicketsSold] = useState(0)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    async function fetchStats() {
      setLoading(true)
      try {
       const [usersRes, eventsRes, featuredRes, ticketsRes] = await Promise.all([
        secureFetch('/totalusers',{},'GET'),
        secureFetch('/totalevents',{},'GET'),
        secureFetch('/totalfeatured',{},'GET'),
        secureFetch('/totalticketssold',{},'GET'),
      ]);

      if(usersRes.code == 1) setActiveUsers(usersRes.data);
      if(eventsRes.code == 1) setEventCount(eventsRes.data);
      if(featuredRes.code == 1) setFeaturedEventCount(featuredRes.data);
      if(ticketsRes.code == 1) setTicketsSold(ticketsRes.data);

      setError(null);
      
      } catch (err) {
        setError(err.message);
     
      }finally{
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

 if (loading) {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Skeleton className="h-12 rounded-lg mx-auto mb-6 max-w-md" />
          <Skeleton className="h-6 rounded-lg mx-auto max-w-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
            >
              <Skeleton className="w-14 h-14 rounded-xl mb-6" />
              <Skeleton className="h-10 rounded mb-3" />
              <Skeleton className="h-5 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 inline-block shadow-sm">
            <p className="text-red-600 font-semibold text-xl">Error loading stats: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const statsData = [
    {
      icon: Users,
      value: activeUsers,
      label: "Active Users",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Calendar,
      value: eventCount,
      label: "Total Events",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Sparkles,
      value: FeaturedEventCount,
      label: "Featured Events",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Ticket,
      value: ticketsSold,
      label: "Tickets Sold",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: MapPin,
      value: "20+",
      label: "Cities",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: Grid3X3,
      value: "10+",
      label: "Categories",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Platform Statistics
          </h2>
          <p className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto">
            Real-time insights into our growing community
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-9 max-w-6xl mx-auto">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <IconComponent className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <p className="text-gray-600 font-medium text-sm">
                  {stat.label}
                </p>
                
              </div>
            );
          })}
        </div>
        <div className="text-center mt-16">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span className="text-sm font-medium">Live Statistics</span>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}