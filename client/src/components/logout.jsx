"use client";

import { encrypt } from "@/utils/crypto";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function Logout() {

  const apiKey = process.env.NEXT_PUBLIC_API_KEY ;
  const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL
  const encryptedApiKey =encrypt(apiKey)
  async function handleLogout() {
    const token = Cookies.get("token");
    const encryptedToken = encrypt(token)
    try {
      const response = await fetch(`${BaseURL}/v1/user/logout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: encryptedToken,
          'api-key': encryptedApiKey,
        },
      });
      if (response.status == 200) {
        Cookies.remove('token', { path: '/' });
       toast.success('logout success!')
         window.location.href = '/login';
      } else {
       toast.warning(response.message.keyword)
      }
    } catch (error) {
      console.error("Logout error:", error);
     toast.error(error.message)
    }
  }

  return (
    <Button
  onClick={handleLogout} 
  variant='outline'
  className="bg-red-400"
>
  <span className="relative z-10">Logout</span>

</Button>
  );
}