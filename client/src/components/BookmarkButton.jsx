"use client";
import { Bookmark } from 'lucide-react';
import { BookmarkCheck } from 'lucide-react';

import { useState, useEffect } from 'react';
import secureFetch from '@/utils/securefetch';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function BookmarkButton({ event_id }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
const [Loading,setLoading] = useState(true)
  const router = useRouter();
  
  useEffect(() => {
    async function checkBookmark() {
      try {
      const token = Cookies.get("token");
        if (!token) return; // Don't check if not logged in
        
        const response = await secureFetch('/getbookmark', { event_id }, 'POST');
        // ('erwerwerwer',response);
        
        if (response.code ==1) {
          setIsBookmarked(response.data.is_bookmarked == 1);
        }
      } catch (err) {
        console.error('Failed to check bookmark:', err);
      }finally{
        setLoading(false)
      }
    
      
    }
    checkBookmark();
  }, [event_id]);

  const toggleBookmark = async () => {
        const token = Cookies.get("token");

    if (!token) {
      toast.warning("You need to login first", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }
    try {
      const response = await secureFetch('/bookmark', { event_id }, 'POST');
      // ("res2",response);

      if (response.code == 1) {
        // (response.data.is_bookmarked != 1);
        
        if(isBookmarked == false){
          setIsBookmarked(true)
          toast.success("Event Bookmarked")
        }else{
          setIsBookmarked(false);
          toast.success("Bookmark Removed")
        }
       
        // ("toast for bookmarkl");

 
      } else {
        toast.error(response.message.keyword)

      }
      // ("heel");
      
    } catch (err) {
    toast.error(err.message)
    }
  };

  return (
    <div>
      <button
         aria-label={isBookmarked ? "Remove bookmark" : "Add to bookmark"}
       disabled={Loading} onClick={toggleBookmark} className=" text-gray-500 hover:text-blue-600 transition">
        {isBookmarked ? <BookmarkCheck /> : <Bookmark/>}
      </button>

    </div>
  );
}
