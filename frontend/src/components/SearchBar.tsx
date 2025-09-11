import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface SearchBarProps {
  onToggleMap: () => void;
  showMapToggle?: boolean;
}

const SearchBar = ({onToggleMap, showMapToggle = false} : SearchBarProps) => {
    const filterChips = [
        "Near Wolfline",
        "< 600",
        "Private Room",
        "Furnished",
        "Pet Friendly",
    ];

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5"/>
                <Input
                placeholder="Search for listings, neighborhoods, or amenities"
                className="pl-12 pr-20 h-14 border-border rounded-2xl text-base shadow-sm focus:shadow-md transition-shadow"
                 />
                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
                {showMapToggle && (
                    <Button 
                    variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onToggleMap}>
                        <MapPin className="w-4 h-4" />
                    </Button>
                )}
                 </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {filterChips.map((chip) => (
                    <Badge 
                     key={chip}
                     variant="secondary"
                     className="px-4 py-2 text-sm hover:bg-accent cursor-pointer transition-colors"
                     >
                        {chip}
                     </Badge>
                ))}
            </div>
        </div>
    )
};

export default SearchBar;