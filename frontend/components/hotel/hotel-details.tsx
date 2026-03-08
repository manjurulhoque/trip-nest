"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Wifi, Car, Coffee } from "lucide-react";
import { useGetHotelQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Hotel } from "@/lib/types";

interface HotelDetailsProps {
    hotelId: string;
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
                    {response?.errors?.detail || "Failed to load hotel details"}
                </AlertDescription>
            </Alert>
        );
    }

    // At this point we know hotel is defined
    const hotelData: Hotel = hotel;

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {hotelData.name}
                        </h1>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-semibold">
                                    {hotelData.average_rating.toFixed(1)}
                                </span>
                                <span className="text-gray-600 ml-1">
                                    ({hotelData.totalReviews ?? hotelData.reviewsCount} reviews)
                                </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-1" />
                                {hotelData.location}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge>{hotelData.type}</Badge>
                            {hotelData.tags?.map((tag: string) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Starting from</p>
                        <p className="text-3xl font-bold text-primary">
                            ${hotelData.basePrice ?? hotelData.minPrice}
                        </p>
                        <p className="text-sm text-gray-600">per night</p>
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h2 className="text-xl font-semibold mb-4">About this hotel</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    {hotelData.description}
                </p>
                {hotelData.additional_info && (
                    <p className="text-gray-700 leading-relaxed">
                        {hotelData.additional_info}
                    </p>
                )}
            </div>

            <Separator />

            <div>
                <h2 className="text-xl font-semibold mb-4">Quick Facts</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {hotelData.quick_facts?.map(
                        (fact: { icon: string; text: string }) => (
                            <div
                                key={fact.text}
                                className="flex items-center gap-2"
                            >
                                {getIcon(fact.icon)}
                                <span className="text-sm">{fact.text}</span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

function getIcon(name: string) {
    switch (name) {
        case "wifi":
            return <Wifi className="h-5 w-5 text-primary" />;
        case "car":
            return <Car className="h-5 w-5 text-primary" />;
        case "coffee":
            return <Coffee className="h-5 w-5 text-primary" />;
        default:
            return <Star className="h-5 w-5 text-primary" />;
    }
}
