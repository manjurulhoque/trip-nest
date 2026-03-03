"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, MapPin, Wifi, Car, Waves } from "lucide-react";
import { useSearchHotelsQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Hotel } from "@/lib/types/hotel";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
    searchParams: {
        city?: string;
        stars?: number;
        min_rating?: number;
        price_min?: number;
        price_max?: number;
        facilities?: string[];
        q?: string;
        page?: number;
    };
}

const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
        case "wifi":
            return <Wifi className="h-3 w-3" />;
        case "parking":
            return <Car className="h-3 w-3" />;
        case "pool":
            return <Waves className="h-3 w-3" />;
        default:
            return null;
    }
};

export function SearchResults({ searchParams }: SearchResultsProps) {
    const router = useRouter();
    const {
        data: response,
        isLoading,
        error,
    } = useSearchHotelsQuery(searchParams);

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !response.data) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {response?.errors?.detail ||
                        "Failed to load search results"}
                </AlertDescription>
            </Alert>
        );
    }

    const hotels = response.data.results;

    if (hotels.length === 0) {
        return (
            <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                <p className="text-gray-600">
                    Try adjusting your search filters
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {hotels.map((hotel: Hotel) => (
                <Card
                    key={hotel.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                    <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                            <div className="relative flex-shrink-0">
                                <img
                                    src={hotel.main_photo || "/placeholder.svg"}
                                    alt={hotel.name}
                                    className="w-64 h-48 object-cover rounded-lg"
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                >
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">
                                                {hotel.name}
                                            </h3>
                                            <div className="flex items-center text-gray-600 mb-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {hotel.location}
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {hotel.address}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center mb-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                                <span className="font-semibold">
                                                    {hotel.average_rating?.toFixed(
                                                        1
                                                    )}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">
                                                    ({hotel.total_reviews})
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {hotel.best_seller && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                Best Seller
                                            </Badge>
                                        )}
                                        {hotel.type && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {hotel.type}
                                            </Badge>
                                        )}
                                        {hotel.tags?.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3">
                                        {hotel.description}
                                    </p>

                                    <div className="flex items-center gap-3 mb-3">
                                        {hotel.facilities
                                            .slice(0, 3)
                                            .map((facility) => (
                                                <div
                                                    key={facility.id}
                                                    className="flex items-center gap-1 text-xs text-gray-600"
                                                >
                                                    {getAmenityIcon(
                                                        facility.icon || ""
                                                    )}
                                                    <span>{facility.name}</span>
                                                </div>
                                            ))}
                                        {hotel.facilities.length > 3 && (
                                            <span className="text-xs text-gray-500">
                                                +{hotel.facilities.length - 3}{" "}
                                                more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {hotel.price && hotel.base_price &&
                                                hotel.price >
                                                    hotel.base_price && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ${hotel.price}
                                                    </span>
                                                )}
                                            <span className="text-2xl font-bold">
                                                ${hotel.base_price}
                                            </span>
                                            <span className="text-gray-600">
                                                per night
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            includes taxes and fees
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            router.push(`/hotels/${hotel.id}`)
                                        }
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
