"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { useGetHotelsQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecentHotels() {

    const getHotelImageUrl = (hotelId: string) => {
        return `https://picsum.photos/seed/hotel-${encodeURIComponent(
            hotelId
        )}/800/480?blur=1`;
    };

    const { data: response, isLoading, error } = useGetHotelsQuery({
        page: 1,
    });

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Explore Hotels
                    </h2>
                    <CenterLoader />
                </div>
            </section>
        );
    }

    if (error || !response?.success || !response.data) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Explore Hotels
                    </h2>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Failed to load hotels. Please try again later.
                        </AlertDescription>
                    </Alert>
                </div>
            </section>
        );
    }

    const hotels = response.data?.results ?? [];
    const displayHotels = hotels.slice(0, 3);

    if (displayHotels.length === 0) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Explore Hotels
                    </h2>
                    <p className="text-center text-gray-600">
                        No hotels available yet. Check back soon!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Explore Hotels
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayHotels.map((hotel) => {
                        const imageUrl = hotel.images?.[0]?.url || hotel.mainPhoto;
                        const location = hotel.city
                            ? `${hotel.city.name}${
                                  hotel.city.countryName
                                      ? `, ${hotel.city.countryName}`
                                      : ""
                              }`
                            : hotel.address || "—";
                        const rating = hotel.rating ?? 0;
                        const rawPrice = hotel.startingPrice ?? 0;
                        const hasPrice = rawPrice !== null && rawPrice !== undefined;
                        const displayPrice = hasPrice
                            ? Number(rawPrice)
                            : null;
                        const typeName = hotel.hotelType?.name ?? "Hotel";

                        return (
                            <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <img
                                        src={getHotelImageUrl(hotel.id)}
                                        alt={hotel.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary">
                                                {typeName}
                                            </Badge>
                                            <span className="text-xs text-gray-500 flex items-center">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                                                {rating.toFixed(1)}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg">
                                            {hotel.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm mb-4 flex items-center">
                                            <MapPin className="h-3 w-3 mr-1 shrink-0" />
                                            {location}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            {hasPrice && displayPrice !== null ? (
                                                <>
                                                    <span className="text-xs text-gray-500">
                                                        From
                                                    </span>
                                                    <span className="text-lg font-bold">
                                                        ${displayPrice.toFixed(0)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        per night
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-500">
                                                    See room prices
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
                <div className="text-center mt-8">
                    <Button asChild variant="outline" size="lg">
                        <Link href="/search">View all hotels</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
