"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams,useRouter } from "next/navigation";
import secureFetch from "@/utils/securefetch";
import { toast } from "sonner";
import { IndianRupee } from "lucide-react";

export default function BookTicketPage() {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const[initialQuantity,setInitialQuantity]=useState(0)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId,setOrderId]=useState(0)
const router = useRouter()
  // Fetch event details on mount
useEffect(() => {
  const fetchEvent = async () => {
    try {
      const response = await secureFetch(`/event`, { id }, "POST");
      if (response.code ==1 ) {
        if(response.data.length==0){
          setError('no event found')
        }
        setEvent(response.data);
      } else {
        setError(response.message.keyword || "Event not found");
      }
    } catch {
      setError("network_error");
    }
  };

  const checkBookingStatus = async () => {
    try {
      const response = await secureFetch(`/booking-status`, { id }, "POST");
      console.log(response);
            if(response.code == 8){
        setQuantity(1)
      }
     if (response.code == 1) {
          const q = Number(response.data[0].quantity);
          setQuantity(!isNaN(q) && q > 0 ? q : 1);
          setInitialQuantity(q);
          setOrderId(response.data[0].id);
        } else {
          setQuantity(1); 
        }

      }
     catch {
      toast.error("Booking fetch failed");
    }
  };

  fetchEvent();
  checkBookingStatus();
}, [id]);
const total_amount = useMemo(() => {
  if (!event) return 0;
  return event.ticket_price * quantity;
}, [event, quantity]);
  // Handle ticket purchase
  const handleBuyTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
if(orderId!= 0){
  if(quantity!=initialQuantity){
    const updateres = await secureFetch('/update-order',{
      order_id: orderId,
      quantity,
      total_amount},"POST"
    )
  
  if(updateres.code!=1){
    toast.error('Failed to update order')
    setLoading(false)
    return
  }toast.success('Order Updated!')
}
  router.push(`/user/payment/${orderId}`)
setLoading(false)}
else{
    try {
      const response = await secureFetch(
        "/book-ticket",
        { event_id: id, quantity,total_amount },
        "POST"
      );
      if (response.code == 1) {
        toast.success(response.message.keyword );

        
        router.push(`/user/payment/${response.data}`)
      } else {
        setError(response.message.keyword);
        toast.error(response.message.keyword || "Failed to purchase tickets");
      }
    } catch (err) {
      setError("network_error");
      toast.error("Failed to purchase tickets");
    } finally {
      setLoading(false);
    }}
  };

  if (!event && !error) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Error: {error}
      
      </div>
    );
  }

  return (

    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Buy Tickets for {event.event_title}
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">{event.event_title}</h2>
        <p className="text-gray-600 mb-2">
          <strong>Date:</strong>{" "}
          {new Date(event.start_time).toLocaleString()}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Location:</strong> {event.city}, {event.location}
        </p>
       <p className="text-gray-600 mb-2 flex items-center">
  <strong className="mr-1">Price:</strong>
  <IndianRupee className="h-4 w-4 inline-block mr-1" />
  <span>{event.ticket_price || 10} per ticket</span>
</p>

        <p className="text-gray-600 mb-4">
          <strong>Description:</strong> {event.description}
        </p>
      </div>
      <form onSubmit={handleBuyTicket} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">
            Number of Tickets
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
   <p className="text-lg font-semibold flex items-center space-x-1">
  <span>Total Amount to be paid:</span>
  <IndianRupee className="h-4 w-4 inline-block" />
  <span>{total_amount}</span>
</p>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Processing..." : "Buy Tickets"}
        </button>
      </form>
    
    </div>
  );
}