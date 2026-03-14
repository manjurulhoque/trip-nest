"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetFeaturedHotelsQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function FeaturedListings() {
    const { data: response, isLoading, error } = useGetFeaturedHotelsQuery();

    // Stable but varied imagery per hotel: same hotelId → same photo
    const getHotelImageUrl = (hotelId: string) => {
        return `https://picsum.photos/seed/hotel-${encodeURIComponent(
            hotelId
        )}/800/480?blur=1`;
    };

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Featured Hotels
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
                        Featured Hotels
                    </h2>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {response?.errors?.detail ||
                                "Failed to load featured hotels"}
                        </AlertDescription>
                    </Alert>
                </div>
            </section>
        );
    }

    const hotels = response.data;
    const displayHotels = hotels.length > 0 ? hotels.slice(0, 4) : [];

    if (displayHotels.length === 0) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Featured Hotels
                    </h2>
                    <p className="text-center text-gray-600">
                        No featured hotels at the moment. Check back soon!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Featured Hotels
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayHotels.map((hotel) => {
                        const imageUrl = getHotelImageUrl(hotel.id);
                        const location = hotel.city
                            ? `${hotel.city.name}${hotel.city.countryName
                                ? `, ${hotel.city.countryName}`
                                : ""
                            }`
                            : hotel.address || "—";
                        const rawPrice = hotel.startingPrice;
                        const hasPrice = rawPrice !== null && rawPrice !== undefined;
                        const displayPrice = hasPrice
                            ? Number(rawPrice)
                            : null;
                        const rating = hotel.rating ?? 0;
                        const reviews = hotel.reviewsCount ?? 0;
                        const badge = hotel.bestSeller ? "Superhost" : "Popular";

                        return (
                            <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                                    <div className="relative">
                                        <img
                                            src={imageUrl}
                                            alt={hotel.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                        <Badge className="absolute top-2 left-2 bg-white text-black">
                                            {badge}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-lg truncate">
                                                {hotel.name}
                                            </h3>
                                            <div className="flex items-center shrink-0">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm ml-1">
                                                    {rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {location}
                                        </p>
                                        <p className="text-sm text-gray-500 mb-3">
                                            {reviews} reviews
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
            </div>
        </section>
    );
}
