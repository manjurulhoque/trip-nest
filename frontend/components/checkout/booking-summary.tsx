"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Star } from "lucide-react";
import { useGetHotelQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CheckoutParams } from "@/lib/types/checkout";
import type { Hotel, HotelRoom } from "@/lib/types/hotel";

interface BookingSummaryProps {
    params: CheckoutParams;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function BookingSummary({ params }: BookingSummaryProps) {
    const { hotelId, roomId, checkIn, checkOut, adults, children } = params;
    const { data: response, isLoading, error } = useGetHotelQuery(hotelId!, {
        skip: !hotelId,
    });

    if (!hotelId || !roomId) {
        return (
            <Card className="sticky top-4">
                <CardContent className="p-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Missing hotel or room. Please select a room from a
                            hotel page.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="sticky top-4">
                <CardContent className="p-6">
                    <CenterLoader />
                </CardContent>
            </Card>
        );
    }

    if (error || !response?.success || !response.data) {
        return (
            <Card className="sticky top-4">
                <CardContent className="p-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Failed to load booking details
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const hotel = response.data as Hotel;
    const room = (hotel.rooms ?? []).find(
        (r: HotelRoom & { id: string }) => r.id === roomId
    );
    if (!room) {
        return (
            <Card className="sticky top-4">
                <CardContent className="p-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Room not found in this hotel
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const nights = Math.max(
        1,
        Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                (1000 * 60 * 60 * 24)
        )
    );
    const pricePerNight = Number(room.price ?? 0);
    const roomTotal = pricePerNight * nights;
    const taxes = Math.round(roomTotal * 0.12 * 100) / 100;
    const serviceFee = Math.round(roomTotal * 0.05 * 100) / 100;
    const total = roomTotal + taxes + serviceFee;
    const location =
        hotel.city?.name && hotel.address
            ? `${hotel.address}, ${hotel.city.name}`
            : hotel.address ?? "—";

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <img
                            src={
                                hotel.mainPhoto ??
                                hotel.thumbnail ??
                                "/placeholder.svg?height=80&width=120"
                            }
                            alt={hotel.name}
                            className="w-20 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm">
                                {hotel.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {room.name}
                            </p>
                            <div className="flex items-center mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="text-xs">
                                    {hotel.rating != null
                                        ? `${Number(hotel.rating).toFixed(1)}`
                                        : "—"}{" "}
                                    ({hotel.reviewsCount ?? 0} reviews)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4 mr-1 shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                            Check-in
                        </div>
                        <span className="text-sm font-medium">
                            {formatDate(checkIn)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                            Check-out
                        </div>
                        <span className="text-sm font-medium">
                            {formatDate(checkOut)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                            Guests
                        </div>
                        <span className="text-sm font-medium">
                            {adults} adult{adults !== 1 ? "s" : ""}
                            {children > 0 ? `, ${children} children` : ""}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm">Duration</span>
                        <Badge variant="secondary">{nights} nights</Badge>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h4 className="font-semibold">Price Breakdown</h4>

                    <div className="flex justify-between text-sm">
                        <span>
                            ${pricePerNight.toFixed(2)} × {nights} nights
                        </span>
                        <span>${roomTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Taxes and fees</span>
                        <span>${taxes.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>${serviceFee.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary">Free Cancellation</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Cancel for free until 24 hours before check-in.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
