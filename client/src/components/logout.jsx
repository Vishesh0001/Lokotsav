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
    console.log("token", token);

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
    <button onClick={handleLogout} className="p-[3px] relative">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
    <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
      Logout
    </div>
  </button>
  );
}