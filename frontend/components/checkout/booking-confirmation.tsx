"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Copy, CreditCard } from "lucide-react";
import Link from "next/link";

interface BookingConfirmationProps {
    bookingReference: string;
    bookingId: string;
    totalAmount: number;
    currency: string;
}

export function BookingConfirmation({
    bookingReference,
    bookingId,
    totalAmount,
    currency,
}: BookingConfirmationProps) {
    const copyReference = () => {
        navigator.clipboard.writeText(bookingReference);
    };

    return (
        <div className="space-y-6 max-w-xl">
            <div className="flex flex-col items-center text-center py-8">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    Booking confirmed
                </h2>
                <p className="text-muted-foreground mb-4">
                    Your reservation has been created. Complete payment to
                    finalize.
                </p>
                <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                    <span className="text-sm font-mono font-semibold">
                        {bookingReference}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={copyReference}
                        className="shrink-0"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                            Amount due
                        </span>
                        <span className="text-xl font-semibold">
                            {currency} {totalAmount.toFixed(2)}
                        </span>
                    </div>
                    <Separator />
                    <p className="text-sm text-muted-foreground">
                        Pay at the property (cash or card) or complete payment
                        online when this option is available.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild className="flex-1">
                            <Link href="/dashboard">
                                View my bookings
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                            <Link href="/search">Book another stay</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
