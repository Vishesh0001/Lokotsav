
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
          <p className="text-xl font-semibold text-accent mb-6">
  Your gateway to the most exciting local festivals, workshops, and meetups in Gujarat!
</p>

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

    
        <p className="text-lg md:text-xl text-gray-600 mb-1 mt-2 max-w-2xl mx-auto leading-relaxed">
          Discover amazing concerts, vibrant meetups, creative workshops, and exciting community events 
          happening right in your neighborhood. Join the local celebration!
        </p>
<div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
  <Link href="/events">
    <Button 
      size="lg" 
      className="px-12 py-4 text-lg font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-accent text-white hover:bg-accent/90">
      <PartyPopper className="mr-3"/> 
      Explore Events
    </Button>
  </Link>
  <Link href='/user/create-event'>
    <Button 
      variant="outline" 
      size="lg" 
      className="px-12 py-4 text-lg font-semibold rounded-lg border-2 border-accent text-accent bg-white hover:bg-accent hover:text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      <BadgePlus className="mr-3"/> 
      Create Event
    </Button>
  </Link>
</div>

  
 
        <Categories/>
      </div>


    </section>
  );
}