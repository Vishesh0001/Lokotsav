import EventCards  from "@/components/FeaturedEvents";
import HeroSection from "@/components/HeroSection";
import TrendingPage from "@/components/TrendingEvents";




export default function Home() {
  return (
     <div className="min-h-screen">
   
      <HeroSection/>
      <EventCards/>
      <TrendingPage/>

    </div>
  );
}
