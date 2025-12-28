"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
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
            <main className="container mx-auto px-4 py-6">
                <HotelGallery hotelId={hotelId} />
                <div className="mt-8 space-y-12">
                    <HotelDetails hotelId={hotelId} />
                    <HotelRooms hotelId={hotelId} />
                    <HotelFacilities hotelId={hotelId} />
                    <HotelLocation hotelId={hotelId} />
                    <HotelReviews hotelId={hotelId} />
                </div>
            </main>
        </div>
    );
}
