import BookmarkButton from "@/components/BookmarkButton";
import { Button } from "@/components/ui/button";
import secureFetch from "@/utils/securefetch"
import Link from "next/link";
import { Ticket } from "lucide-react";
import { toast } from "sonner";
export default async function event({params}) {
const {id} = await params;
let resdata;

try {
    let response = await secureFetch('/event',{id},'POST')
    // console.log(response);
    
    if(response.code==1){
         resdata = await response.data
        if(response.data.length==0){
          return(<p>no such event</p>)
        }
    }
} catch (error) {

  return(<p className="text-center text-red ">no such event</p>);
    throw new Error(`${error.message}`)
}


return(
<div className="flex justify-center min-h-screen p-6">
  <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-100 overflow-hidden">
    <img
      src={resdata.cover_image}
      alt="event image"
      className="w-full h-64 object-cover rounded-t-xl mb-6"
    />
    <h2 className="text-2xl font-semibold text-deepNavy mb-4">{resdata.event_title}</h2>
    <p className="text-deepNavy mb-4" dangerouslySetInnerHTML={{ __html: resdata.description }}></p>
    <p className="text-gray-400 mb-2"><strong className="text-accent">Category:</strong> {resdata.category}</p>
    <p className="text-gray-400 mb-2"><strong className="text-accent">City:</strong> {resdata.city}</p>
    <p className="text-gray-400 mb-2"><strong className="text-accent">Location:</strong> {resdata.location}</p>
    <p className="text-gray-400 mb-2"><strong className="text-accent">Registrations:</strong> {resdata.registrations}</p>
    <p className="text-gray-400 mb-2"><strong className="text-accent">Start Time:</strong> {new Date(resdata.start_time).toLocaleString()}</p>
    <p className="text-gray-400 mb-2"><strong className="text-accent">End Time:</strong> {new Date(resdata.end_time).toLocaleString()}</p>
    {resdata.tips && <p className="text-gray-400 mb-2"><strong className="text-accent">Tips:</strong> {resdata.tips}</p>}
    {resdata.cultural_significance && (
      <p className="text-gray-400 mb-2"><strong className="text-accent">Cultural Significance:</strong> {resdata.cultural_significance}</p>
    )}
    <div className="w-auto flex justify-between">
      <div className="mb-5 p-1 w-9 h-9 rounded-4xl text-center bg-softPink hover:bg-accent">
        <BookmarkButton event_id={id} />
      </div>
      <Link href={`/user/ticket/${id}`}>
        <Button variant="outline"><Ticket />Buy Tickets</Button>
      </Link>
    </div>
  </div>
</div>


  )
  }