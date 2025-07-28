import {
  Card,
  CardAction,
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
import {Frown, MapPin, Sparkles, Users, Clock, Flame } from "lucide-react";
import { decrypt, encrypt } from "@/utils/crypto";
import Link from "next/link";

export default async function TrendingPage() {
  // Fetch from backend
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ;
  const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL
  const encryptedApiKey =encrypt(apiKey)
  let events
  try {
const res = await fetch(`${BaseURL}/v1/user/trendingevents`, {
  method: "GET",
  cache: "no-store",
  headers: {
    "Content-Type": "application/json",
    "api-key": encryptedApiKey, // Replace with actual key
 
  },
});

  // Decrypt the response
  // ('ere',res);
  
  const responseText = await res.text();
  // ('sss',responseText);
  
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
  <h1 className="text-5xl text-transparent text-center mt-3.5 bg-gradient-to-br from-orange-500 via-red-400 to-pink-400 bg-clip-text">
    Trending Events
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
                  className="relative h-136 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group hover:shadow-orange-200/50"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        className="rounded-t-2xl w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        src={event.cover_image}
                        alt="event cover" loading="lazy"
                      />
                      <div className="absolute top-2 right-2">
                        <Flame className="h-8 w-8 text-orange-500 bg-white/90 rounded-full p-1" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-orange-900 tracking-tight truncate max-w-[75%] whitespace-nowrap overflow-hidden">
                          {event.event_title}
                        </CardTitle>
                        {event.is_featured ? (
                          <span className="flex items-center bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                            <Sparkles className="h-4 w-4 mr-1" /> Featured
                          </span>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <CardDescription className="text-sm text-orange-700 mt-2 leading-relaxed">
                        {event.description?.length > 80
                          ? event.description.slice(0, 80) + "..."
                          : event.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 py-3 space-y-2">
                    <div className="flex items-center text-orange-800 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-red-500" />
                      <span>{event.location}, {event.city}</span>
                    </div>
                    <div className="flex items-center text-orange-800 text-sm">
                      <Users className="h-4 w-4 mr-2 text-red-500" />
                      <span>{event.registrations} registrations</span>
                    </div>
                    <div className="flex items-center text-orange-800 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-red-500" />
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

                  <CardFooter className="px-4 py-3 bg-orange-100/60 flex justify-between items-center">
                    <div className="text-xs text-orange-700">
                      Category: <span className="capitalize text-orange-900 font-semibold">{event.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookmarkButton event_id={event.id} />
                      <Link href={`/event/${event.id}`}>
                        <button className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors duration-200">
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
<CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-orange-50" />
<CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-orange-50" />

  </Carousel>
</section>

  );
}