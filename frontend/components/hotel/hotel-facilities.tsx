"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Wifi,
    Car,
    Waves,
    Dumbbell,
    Coffee,
    Utensils,
    SpadeIcon as Spa,
    Shield,
    Clock,
    Users,
    Briefcase,
    Baby,
    Star,
} from "lucide-react";
import { useGetHotelQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Facility } from "@/lib/types/hotel";

interface HotelFacilitiesProps {
    hotelId: string;
}

const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
        case "wifi":
            return Wifi;
        case "car":
            return Car;
        case "pool":
            return Waves;
        case "gym":
            return Dumbbell;
        case "coffee":
            return Coffee;
        case "restaurant":
            return Utensils;
        case "spa":
            return Spa;
        case "security":
            return Shield;
        case "24h":
            return Clock;
        case "concierge":
            return Users;
        case "business":
            return Briefcase;
        case "family":
            return Baby;
        default:
            return Star;
    }
};

export function HotelFacilities({ hotelId }: HotelFacilitiesProps) {
    const { data: response, isLoading, error } = useGetHotelQuery(hotelId);

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !response.data) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {response?.errors?.detail ||
                        "Failed to load hotel facilities"}
                </AlertDescription>
            </Alert>
        );
    }

    const hotel = response.data;
    const facilities = hotel.facilities.reduce<Record<string, Facility[]>>(
        (acc, facility) => {
            const category = facility.category || "Other";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(facility);
            return acc;
        },
        {}
    );

    if (Object.keys(facilities).length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">
                        Hotel Facilities
                    </h2>
                    <p className="text-gray-600">
                        No facilities information available
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Hotel Facilities</h2>
                <p className="text-gray-600">
                    Enjoy our comprehensive range of amenities and services
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(facilities).map(([category, items]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {items.map((item) => {
                                    const Icon = getIcon(item.icon || "");
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3"
                                        >
                                            <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span className="text-sm">
                                                {item.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Shield className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold mb-2">
                                Health & Safety
                            </h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Your safety is our priority. We follow enhanced
                                cleaning protocols and safety measures.
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Enhanced cleaning and disinfection</li>
                                <li>
                                    • Contactless check-in/check-out available
                                </li>
                                <li>
                                    • Hand sanitizer stations throughout hotel
                                </li>
                                <li>• Staff health monitoring and training</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
