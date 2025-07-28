import {
  Card,

  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import BookmarkButton from "./BookmarkButton";
import {Frown, MapPin, Sparkles, Users, Clock, IndianRupee, ArrowRight } from "lucide-react";
import { decrypt, encrypt } from "@/utils/crypto";
import Link from "next/link";

export default async function EventsPage() {
  // Fetch from backend
    const apiKey = process.env.NEXT_PUBLIC_API_KEY ;
  const encryptedApiKey =encrypt(apiKey)
  let events
  try {
      const res = await fetch("http://localhost:5000/v1/user/featuredEvents", {
   next: { revalidate: 300 }, // cache for 5 minutes
    method: "GET",
  headers: {
    "Content-Type": "application/json",
    "api-key": encryptedApiKey, // Replace with actual key
 
  },
  });

  // Decrypt the response
  // console.log('ere',res);
  
  const responseText = await res.text();
  // console.log('sss',responseText);
  
  const decrypteddata = decrypt(responseText);
   events = decrypteddata.data;
   if(events.length ==0 || events== null){
    return (<div className=" p-170 m-auto justify-center ">Cannot fetch fetured events</div>)
   }
  } catch (error) {
    return(    <div className="w-200 mx-auto m-7 p-6 border rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center h-64">
      <Frown className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-300 text-center">Oops! Failed to load cocntent.</p>
    </div>
    )
  }


  return (
  <section>
    <div className="w-full h-17 max-w-screen-xxl mt-4 mb-6 px-4">
      <div className=" h-20 relative bg-gradient-to-r from-accent/10 via-softPink/10 to-accent/10 border border-accent/20 rounded-2xl p-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-softPink/5"></div>
        <div className="absolute top-4 right-4 opacity-10">
          <Sparkles className="h-16 w-16 text-accent" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-3 rounded-full">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-deepNavy">Get Your Event Featured!</h3>
              <p className="text-gray-600 text-sm">Stand out and reach more attendees</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-accent">
                <IndianRupee className="h-6 w-6" />
                <span>99</span>
              </div>
              <p className="text-xs text-gray-600">only</p>
            </div>
            
            <Link href="/user/unfeatured-events">
              <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                Feature Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  <h1 className="text-5xl text-transparent text-center bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">
    Featured Events
  </h1>

 <Carousel className="w-full max-w-screen-xxl mx-auto relative overflow-hidden mt-6 px-4">

    <CarouselContent>
      {Array.from({ length: Math.ceil(events.length / 4) }).map((_, index) => (
        <CarouselItem key={index}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {events
              .slice(index * 4, index * 4 + 4)
              .map((event) => (
                <Card
                  key={event.id}
                  className="relative h-136  bg-white border border-base/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        className="rounded-t-2xl w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        src={event.cover_image}
                        alt="event cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-deepNavy tracking-tight truncate max-w-[75%] whitespace-nowrap overflow-hidden">
                          {event.event_title}
                        </CardTitle>
                        {event.is_featured ? (
                          <span className="flex items-center bg-softPink/20 text-softPink text-xs font-semibold px-2 py-0.5 rounded-full">
                            <Sparkles className="h-4 w-4 mr-1" /> Featured
                          </span>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <CardDescription className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {event.description?.length > 80
                          ? event.description.slice(0, 80) + "..."
                          : event.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 py-3 space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-accent" />
                      <span>{event.location}, {event.city}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Users className="h-4 w-4 mr-2 text-accent" />
                      <span>{event.registrations} registrations</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-accent" />
                      <span>
                        {new Date(event.start_time).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="px-4 py-3 bg-base/10 flex justify-between items-center">
                    <div className="text-xs text-gray-600">
                      Category: <span className="capitalize text-deepNavy font-semibold">{event.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookmarkButton event_id={event.id} />
                      <Link href={`/event/${event.id}`}>
                        <button className="text-xs font-semibold text-white bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-md transition-colors duration-200">
                   Explore   
                        </button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
<CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2" />
<CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2" />

  </Carousel>
</section>

  );
}