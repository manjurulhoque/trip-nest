"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, MapPin, Wifi, Car, Waves } from "lucide-react";
import { useSearchHotelsQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Hotel, HotelSearchParams } from "@/lib/types/hotel";
import { useRouter } from "next/navigation";
import { hotelUrlWithTripParams } from "./search-utils";

const PAGE_SIZE = 20;

interface SearchResultsProps {
    searchParams: HotelSearchParams;
    onPageChange?: (page: number) => void;
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

export function SearchResults({
    searchParams,
    onPageChange,
}: SearchResultsProps) {
    const router = useRouter();
    const {
        data: response,
        isLoading,
        error,
    } = useSearchHotelsQuery({ ...searchParams, page: searchParams.page ?? 1 });

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

    const getHotelImageUrl = (hotelId: string) => {
        return `https://picsum.photos/seed/hotel-${encodeURIComponent(
            hotelId
        )}/800/480?blur=1`;
    };

    const rawData = response.data;
    const hotels = rawData?.results ?? [];
    const totalCount = rawData.count;
    const currentPage = searchParams.page ?? 1;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;
    const from = (currentPage - 1) * PAGE_SIZE + 1;
    const to = Math.min(currentPage * PAGE_SIZE, totalCount);

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
            {hotels.map((hotel: Hotel, index: number) => (
                <Card
                    key={`hotel-${index}-${hotel.id}`}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                    <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                            <div className="relative flex-shrink-0">
                                <img
                                    src={getHotelImageUrl(hotel.id)}
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
                                            <h3 onClick={() =>
                                                router.push(hotelUrlWithTripParams(hotel.id, searchParams))
                                            } className="text-xl font-semibold mb-1 cursor-pointer">
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
                                                    {hotel.rating?.toFixed(1)}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">
                                                    ({hotel.reviewsCount} reviews)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {hotel.bestSeller && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                Best Seller
                                            </Badge>
                                        )}
                                        {hotel.hotelType?.name && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {hotel.hotelType.name}
                                            </Badge>
                                        )}
                                    </div>

                                    {hotel.description && (
                                        <p className="text-gray-600 text-sm mb-3">
                                            {hotel.description}
                                        </p>
                                    )}

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
                                            {(() => {
                                                const rawPrice = hotel.startingPrice ?? null;
                                                const hasPrice =
                                                    rawPrice !== null &&
                                                    rawPrice !== undefined;
                                                const displayPrice = hasPrice
                                                    ? Number(rawPrice)
                                                    : null;
                                                if (!hasPrice || displayPrice === null) {
                                                    return (
                                                        <span className="text-sm text-gray-500">
                                                            See room prices
                                                        </span>
                                                    );
                                                }
                                                return (
                                                    <>
                                                        <span className="text-xs text-gray-500">
                                                            From
                                                        </span>
                                                        <span className="text-2xl font-bold">
                                                            ${displayPrice.toFixed(0)}
                                                        </span>
                                                        <span className="text-gray-600">
                                                            per night
                                                        </span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            router.push(hotelUrlWithTripParams(hotel.id, searchParams))
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

            {totalCount > PAGE_SIZE && onPageChange && (
                <div className="flex items-center justify-between border-t pt-6 mt-6">
                    <p className="text-sm text-muted-foreground">
                        Showing {from}–{to} of {totalCount} results
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={!hasPrev}
                        >
                            Previous
                        </Button>
                        <span className="text-sm px-3">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={!hasNext}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
