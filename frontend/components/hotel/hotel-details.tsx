 "use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin } from "lucide-react";
import { useGetHotelQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Hotel } from "@/lib/types";

interface HotelDetailsProps {
    hotelId: string;
}

function formatLocation(hotel: Hotel): string {
    const parts: string[] = [];
    if (hotel.city?.name) parts.push(hotel.city.name);
    if (hotel.city?.countryName) parts.push(hotel.city.countryName);
    if (hotel.address && !parts.length) parts.push(hotel.address);
    else if (hotel.address) parts.push(hotel.address);
    return parts.length ? parts.join(", ") : "—";
}

export function HotelDetails({ hotelId }: HotelDetailsProps) {
    const { data: response, isLoading, error } = useGetHotelQuery(hotelId);
    const hotel = response?.data;

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !hotel) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Failed to load hotel details
                </AlertDescription>
            </Alert>
        );
    }

    const hotelData: Hotel = hotel;
    const location = formatLocation(hotelData);
    const rating = hotelData.rating;
    const reviewsCount = hotelData.reviewsCount ?? 0;

    return (
        <div className="space-y-6 w-full min-w-0">
            <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {hotelData.name}
                        </h1>
                        <div className="flex items-center flex-wrap gap-3 mb-3">
                            {rating != null && (
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-semibold">
                                        {Number(rating).toFixed(1)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        ({reviewsCount} reviews)
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1 shrink-0" />
                                <span>{location}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {hotelData.hotelType?.name && (
                                <Badge>{hotelData.hotelType.name}</Badge>
                            )}
                            {hotelData.stars != null && (
                                <Badge variant="secondary">
                                    {hotelData.stars} stars
                                </Badge>
                            )}
                            {hotelData.bestSeller && (
                                <Badge variant="secondary">Best seller</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {hotelData.description && (
                <>
                    <Separator />
                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            About this hotel
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {hotelData.description}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

