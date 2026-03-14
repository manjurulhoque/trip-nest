"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { HotelGallery } from "@/components/hotel/hotel-gallery";
import { HotelDetails } from "@/components/hotel/hotel-details";
import { HotelRooms } from "@/components/hotel/hotel-rooms";
import { HotelFacilities } from "@/components/hotel/hotel-facilities";
import { HotelReviews } from "@/components/hotel/hotel-reviews";
import { HotelLocation } from "@/components/hotel/hotel-location";
import CenterLoader from "@/components/loaders/center-loader";

interface HotelDetailPageProps {
    hotelId: string;
}

export default function HotelDetailPage({ hotelId }: HotelDetailPageProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <CenterLoader />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <section
                    aria-label="Hotel overview"
                    className="relative rounded-3xl border border-border/60 bg-gradient-to-b from-background/60 via-background to-background/80 shadow-sm shadow-primary/5 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
                >
                    <div className="pointer-events-none absolute inset-x-12 -top-24 -z-10 h-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-10">
                        <div className="lg:col-span-3 min-w-0">
                            <HotelGallery hotelId={hotelId} />
                        </div>
                        <div className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
                            <HotelDetails hotelId={hotelId} />
                        </div>
                    </div>
                </section>

                <section
                    aria-label="Rooms, facilities, location and reviews"
                    className="mt-10 space-y-12"
                >
                    <HotelRooms hotelId={hotelId} />
                    <HotelFacilities hotelId={hotelId} />
                    <HotelLocation hotelId={hotelId} />
                    <HotelReviews hotelId={hotelId} />
                </section>
            </main>
        </div>
    );
}
