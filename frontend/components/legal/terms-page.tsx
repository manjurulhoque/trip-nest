"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import CenterLoader from "@/components/loaders/center-loader";

export default function TermsPage() {
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
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto prose prose-gray">
                    <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Last updated: December 21, 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Agreement</h2>
                        <p className="mb-4">
                            By using TripNest to search, book, or list accommodations,
                            you agree to these terms and our{" "}
                            <Link href="/privacy" className="text-violet-600 hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Bookings</h2>
                        <p className="mb-4">
                            Bookings are between you and the property or host. Rates,
                            cancellation rules, and house rules shown at checkout
                            apply to your stay.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Contact</h2>
                        <p className="mb-2">
                            Questions about these terms:{" "}
                            <a
                                href="mailto:support@tripnest.com"
                                className="text-violet-600 hover:underline"
                            >
                                support@tripnest.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
