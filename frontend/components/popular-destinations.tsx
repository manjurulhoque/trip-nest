"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPopularDestinationsQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function PopularDestinations() {
    const { data: response, isLoading, error } =
        useGetPopularDestinationsQuery();

    if (isLoading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Popular Destinations
                    </h2>
                    <CenterLoader />
                </div>
            </section>
        );
    }

    if (error || !response?.success || !response.data) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Popular Destinations
                    </h2>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {response?.errors?.detail ||
                                "Failed to load popular destinations"}
                        </AlertDescription>
                    </Alert>
                </div>
            </section>
        );
    }

    const destinations = response.data;
    const displayDestinations =
        destinations.length > 0 ? destinations.slice(0, 6) : [];

    if (displayDestinations.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Popular Destinations
                    </h2>
                    <p className="text-center text-gray-600">
                        No destinations with hotels yet. Check back soon!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Popular Destinations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayDestinations.map((dest) => (
                        <Link
                            key={dest.cityId}
                            href={`/search?city=${encodeURIComponent(dest.cityName)}`}
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <div className="relative">
                                    <img
                                        src="/placeholder.svg?height=200&width=300"
                                        alt={dest.cityName}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30" />
                                    <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="text-xl font-bold">
                                            {dest.cityName}
                                        </h3>
                                        <p className="text-sm opacity-90">
                                            {dest.cityCountryName || "—"}
                                        </p>
                                        <p className="text-sm opacity-75">
                                            {dest.hotelCount} propert
                                            {dest.hotelCount === 1 ? "y" : "ies"}
                                        </p>
                                    </CardContent>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
