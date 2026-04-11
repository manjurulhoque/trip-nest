"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { WishlistToggleButton } from "@/components/wishlist/wishlist-toggle-button";
import { useGetSimilarHotelsQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Hotel } from "@/lib/types";

function getHotelImageUrl(hotelId: string) {
    return `https://picsum.photos/seed/hotel-${encodeURIComponent(
        hotelId
    )}/800/480?blur=1`;
}

interface SimilarHotelsNearbyProps {
    hotelId: string;
}

export function SimilarHotelsNearby({ hotelId }: SimilarHotelsNearbyProps) {
    const { data: response, isLoading, error } = useGetSimilarHotelsQuery(hotelId);

    if (isLoading) {
        return (
            <section aria-label="Similar hotels nearby" className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                    Similar Hotels Nearby
                </h2>
                <CenterLoader />
            </section>
        );
    }

    if (error || !response?.success || !response.data) {
        return null;
    }

    const hotels = response.data;
    if (hotels.length === 0) {
        return null;
    }

    return (
        <section aria-label="Similar hotels nearby" className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Hotels Nearby</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {hotels.map((hotel: Hotel) => {
                    const imageUrl = getHotelImageUrl(hotel.id);
                    const location = hotel.city
                        ? `${hotel.city.name}${hotel.city.countryName ? `, ${hotel.city.countryName}` : ""}`
                        : hotel.address || "—";
                    const rawPrice = hotel.startingPrice;
                    const hasPrice =
                        rawPrice !== null && rawPrice !== undefined;
                    const displayPrice = hasPrice ? Number(rawPrice) : null;
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
                                    <WishlistToggleButton
                                        hotelId={hotel.id}
                                        className="absolute top-2 right-2 z-10"
                                        stopPropagation
                                    />
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
                                                    $
                                                    {displayPrice.toFixed(0)}
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
        </section>
    );
}
