"use client";
import { Bookmark } from 'lucide-react';
import { BookmarkCheck } from 'lucide-react';

import { useState, useEffect } from 'react';
import secureFetch from '@/utils/securefetch';

export default function BookmarkButton({ event_id }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    async function checkBookmark() {
      try {
        console.log('eventiddd',event_id);
        
        console.log('werwerwer');
        
        const response = await secureFetch('/getbookmark', { event_id }, 'POST');
        console.log('erwerwerwer',response);
        
        if (response.code ==1) {
          setIsBookmarked(response.data.is_bookmarked == 1);
        }
      } catch (err) {
        console.error('Failed to check bookmark:', err);
      }
    
      
    }
    checkBookmark();
  }, [event_id]);

  const toggleBookmark = async () => {
    try {
      const response = await secureFetch('/bookmark', { event_id }, 'POST');
      // console.log("res2",response);
      
      if (response.code == 1) {
        // console.log(response.data.is_bookmarked != 1);
        
        setIsBookmarked(response.data.is_bookmarked != 1);
        setError(null);
      } else {
        setError(response.message.keyword);
      }
      // console.log("heel");
      
    } catch (err) {
      setError('Failed to toggle bookmark');
    }
  };

  return (
    <div>
      <button
        onClick={toggleBookmark} className=" text-gray-500 hover:text-blue-600 transition">
        {isBookmarked ? <BookmarkCheck className='text-deepNavy'/> : <Bookmark/>}
      </button>

    </div>
  );
}
