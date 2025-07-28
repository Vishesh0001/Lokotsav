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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MapPin, 
  Radar, 
  User, 
  Calendar,
  Bookmark,
  Plus,
  LayoutDashboard,
  CreditCard,
  Events,
  List,
  Menu,
  House,
  SquareGanttChart,
  Trash,
  Trash2,
  File
} from 'lucide-react';
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
    ('sdsdsdsds',search,location);
    
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
                <span>{location || 'Select City'}</span>
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
         <Link href='/'><Button variant='link' className='mr-0 p-0'>Home</Button></Link>
<Link href='/about'><Button variant='link'>About us</Button></Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
                  >
                    <Menu className="h-4 w-4 mr-2" />
                Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
              
                  <DropdownMenuItem asChild>
                    <Link href="/user/dashboard" className="flex items-center">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <Link href="/calender" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Event Calendar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/dashboard#approved" className="flex items-center">
                      <SquareGanttChart className="h-4 w-4 mr-2" />
                      My Events
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/user/dashboard#bookmarked" className="flex items-center">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmarked Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/create-event" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/events" className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      All Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/order-details" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment History
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/user/delete-account" className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                
                </DropdownMenuContent>
              </DropdownMenu>
          {isToken? (<Logout/>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}