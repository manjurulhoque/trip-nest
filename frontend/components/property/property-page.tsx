"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyDetails } from "@/components/property/property-details";
import { PropertyBooking } from "@/components/property/property-booking";
import { PropertyReviews } from "@/components/property/property-reviews";
import { HostInfo } from "@/components/host/host-info";
import CenterLoader from "@/components/loaders/center-loader";

interface PropertyPageProps {
    propertyId: string;
}

export default function PropertyPage({ propertyId }: PropertyPageProps) {
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
                <PropertyGallery />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2 space-y-8">
                        <PropertyDetails />
                        <HostInfo />
                        <PropertyReviews />
                    </div>
                    <div className="lg:col-span-1">
                        <PropertyBooking />
                    </div>
                </div>
            </main>
        </div>
    );
}
