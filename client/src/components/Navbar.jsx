'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MapPin, Radar } from 'lucide-react';
import Logout from './logout';
import { toast } from 'sonner';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [isToken, setIsToken] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Check token on path change
  useEffect(() => {
    const token = Cookies.get('token');
    setIsToken(!!token);
    setSearch('');
    setLocation('');
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    console.log('sdsdsdsds',search,location);
    
    if(!search && !location){
    toast('Please enter a search keyword or Select any city')
      
      return}
    if (search) query.append('s', search);
    if (location) query.append('city', location);
    router.push(`/events/searchevents?${query.toString()}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-base shadow-md border-b border-softGray backdrop-blur-md px-4 py-1 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 py-2">
  
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Radar className="h-10 w-10 text-gray-500 hover:text-purple-400 transition" />
          </Link>
          <Link href="/" className="text-3xl font-bold text-softPink hover:text-accent transition">
            Lokotsav
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-center gap-1 px-2 py-2 rounded-full border border-gray-300 transition hover:shadow-md hover:border-pink-400"
        >
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-white text-black border border-accent hover:bg-softGray pl-8"
            aria-label="Search events"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white flex items-center space-x-2 border-accent text-deepNavy hover:bg-softPink whitespace-nowrap"
              >
                <MapPin className="h-4 w-4 text-deepNavy" />
                <span>{location || 'Select Location'}</span>
              </Button>
            </DropdownMenuTrigger>
     <DropdownMenuContent className="max-h-60 overflow-y-auto">
  {[
    'Ahmedabad',
    'Amreli',
    'Anand',
    'Bharuch',
    'Bhavnagar',
    'Dahod',
    'Gandhinagar',
    'Jamnagar',
    'Junagadh',
    'Mehsana',
    'Morbi',
    'Nadiad',
    'Navsari',
    'Porbandar',
    'Rajkot',
    'Surat',
    'Surendranagar',
    'Vadodara',
    'Valsad',
    'Veraval'
  ].map((city) => (
    <DropdownMenuItem key={city} onSelect={() => setLocation(city)}>
      {city}
    </DropdownMenuItem>
  ))}
</DropdownMenuContent>

          </DropdownMenu>

          <Button type="submit" className="border-softPink hover:bg-softPink/40">
            <Search className="h-4 w-4 text-deepNavy" />
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link href="/user/dashboard">
            <Button
              variant="outline"
              className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
            >
              Dashboard
            </Button>
          </Link>

          {isToken ? (
            <Logout />
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
