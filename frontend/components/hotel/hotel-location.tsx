"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car } from "lucide-react";
import { useGetHotelQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface HotelLocationProps {
    hotelId: string;
}

interface NearbyAttraction {
    name: string;
    distance: string;
    walkTime: string;
}

interface Transportation {
    name: string;
    distance: string;
    time: string;
}

export function HotelLocation({ hotelId }: HotelLocationProps) {
    const { data: response, isLoading, error } = useGetHotelQuery(hotelId);

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !response.data) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {response?.errors?.detail ||
                        "Failed to load hotel location"}
                </AlertDescription>
            </Alert>
        );
    }

    const hotel = response.data;
    const nearbyAttractions: NearbyAttraction[] =
        hotel.nearbyAttractions || [];
    const transportation: Transportation[] = hotel.transportation || [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Location & Nearby</h2>
                <p className="text-gray-600">
                    Perfectly located in {hotel.city.name}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Nearby Attractions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {nearbyAttractions.map((attraction) => (
                                <div
                                    key={attraction.name}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {attraction.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {attraction.distance}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {attraction.walkTime}
                                    </Badge>
                                </div>
                            ))}
                            {nearbyAttractions.length === 0 && (
                                <p className="text-gray-600">
                                    No nearby attractions information available
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Car className="h-5 w-5 text-primary" />
                            Transportation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {transportation.map((transport) => (
                                <div
                                    key={transport.name}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {transport.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {transport.distance}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {transport.time}
                                    </Badge>
                                </div>
                            ))}
                            {transportation.length === 0 && (
                                <p className="text-gray-600">
                                    No transportation information available
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <MapPin className="h-6 w-6 text-primary" />
                        <div>
                            <h3 className="font-semibold">Hotel Address</h3>
                            <p className="text-gray-600">
                                {hotel.address}, {hotel.city.name},{" "}
                                {hotel.city.countryName}
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Interactive Map View</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
