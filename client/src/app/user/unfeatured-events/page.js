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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import BookmarkButton from "@/components/BookmarkButton";
import {Frown, MapPin, Sparkles, Users, Clock ,IndianRupee} from "lucide-react";
import { useRouter } from 'next/navigation';
import { encrypt } from "@/utils/crypto";


export default function UnfeaturedEvents(){
    const router = useRouter();
    const [ u ,setunFeatured]= useState([]);
    useEffect(()=>{
         async function getunfeatured(){
            try{
              const response = await secureFetch("/unfeatured",{},'GET')
        if(response.code==1){
            // ("res data",response.data);
            
          setunFeatured(response.data)
          // ('hook',bookmarkedEvnets);
          
        }else{
              setunFeatured([])
        }

     }catch(error){
        toast.error(error.message)
     }
    }
    getunfeatured()
    },[])

    async function handlefeatureorder(id){
        try {
            const res = await secureFetch('/featureorder',{id},'POST')
            ('er',res);
            
            if(res.code==1){
                const order_id = res.data
                toast.success('complete your payment')
                let encid = encrypt(String(order_id))
                router.push(`/user/payment/${encid}`)
            }
            else{
                toast.error('something went wrong while featuring you event')
            }
        } catch (error) {
            toast.error('error in generating your order')
        }
    }
return(
    
 <section className=" px-4  bg-base">
  <h1 className="text-5xl text-transparent underline  text-center  mt-0 bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">Your approved Events</h1>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base">
  { u.length == 0 ? (
  <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
    <Frown className="h-8 w-8 text-gray-400" />
    <p className="text-gray-500 mt-2 text-sm">Your event has not got approved OR you might have not created any events Or all your events are already featured.</p>
  </div>
) : ( u.map((event) => (
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
        <AlertDialog>
      <AlertDialogTrigger asChild>
            <button className="text-xs font-semibold text-white bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-md transition-colors duration-200">
          Feature this event
            </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Feature Your Event!</AlertDialogTitle>
          <AlertDialogDescription>
           you can feature your event by just paying 99 rs. your event will be featured and will be visible on home screen
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
       <AlertDialogAction onClick={() => handlefeatureorder(event.id)}>Pay<IndianRupee className="h-5"/>99</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  )))}
        
</div>
</section>
)
}