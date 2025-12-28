"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import CenterLoader from "@/components/loaders/center-loader";

export default function PrivacyPage() {
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
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Last updated: December 21, 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="mb-4">
                            We collect information you provide directly to us,
                            such as when you create an account, make a booking,
                            or contact us for support.
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>
                                Personal information (name, email, phone number)
                            </li>
                            <li>
                                Payment information (credit card details,
                                billing address)
                            </li>
                            <li>Travel preferences and booking history</li>
                            <li>Communication records</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Process your bookings and payments</li>
                            <li>Provide customer support</li>
                            <li>Send booking confirmations and updates</li>
                            <li>Improve our services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            3. Information Sharing
                        </h2>
                        <p className="mb-4">
                            We may share your information with hotels, payment
                            processors, and other service providers necessary to
                            complete your booking. We do not sell your personal
                            information to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            4. Data Security
                        </h2>
                        <p className="mb-4">
                            We implement appropriate security measures to
                            protect your personal information against
                            unauthorized access, alteration, disclosure, or
                            destruction.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            5. Your Rights
                        </h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate information</li>
                            <li>Delete your account and data</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            6. Contact Us
                        </h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy,
                            please contact us at:
                        </p>
                        <p className="mb-2">Email: privacy@travelnest.com</p>
                        <p className="mb-2">Phone: +1 (555) 123-4567</p>
                        <p>
                            Address: 123 Travel Street, Suite 100, San
                            Francisco, CA 94105
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
