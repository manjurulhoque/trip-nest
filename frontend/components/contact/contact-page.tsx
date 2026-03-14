"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/contact/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";

export default function ContactPage() {
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
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-600">
                        We're here to help with any questions or concerns
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">
                            Get in touch
                        </h2>
                        <ContactForm />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-6">
                            Contact Information
                        </h2>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <MapPin className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-2">
                                            Address
                                        </h3>
                                        <p className="text-gray-600">
                                            123 Travel Street
                                            <br />
                                            Suite 100
                                            <br />
                                            San Francisco, CA 94105
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <Phone className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-2">
                                            Phone
                                        </h3>
                                        <p className="text-gray-600">
                                            +1 (555) 123-4567
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            24/7 Customer Support
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <Mail className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-2">
                                            Email
                                        </h3>
                                        <p className="text-gray-600">
                                            support@travelnest.com
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            We'll respond within 24 hours
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <Clock className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-2">
                                            Business Hours
                                        </h3>
                                        <div className="text-gray-600 space-y-1">
                                            <p>
                                                Monday - Friday: 9:00 AM - 6:00
                                                PM PST
                                            </p>
                                            <p>
                                                Saturday: 10:00 AM - 4:00 PM PST
                                            </p>
                                            <p>Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
