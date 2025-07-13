"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import secureFetch from "@/utils/securefetch";
import { toast } from "sonner";


export default function BuyTicketPage() {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch event details on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await secureFetch(`/displayEvent`, { id }, "POST");
        if (response.code == "1") {
          setEvent(response.data);
        } else {
          setError(response.message.keyword);
          toast.error(response.message.keyword || "Failed to fetch event details");
        }
      } catch (err) {
        setError("network_error");
        toast.error("Failed to fetch event details");
      }
    };
    fetchEvent();
  }, [id]);

  // Handle ticket purchase
  // const handleBuyTicket = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  // //   try {
  // //     const response = await secureFetch(
  // //       "/buy-ticket",
  // //       { event_id: id, quantity },
  // //       "POST"
  // //     );
  // //     if (response.code === "1") {
  // //       toast.success(response.message.keyword || "Tickets purchased successfully!");
  // //     } else {
  // //       setError(response.message.keyword);
  // //       toast.error(response.message.keyword || "Failed to purchase tickets");
  // //     }
  // //   } catch (err) {
  // //     setError("network_error");
  // //     toast.error("Failed to purchase tickets");
  // //   } finally {
  // //     setLoading(false);
  // //   }
  // };

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
        <p className="text-gray-600 mb-2">
          <strong>Price:</strong> ${event.ticket_price || 10} per ticket
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