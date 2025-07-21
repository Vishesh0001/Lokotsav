'use client'
import secureFetch from "@/utils/securefetch";
import { useEffect, useState } from "react";
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
import {Frown, MapPin, Sparkles, Users, Clock } from "lucide-react";
import Link from "next/link";




export default function UserDashboard(){
    const [bookmarkedEvnets,setBookmarkedEvents]= useState([])
        const [approvedEvents, setApprovedEvents] = useState([]);
        const [unapprovedEvents, setUnApprovedEvents] = useState([]);
          useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // Scroll after a short delay to ensure rendering is done
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1000); // You can increase delay if still not accurate
      }
    }
  }, []);
useEffect( () => {

    async function getBookmark(){
     try{
        const response = await secureFetch("/getBookmarkedEvents",{},'GET')
        if(response.code==1){
            // console.log("res data",response.data);
            
          setBookmarkedEvents(response.data)
          // console.log('hook',bookmarkedEvnets);
          
        }else{
               <div className="w-200 mx-auto m-7 p-6 border rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center h-64">
      <Frown className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-300 text-center">Oops! Failed to load cocntent.</p>
    </div>
        }

     }catch(error){
        toast.error(error.message)
     }
    }
        async function getApprovedEvents(){
     try{
        const response = await secureFetch("/approved",{},'GET')
        if(response.code==1){
            // console.log("res data",response.data);
            
          setApprovedEvents(response.data)
          // console.log('hook',bookmarkedEvnets);
          
        }else{
               <div className="w-200 mx-auto m-7 p-6 border rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center h-64">
      <Frown className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-300 text-center">Oops! Failed to load cocntent.</p>
    </div>
        }

     }catch(error){
        toast.error(error.message)
     }
    }
    async function getUnApprovedEvents(){
     try{
        const response = await secureFetch("/unapproved",{},'GET')
        if(response.code==1){
            // console.log("res data",response.data);
            
          setUnApprovedEvents(response.data)
          // console.log('hook',bookmarkedEvnets);
          
        }else{
               <div className="w-200 mx-auto m-7 p-6 border rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center h-64">
      <Frown className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-300 text-center">Oops! Failed to load cocntent.</p>
    </div>
        }

     }catch(error){
        toast.error(error.message)
     }
    }
    getUnApprovedEvents()
    getBookmark();
    getApprovedEvents()
},[])
// console.log("Approved Event IDs:", approvedEvents.map(e => e.id));
console.log(bookmarkedEvnets);


return(
 <div className="scroll-smooth">
 <section id='bookmarked'className=" px-4  bg-base">
  <h1 className="text-5xl text-transparent underline  text-center  mt-0 bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">Bookmarked Events</h1>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base">
  {bookmarkedEvnets.length === 0 ? (
  <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
    <Frown className="h-8 w-8 text-gray-400" />
    <p className="text-gray-500 mt-2 text-sm">No bookmarked events found.</p>
  </div>
) : (bookmarkedEvnets.map((event) => (
    <Card
      key={event.id}
      className="relative h-138 bg-white border border-base/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
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
            <CardTitle className="text-lg underline font-semibold text-deepNavy tracking-tight truncate max-w-[75%] whitespace-nowrap overflow-hidden">
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
              ? event.description.slice(0, 40) + "..."
              : event.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-4  space-y-2">
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

      <CardFooter className="px-4 mb-2  bg-base/10 flex justify-between items-center">
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
  )))}
</div>
</section>

<section id="approved" className=" px-4  bg-base">
<h1 className="text-5xl text-transparent underline  text-center  mt-4 bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">Approved Events</h1>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base">
  {approvedEvents.length ==0 ? (
  <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
    <Frown className="h-8 w-8 text-gray-400" />
    <p className="text-gray-500 mt-2 text-sm">No aprroved events found.</p>
  </div>
) : (approvedEvents.map((event) => (
    <Card
      key={event.id}
      className="relative h-135 bg-white border border-base/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
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
            <CardTitle className="text-lg underline font-semibold text-deepNavy tracking-tight truncate max-w-[75%] whitespace-nowrap overflow-hidden">
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
  )))}
</div>



</section>
<section id="unapproved" className=" px-1 mt-2 bg-base">
<h1 className="text-5xl text-transparent underline  text-center  mt-4 bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">Events Awaiting Approval </h1>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base">
  {unapprovedEvents.length == 0 ? (
  <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
    <Frown className="h-8 w-8 text-gray-400" />
    <p className="text-gray-500 mt-2 text-sm">No events created by you .</p>
  </div>
) : (unapprovedEvents.map((event) => (
    <Card
      key={event.id}
      className="relative h-135 bg-white border border-base/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
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
            <CardTitle className="text-lg underline font-semibold text-deepNavy tracking-tight truncate max-w-[75%] whitespace-nowrap overflow-hidden">
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
          {/* <BookmarkButton event_id={event.id} /> */}
          <Link href={`/event/${event.id}`}>
            <button className="text-xs font-semibold text-white bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-md transition-colors duration-200">
             Explore
            </button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )))}
</div>



</section>
    </div>
)

}