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
import { Frown, MapPin, Sparkles, Users, Clock } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [unapprovedEvents, setUnapprovedEvents] = useState([]);

  const [bookmarkedError, setBookmarkedError] = useState(false);
  const [approvedError, setApprovedError] = useState(false);
  const [unapprovedError, setUnapprovedError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 1000);
        }
      }
    }
  }, []);

  useEffect(() => {
    async function getBookmark() {
      try {
        const response = await secureFetch("/getBookmarkedEvents", {}, "GET");
        if (response.code == 1) {
          setBookmarkedEvents(response.data);
          setBookmarkedError(false);
        } else {
          setBookmarkedError(true);
        }
      } catch (error) {
        setBookmarkedError(true);
        toast.error(error.message);
      }
    }
    async function getApprovedEvents() {
      try {
        const response = await secureFetch("/approved", {}, "GET");
        if (response.code == 1) {
          setApprovedEvents(response.data);
          setApprovedError(false);
        } else {
          setApprovedError(true);
        }
      } catch (error) {
        setApprovedError(true);
        toast.error(error.message);
      }
    }
    async function getUnApprovedEvents() {
      try {
        const response = await secureFetch("/unapproved", {}, "GET");
        if (response.code == 1) {
          setUnapprovedEvents(response.data);
          setUnapprovedError(false);
        } else {
          setUnapprovedError(true);
        }
      } catch (error) {
        setUnapprovedError(true);
        toast.error(error.message);
      }
    }
    getBookmark();
    getApprovedEvents();
    getUnApprovedEvents();
  }, []);

  // Card rendering helper
  function renderEvents(events, withBookmarkButton = true) {
    return events.map((event) => (
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
                <div />
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
            <span>
              {event.location}, {event.city}
            </span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <Users className="h-4 w-4 mr-2 text-accent" />
            <span>{event.registrations} registrations</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <Clock className="h-4 w-4 mr-2 text-accent" />
            <span>
              {new Date(event.start_time).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 bg-base/10 flex justify-between items-center">
          <div className="text-xs text-gray-600">
            Category:{" "}
            <span className="capitalize text-deepNavy font-semibold">
              {event.category}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {withBookmarkButton && <BookmarkButton event_id={event.id} />}
            <Link href={`/event/${event.id}`}>
              <button className="text-xs font-semibold text-white bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-md transition-colors duration-200">
                Explore
              </button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    ));
  }

  return (
    <div className="scroll-smooth">
      {/* Bookmarked Events */}
      <section id="bookmarked" className="px-4 bg-base">
        <h1 className="text-5xl text-transparent underline text-center mt-0 bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">
          Bookmarked Events
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base">
          {bookmarkedError ? (
            <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
              <Frown className="h-8 w-8 text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">
                Oops! Failed to load content.
              </p>
            </div>
          ) : bookmarkedEvents.length == 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
              <Frown className="h-8 w-8 text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">
                No bookmarked events found.
              </p>
            </div>
          ) : (
            renderEvents(bookmarkedEvents, true)
          )}
        </div>
      </section>
      {/* Approved Events */}
      <section id="approved" className="px-4 bg-base">
        <h1 className="text-5xl text-transparent underline text-center mt-4 bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">
          Approved Events
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base">
          {approvedError ? (
            <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
              <Frown className="h-8 w-8 text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">
                Oops! Failed to load content.
              </p>
            </div>
          ) : approvedEvents.length == 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
              <Frown className="h-8 w-8 text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">
                No approved events found.
              </p>
            </div>
          ) : (
            renderEvents(approvedEvents, true)
          )}
        </div>
      </section>
      {/* Unapproved Events */}
      <section id="unapproved" className="px-1 mt-2 bg-base">
        <h1 className="text-5xl text-transparent underline text-center mt-4 bg-gradient-to-br from-deepNavy via-accent to-softPink bg-clip-text">
          Events Awaiting Approval
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base">
          {unapprovedError ? (
            <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
              <Frown className="h-8 w-8 text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">
                Oops! Failed to load content.
              </p>
            </div>
          ) : unapprovedEvents.length == 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-40 bg-muted rounded-xl">
              <Frown className="h-8 w-8 text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">
                No events created by you.
              </p>
            </div>
          ) : (
            renderEvents(unapprovedEvents, false)
          )}
        </div>
      </section>
    </div>
  );
}
