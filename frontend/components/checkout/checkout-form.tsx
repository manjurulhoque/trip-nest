"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Phone } from "lucide-react";
import { useCreateBookingMutation } from "@/store/api/bookingApi";
import type { CheckoutParams } from "@/lib/types/checkout";
import type { GuestDetails } from "@/lib/types/booking";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CheckoutFormProps {
    params: CheckoutParams;
    onBookingCreated?: (
        bookingId: string,
        reference: string,
        totalAmount?: number,
        currency?: string
    ) => void;
}

export function CheckoutForm({ params, onBookingCreated }: CheckoutFormProps) {
    const { data: session, status: sessionStatus } = useSession();
    const [createBooking, { isLoading, error: apiError }] =
        useCreateBookingMutation();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialRequests: "",
        agreeTerms: false,
    });

    const hydratedFromSession = useRef(false);
    useEffect(() => {
        if (
            hydratedFromSession.current ||
            sessionStatus !== "authenticated" ||
            !session?.user
        ) {
            return;
        }
        hydratedFromSession.current = true;
        const u = session.user;
        setFormData((prev) => ({
            ...prev,
            firstName: u.firstName ?? "",
            lastName: u.lastName ?? "",
            email: u.email ?? "",
        }));
    }, [sessionStatus, session?.user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!params.hotelId || !params.roomId || !formData.agreeTerms) return;

        const guestDetails: Omit<GuestDetails, "id" | "booking">[] = [
            {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                isPrimary: true,
            },
        ];

        try {
            const result = await createBooking({
                hotelId: params.hotelId,
                roomId: params.roomId,
                checkInDate: params.checkIn,
                checkOutDate: params.checkOut,
                guestsCount: params.adults + params.children,
                adultsCount: params.adults,
                childrenCount: params.children,
                specialRequests: formData.specialRequests || undefined,
                guestDetails,
            }).unwrap();

            if (result?.success && result?.data) {
                const b = result.data;
                onBookingCreated?.(
                    b.id,
                    b.bookingReference,
                    typeof b.totalAmount === "number" ? b.totalAmount : undefined,
                    b.currency
                );
            }
        } catch {
            // Error handled by apiError
        }
    };

    if (sessionStatus === "loading") {
        return (
            <Card>
                <CardContent className="p-6">Loading...</CardContent>
            </Card>
        );
    }

    if (sessionStatus === "unauthenticated") {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Please sign in to complete your booking. You will be
                    redirected to the login page.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {typeof apiError === "object" &&
                        apiError !== null &&
                        "data" in apiError
                            ? (() => {
                                  const d = (apiError as { data?: { errors?: Record<string, unknown> } })
                                      .data?.errors;
                                  if (d && typeof d === "object") {
                                      const msg = d.detail ?? d.message;
                                      if (typeof msg === "string") return msg;
                                      const arr = Object.values(d).flat();
                                      if (arr.length) return arr.map(String).join(", ");
                                  }
                                  return "Failed to create booking. Please try again.";
                              })()
                            : "Failed to create booking. Please try again."}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Guest Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        firstName: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        lastName: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))
                                }
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        phone: e.target.value,
                                    }))
                                }
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specialRequests">
                            Special Requests (Optional)
                        </Label>
                        <textarea
                            id="specialRequests"
                            placeholder="Any special requests or preferences..."
                            value={formData.specialRequests}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    specialRequests: e.target.value,
                                }))
                            }
                            className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="terms"
                                checked={formData.agreeTerms}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        agreeTerms: !!checked,
                                    }))
                                }
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm text-muted-foreground leading-relaxed"
                            >
                                I agree to the{" "}
                                <Link
                                    href="/terms"
                                    className="text-primary underline-offset-4 hover:underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Terms and Conditions
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy"
                                    className="text-primary underline-offset-4 hover:underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading || !formData.agreeTerms}
                    >
                        {isLoading ? "Creating booking…" : "Reserve"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                        You will complete payment on the next screen. Your
                        reservation is held temporarily.
                    </p>
                </CardContent>
            </Card>
        </form>
    );
}
