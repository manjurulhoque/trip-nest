"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetFeaturedHotelsQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WishlistToggleButton } from "@/components/wishlist/wishlist-toggle-button";

function getHotelImageUrl(hotelId: string) {
    return `https://picsum.photos/seed/hotel-${encodeURIComponent(hotelId)}/600/720`;
}

export function HomePopularRooms() {
    const { data: response, isLoading, error } = useGetFeaturedHotelsQuery();

    if (isLoading) {
        return (
            <section id="popular-rooms" className="py-16 md:py-24 bg-slate-50 scroll-mt-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center uppercase mb-12">
                        Find most <span className="text-primary">popular</span> rooms
                    </h2>
                    <CenterLoader />
                </div>
            </section>
        );
    }

    if (error || !response?.success || !response.data?.length) {
        return (
            <section id="popular-rooms" className="py-16 md:py-24 bg-slate-50 scroll-mt-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center uppercase mb-12">
                        Find most <span className="text-primary">popular</span> rooms
                    </h2>
                    <Alert variant="destructive" className="max-w-lg mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {response?.errors?.detail ?? "Could not load rooms. Try search to browse all stays."}
                        </AlertDescription>
                    </Alert>
                </div>
            </section>
        );
    }

    const rooms = response.data.slice(0, 3);

    return (
        <section id="popular-rooms" className="py-16 md:py-24 bg-slate-50 scroll-mt-20">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl md:text-3xl font-bold uppercase tracking-tight text-slate-800 mb-12 md:mb-16">
                    Find most{" "}
                    <span className="relative inline-block px-2">
                        <span
                            className="absolute inset-0 rounded-full border-2 border-primary -rotate-1"
                            aria-hidden
                        />
                        <span className="relative text-primary">popular</span>
                    </span>{" "}
                    rooms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {rooms.map((hotel, index) => {
                        const rawPrice = hotel.startingPrice;
                        const hasPrice = rawPrice !== null && rawPrice !== undefined;
                        const displayPrice = hasPrice ? Number(rawPrice) : null;
                        const highlighted = index === 1;

                        return (
                            <Card
                                key={hotel.id}
                                className="overflow-hidden border-0 shadow-lg rounded-2xl bg-white group"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <Link href={`/hotels/${hotel.id}`} className="block h-full w-full">
                                        <img
                                            src={getHotelImageUrl(hotel.id)}
                                            alt={hotel.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </Link>
                                    <WishlistToggleButton
                                        hotelId={hotel.id}
                                        className="absolute top-4 left-4 z-10"
                                    />
                                    {hasPrice && displayPrice !== null && (
                                        <div className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-slate-900 shadow pointer-events-none">
                                            ${displayPrice}
                                            <span className="font-normal text-slate-600"> / night</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 text-center space-y-4">
                                    <h3 className="font-semibold text-lg text-slate-900 line-clamp-2">
                                        {hotel.name}
                                    </h3>
                                    <Button
                                        className={cn(
                                            "w-full rounded-full uppercase font-semibold tracking-wide",
                                            highlighted
                                                ? "bg-primary hover:bg-primary/90"
                                                : "bg-slate-800 hover:bg-slate-900"
                                        )}
                                        asChild
                                    >
                                        <Link href={`/hotels/${hotel.id}`}>Book room</Link>
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
