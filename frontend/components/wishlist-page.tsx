"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { WishlistContent } from "@/components/wishlist-content";
import CenterLoader from "@/components/loaders/center-loader";

export default function WishlistPage() {
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Your Wishlist</h1>
                    <p className="text-gray-600">
                        Save your favorite hotels for later
                    </p>
                </div>
                <WishlistContent />
            </div>
        </div>
    );
}
