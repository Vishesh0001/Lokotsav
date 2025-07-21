"use client";

import { encrypt } from "@/utils/crypto";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Logout() {
  const router = useRouter();

  async function handleLogout() {
    const token = Cookies.get("token");
    const encryptedToken = encrypt(token)
    // console.log("token", token);

    try {
      const response = await fetch('http://localhost:5000/v1/user/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: encryptedToken,
        },
      });
console.log(response);

   
      if (response.status == 200) {
        // console.log('Before logout:', Cookies.get('token'));
        Cookies.remove('token', { path: '/' });
        // console.log('After logout:', Cookies.get('token'));
        //  Cookies.remove("token",{path:'/'});
       toast.success('logout success!')
        router.push("/login");
      } else {
       toast.warning(response.message.keyword)
      }
    } catch (error) {
      console.error("Logout error:", error);
     toast.error(error.message)
    }
  }

  return (
    // <button
    //   onClick={handleLogout}
    //   className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
    // >
    //   Logout
    // </button>
    <button 
  onClick={handleLogout} 
  className="group relative px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
>
  <span className="relative z-10">Logout</span>
  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</button>
  );
}