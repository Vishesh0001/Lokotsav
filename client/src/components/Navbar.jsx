'use client'; // Client Component for interactivity

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MapPin, Plus } from 'lucide-react';

export default function Navbar({ user, role }) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const query = new URLSearchParams();
    if(search) {query.append('s',search)}
    if(location){query.append('city', location)}
    console.log(query);
    
  };

  return (
<nav className="sticky top-0 z-50 bg-base shadow-md border-b border-softGray backdrop-blur-md px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 py-3">
    <img src="/globe.svg" alt="Lokotsav Logo" className="h-12 w-auto text-white" />
    <Link href="/" className="text-3xl font-bold text-softPink">
      Lokotsav
    </Link>

    {/* Search + Location */}
    <div className="pl-7 ml-5 flex flex-wrap items-center gap-2 min-w-[250px] flex-1 justify-end">
      <Input
        placeholder="Search events..."
        value={search}
        onChange={handleSearch}
        className= "pl-8 w-full sm:w-64 bg-white text-black border border-accent hover:bg-softGray"
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
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setLocation('New York')}>
            New York
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setLocation('London')}>
            London
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setLocation('Tokyo')}>
            Tokyo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={handleSearch}
        className="border-softPink hover:bg-softPink/10"
      >
        <Search className="h-4 w-4 text-deepNavy" />
      </Button>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-wrap items-center justify-end gap-2 flex-1">
      {/* <Link href={`/${role}/events/create`}>
        <Button className="bg-mutedGold text-deepNavy border border-softGray flex items-center space-x-2 whitespace-nowrap">
          <Plus className="h-4 w-4 text-deepNavy hover:text-white" />
          <span>Create Event</span>
        </Button>
      </Link> */}

      <Link href={`/${role}/dashboard`}>
        <Button
          variant="outline"
          className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
        >
          Dashboard
        </Button>
      </Link>
      <Link href="/login">
        <Button
          variant="outline"
          className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
        >
          Login
        </Button>
      </Link>
      <Link href="/signup">
        <Button
          variant="outline"
          className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  </div>
</nav>

  );
}