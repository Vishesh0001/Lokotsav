
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BadgePlus , PartyPopper} from 'lucide-react';
import Categories from './Categories';
export default function HeroSection() {
  return (
    <section className="relative md:h-150 sm:100 flex items-center justify-center overflow-hidden bg-base">
            <div className="relative z-10 container mx-auto px-4 text-center">
  
        <div className="mb-8">
          <h1 className="text-6xl mt-15 md:text-8xl font-black mb-4 leading-tight">
            <span className="block bg-gradient-to-r from-softPink via-accent to-purple-600 bg-clip-text text-transparent animate-pulse">
              Lokotsav
            </span>
          </h1>
          

          <div className="relative">
            <p className="text-2xl md:text-3xl font-medium text-gray-700 mb-2">
              Find Events Happening In Gujarat
            </p>
            <p className="text-2xl md:text-3xl font-medium mb-2">
              <span className="font-bold text-accent">
                Locally Near You
              </span>
            </p>
            
    
            <div className="flex justify-center mb-1">
              <div className="w-70  h-1 bg-gradient-to-r from-softPink to-accent rounded-full"></div>
            </div>
          </div>
        </div>

    
        <p className="text-lg md:text-xl text-gray-600 mb-1 max-w-2xl mx-auto leading-relaxed">
          Discover amazing concerts, vibrant meetups, creative workshops, and exciting community events 
          happening right in your neighborhood. Join the local celebration!
        </p>

  
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/events">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-accent hover:bg-accent/90 text-white border-2 border-softPink">
              <PartyPopper/> Explore Events
            </Button>
          </Link>
          <Link href='/user/create-event'>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-softPink text-accent bg-transparent hover:bg-softPink/10 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <BadgePlus/> Create Event
          </Button>
          </Link>
        </div>

        {/* Stats or Features */}
        {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center mb-15 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-softPink/10">
            <div className="text-3xl font-bold mb-2 text-accent">1000+</div>
            <p className="text-gray-600">Local Events</p>
          </div>
          
          <div className="text-center mb-15 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-accent/10">
            <div className="text-3xl font-bold mb-2 text-softPink">50+</div>
            <p className="text-gray-600">Cities Covered</p>
          </div>
          
          <div className="text-center mb-15 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-softPink/10">
            <div className="text-3xl font-bold mb-2 text-accent">24/7</div>
            <p className="text-gray-600">Event Discovery</p>
          </div>
        </div> */}
        <Categories/>
      </div>


    </section>
  );
}