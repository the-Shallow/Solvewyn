import { Heart, MapPin,Calendar, Users } from "lucide-react";
import {Card,CardContent} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Link } from "react-router-dom";

interface ListingCardProps {
    id: string;
    image: string;
    title: string;
    rent:number;
    location: string;
    availableDate: string;
    roomType: "private" | "shared";
    distance?: string;
    features?: string[];
    isVerified?: boolean;
    className?: string;
}

const ListingCard = ({
    id,
    image,
    title,
    rent,
    location,
    availableDate,
    roomType,
    distance,
    features = [],
    isVerified = false,
    className = "",
}: ListingCardProps) => {
    return (
        <Card className={ `overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
            
            <div className="relative">
                <img src={image} alt={title} className="w-full h-48 object-cover" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm hover:bg-card"
                >

                    <Heart className="w-4 h-4" />
                </Button>

                {isVerified && (
                    <Badge className="absolute top-2 left-2 bg-success text-success-foreground">
                        Verified
                    </Badge>
                )}
            </div>

            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-card-foreground line-clamp-1">{title}</h3>
                        <span className="text-lg font-bold text-primary">${rent}/mo</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="line-clamp-1">{location}</span>
                        {distance && (
                            <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                                {distance}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">{availableDate}</span>
                        </div>

                        <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium capitalize">{roomType}</span>
                        </div>
                    </div>

                    {
                        features.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-2">
                                {features.slice(0, 3).map((feature) => (
                                    <Badge key={feature} variant="outline" className="text-xs">
                                        {feature}
                                    </Badge>
                                ))}
                                {features.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{features.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )
                    }

                    <Link to={`/listing/${id}`} className="block w-full">
                        <Button className="w-full mt-3" variant="outline">
                            View Details
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default ListingCard;
