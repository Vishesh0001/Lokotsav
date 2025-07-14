import secureFetch from "@/utils/securefetch";

import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BookmarkButton from "@/components/BookmarkButton";
import { MapPin, Sparkles, Users, Clock } from "lucide-react";

import Link from "next/link";

export default async function Category({params}){

let events;
    const {category}= await params;
    const v = decodeURIComponent(category)

 try{
       const response=  await secureFetch('/category',{v},'POST')
       if(response.code==1){
            events = response.data;
        //    console.log('cat',events);
        if(response.data.length==0){
          return ( <div className="text-center text-gray-500 mt-10 text-lg">No events created in {v}</div>)
        }
           
       }else{
return(<div>no events found</div>)
       }
        }catch(error){
          console.log(error.message);
          
return(<div>something went wrong</div>)
        }
 

    return(<section>
  <h1 className="text-5xl text-transparent  text-center  mt-3.5 bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">{v}</h1>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base">
  {events.map((event) => (
    <Card
      key={event.id}
      className="relative h-136 bg-white border border-base/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
    >
      <CardHeader className="p-0">
        <div className="relative">
          <img
            className="rounded-t-2xl w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            src={event.cover_image}
            alt="event cover"
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
              View Details
            </button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  ))}
</div>
</section>

    )
}