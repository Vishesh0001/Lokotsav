
import Navbar from "@/components/Navbar";
import "./globals.css";

import { Toaster } from "sonner";
import Footer from "@/components/Footer";


export const metadata = {
  title: "Lokotsav",
  description: "Find Events Happening In Gujarat",
  keywords: ["events", "tickets", "event booking","Gujarat","gujarat","Ahmedabad",
    "Lokotsav","Local events",'trending events','bookmark','booking','create event','local event','near you', "nextjs"],
  openGraph: {
    title: "Lokotsav",
    description: "Discover trending events and book tickets easily.",
      icons: {
    icon: "/favicon.ico",
  },
    url: "https://lokotsav-dn5p.vercel.app/",
    siteName: "Lokotsav",
  
    locale: "en_US",
    type: "website",
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     
     <body className="bg-base text-black">
       <Navbar/>{children}
     <Toaster offset={80}
  position="top-center"
/>
<Footer/>
       </body>
    
    </html>
  );
}
