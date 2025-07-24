import EventCards  from "@/components/FeaturedEvents";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatisticsSection";
import TrendingPage from "@/components/TrendingEvents";




export default function Home() {
  return (
     <div className="min-h-screen">
   
      <HeroSection/>
      <StatsSection/>
      <EventCards/>
      <TrendingPage/>

    </div>
  );
}
