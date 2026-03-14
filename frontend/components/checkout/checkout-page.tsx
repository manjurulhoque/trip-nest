"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { BookingSummary } from "@/components/checkout/booking-summary";
import { BookingConfirmation } from "@/components/checkout/booking-confirmation";
import { CheckoutDatesGuests } from "@/components/checkout/checkout-dates-guests";
import { getDefaultCheckoutDates } from "@/lib/types/checkout";
import type { CheckoutParams } from "@/lib/types/checkout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type ConfirmedBooking = {
    id: string;
    bookingReference: string;
    totalAmount: number;
    currency: string;
};

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const [confirmedBooking, setConfirmedBooking] =
        useState<ConfirmedBooking | null>(null);

    const params = useMemo(() => {
        const defaults = getDefaultCheckoutDates();
        const hotelId = searchParams.get("hotelId") ?? undefined;
        const roomId = searchParams.get("roomId") ?? undefined;
        const checkIn = searchParams.get("checkIn") ?? defaults.checkIn;
        const checkOut = searchParams.get("checkOut") ?? defaults.checkOut;
        const adults = Math.max(
            1,
            parseInt(searchParams.get("adults") ?? "1", 10) || 1
        );
        const children = Math.max(
            0,
            parseInt(searchParams.get("children") ?? "0", 10) || 0
        );
        return {
            hotelId,
            roomId,
            checkIn,
            checkOut,
            adults,
            children,
        };
    }, [searchParams]);

    const hasRequiredParams = Boolean(params.hotelId && params.roomId);
    const router = useRouter();

    const handleDatesGuestsChange = useCallback(
        (updates: Partial<CheckoutParams>) => {
            const next = new URLSearchParams(searchParams.toString());
            if (updates.checkIn != null) next.set("checkIn", updates.checkIn);
            if (updates.checkOut != null)
                next.set("checkOut", updates.checkOut);
            if (updates.adults != null)
                next.set("adults", String(updates.adults));
            if (updates.children != null)
                next.set("children", String(updates.children));
            router.replace(`/checkout?${next.toString()}`, { scroll: false });
        },
        [router, searchParams]
    );

    const handleBookingCreated = (
        bookingId: string,
        reference: string,
        totalAmount?: number,
        currency?: string
    ) => {
        setConfirmedBooking({
            id: bookingId,
            bookingReference: reference,
            totalAmount: totalAmount ?? 0,
            currency: currency ?? "USD",
        });
    };

    if (!hasRequiredParams) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">
                        Complete your booking
                    </h1>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Missing hotel or room selection. Please choose a
                            room from a hotel page to continue.
                        </AlertDescription>
                    </Alert>
                    <div className="mt-6 flex gap-4">
                        <Button asChild>
                            <Link href="/search">Search hotels</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (confirmedBooking) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <BookingConfirmation
                        bookingReference={confirmedBooking.bookingReference}
                        bookingId={confirmedBooking.id}
                        totalAmount={confirmedBooking.totalAmount}
                        currency={confirmedBooking.currency}
                    />
                </div>
            </div>
        );
    }

    const checkoutParams = {
        hotelId: params.hotelId!,
        roomId: params.roomId!,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
        children: params.children,
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Complete your booking
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <CheckoutDatesGuests
                            params={checkoutParams}
                            onParamsChange={handleDatesGuestsChange}
                        />
                        <CheckoutForm
                            params={checkoutParams}
                            onBookingCreated={(
                                id,
                                ref,
                                total?,
                                currency?
                            ) =>
                                handleBookingCreated(id, ref, total, currency)
                            }
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <BookingSummary params={checkoutParams} />
                    </div>
                </div>
            </div>
        </div>
    );
}
