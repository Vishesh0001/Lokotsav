// 'use client'; // Client Component for interactivity

// import { useState } from 'react';
// import Link from 'next/link';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Search, MapPin, Plus, Radar } from 'lucide-react';

// export default function Navbar({ user, role }) {
//   const [search, setSearch] = useState('');
//   const [location, setLocation] = useState('');

//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//     const query = new URLSearchParams();
//     if(search) {query.append('s',search)}
//     if(location){query.append('city', location)}
//     console.log(query);
    
//   };

//   return (
// <nav className="sticky top-0 z-50 bg-base shadow-md border-b border-softGray backdrop-blur-md px-4 sm:px-6 lg:px-8">
//   <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 py-3">
//     {/* <img src="/globe.svg" alt="Lokotsav Logo" className="h-12 w-auto text-white" /> */}
//   <Link href='/'><Radar className='h-12 w-12 text-gray-500 hover:text-purple-400'/></Link>  
//     <Link href="/" className="text-3xl font-bold text-softPink hover:text-accent">
//       Lokotsav
//     </Link>

//     {/* Search + Location */}
//     <div className="pl-7 ml-5 flex flex-wrap items-center gap-2 min-w-[250px] flex-1 justify-end">
//       <Input
//         placeholder="Search events..."
//         value={search}
//         onChange={handleSearch}
//         className= "pl-8 w-full sm:w-64 bg-white text-black border border-accent hover:bg-softGray"
//         aria-label="Search events"
//       />

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="outline"
//             className="bg-white flex items-center space-x-2 border-accent text-deepNavy hover:bg-softPink whitespace-nowrap"
//           >
//             <MapPin className="h-4 w-4 text-deepNavy" />
//             <span>{location || 'Select Location'}</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem onSelect={() => setLocation('New York')}>
//             New York
//           </DropdownMenuItem>
//           <DropdownMenuItem onSelect={() => setLocation('London')}>
//             London
//           </DropdownMenuItem>
//           <DropdownMenuItem onSelect={() => setLocation('Tokyo')}>
//             Tokyo
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       <Button
//         onClick={handleSearch}
//         className="border-softPink hover:bg-softPink/10"
//       >
//         <Search className="h-4 w-4 text-deepNavy" />
//       </Button>
//     </div>


//     <div className="flex flex-wrap items-center justify-end gap-2 flex-1">
  

//       <Link href={`/user/dashboard`}>
//         <Button
//           variant="outline"
//           className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
//         >
//           Dashboard
//         </Button>
//       </Link>
//       <Link href="/login">
//         <Button
//           variant="outline"
//           className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
//         >
//           Login
//         </Button>
//       </Link>
      
//     </div>
//   </div>
// </nav>

//   );
// }
'use client';

import {useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MapPin, Radar } from 'lucide-react';
import Cookies from 'js-cookie';
import Logout from './logout';
import { usePathname } from 'next/navigation';
export default function Navbar({ user, role }) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();
const [isToken, setisToken] = useState(false);
const pathname = usePathname();
useEffect(() => {
  const token = Cookies.get('token');
  if (token) {
    setisToken(true);
  } else {
    setisToken(false);
  }
}, [pathname]);

  const handleSearchClick = () => {
    const query = new URLSearchParams();
    if (search) query.append('s', search);
    if (location) query.append('city', location);
    router.push(`/events/searchEvents/${query.toString()}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-base shadow-md border-b border-softGray backdrop-blur-md px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 py-3">
        <Link href="/">
          <Radar className="h-12 w-12 text-gray-500 hover:text-purple-400" />
        </Link>
        <Link href="/" className="text-3xl font-bold text-softPink hover:text-accent">
          Lokotsav
        </Link>

        {/* Search + Location */}
        <div className="pl-7 ml-5 flex flex-wrap items-center gap-2 min-w-[250px] flex-1 justify-end">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-full sm:w-64 bg-white text-black border border-accent hover:bg-softGray"
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
              {['Vadodara', 'Ahmedabad', 'Surat', 'Rajkot'].map((city) => (
                <DropdownMenuItem key={city} onSelect={() => setLocation(city)}>
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleSearchClick}
            className="border-softPink hover:bg-softPink/10"
          >
            <Search className="h-4 w-4 text-deepNavy" />
          </Button>
        </div>

        {/* Right Side Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2 flex-1">
          <Link href="/user/dashboard">
            <Button
              variant="outline"
              className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
            >
              Dashboard
            </Button>
          </Link>
        {isToken?<Logout/>:  <Link href="/login">
            <Button
              variant="outline"
              className="bg-softPink text-black border border-softGray hover:bg-accent whitespace-nowrap"
            >
              Login
            </Button>
          </Link>}
        </div>
      </div>
    </nav>
  );
}
