"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { CheckoutForm } from "@/components/checkout-form";
import { BookingSummary } from "@/components/booking-summary";
import CenterLoader from "@/components/loaders/center-loader";

export default function CheckoutPage() {
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
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Complete your booking
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <CheckoutForm />
                    </div>
                    <div className="lg:col-span-1">
                        <BookingSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}
