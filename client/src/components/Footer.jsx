'use client'
import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-320 right-0 border-base/20 py-2 px-4 flex justify-center items-center text-sm text-gray-500">
            <span>Made with </span>
            <Heart className="h-4 w-4 mx-1 text-gray-600 fill-current" />
            <span>by Vishesh Shah</span>
        </footer>
    );
}