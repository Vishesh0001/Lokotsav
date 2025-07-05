'use client'
import { Users, Book, Send, Music, Palette, Coffee, Briefcase, Smile, PenTool, Monitor,Tent, MoonStar, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Categories() {
    const router = useRouter();
    const categories = [
        { id: 1, name: "Cultural Festivals", icon: Users },
        { id: 2, name: "Religious Festivals", icon: Book },
        { id: 3, name: "Local Events", icon: Tent },
        { id: 4, name: "Dance & Music", icon: Music },
        { id: 5, name: "Art & Craft", icon: Palette },
        { id: 6, name: "Food & Culinary", icon: Coffee },
        { id: 7, name: "Business & Networking", icon: Briefcase },
        { id: 8, name: "Comedy Shows", icon: Smile },
        { id: 9, name: "Workshops & Performances", icon: PenTool },
        { id: 10, name: "Conferences & Exhibitions", icon: Monitor },
        {id:11,name:"Nightlife",icon:MoonStar},
        {id:12, name:"Hobbies",icon:Gamepad2}
      
    ];

    const handleCategoryClick = (categoryName) => {
        router.push(`/events/category/${categoryName}`);
    };

    return (
        <div className="bg-base/10 py-4 px-4">
            <div className="flex justify-center gap-3 flex-wrap">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        className="flex items-center px-3 py-1 bg-white border border-base/20 rounded-md text-sm font-medium text-deepNavy hover:bg-accent hover:text-white transition-colors duration-200"
                        aria-label={`Filter by ${category.name}`}
                    >
                        <category.icon className="h-4 w-4 mr-1 text-deepNavy hover:text-white" />
                        <span className="capitalize">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}