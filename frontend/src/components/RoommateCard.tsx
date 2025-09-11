import { Heart, MapPin,DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface RoommateCardProps {
    id:string,
    image:string,
    name:string,
    age:number,
    major:string,
    location:string,
    budget:number,
    bio:string,
    preferences:string[],
    sleepSchedule:"early" | "night",
    cleanliness:"neat" | "average" | "messy",
    className?: string;
}

const RoommateCard = ({
    image,
    name,
    age,
    major,
    location,
    budget,
    bio,
    preferences,
    sleepSchedule,
    cleanliness,
    className
}: RoommateCardProps) => {
    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-card-foreground">{name}, {age}</h3>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Heart className="w-4 h-4" />
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">{major}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <DollarSign className="w-3 h-3 mr-1"/>
                                <span>${budget}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1"/>
                        <span>{location}</span>
                    </div>

                    <p className="text-sm text-card-foreground line-clamp-2">{bio}</p>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Sleep :</span>
                            <Badge variant="outline" className="text-xs"> 
                                {sleepSchedule == "early" ? "Early Bird" : "Night Owl"}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Cleanliness :</span>
                            <Badge variant="outline" className="text-xs capatitalize"> 
                                {cleanliness}
                            </Badge>
                        </div>
                    </div>

                    {
                        preferences.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {
                                    preferences.slice(0, 3).map((pref, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {pref}
                                        </Badge>
                                    ))
                                }
                                {preferences.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{preferences.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )
                    }

                    <div className="flex space-x-2 pt-2">
                        <Button className="flex-1" variant="outline">
                            Connect
                        </Button>
                        <Button className="flex-1">
                            Bookmark
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export default RoommateCard;