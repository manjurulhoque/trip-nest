"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Calendar, CreditCard, Heart, MapPin, Star, Users, AlertCircle, Mail, Phone } from "lucide-react";
import {
    useGetBookingsQuery,
    useCancelBookingMutation,
    useCompletePaymentMutation,
} from "@/store/api/bookingApi";
import { useGetWishlistQuery } from "@/store/api/wishlistApi";
import { useAuth } from "@/hooks/useAuth";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Booking } from "@/lib/types/booking";
import {
    formatBookingDate,
    getBookingHotelImage,
    getBookingHotelLocation,
    getBookingHotelName,
    getBookingOwnerContact,
    getBookingPaymentBadgeVariant,
    getBookingStatusBadgeVariant,
} from "@/lib/utils/booking-utils";

function BookingCard({
    booking,
    onCancel,
    isCancelling,
    onCompletePayment,
    isCompletingPayment,
}: {
    booking: Booking;
    onCancel: (id: string) => void;
    isCancelling: boolean;
    onCompletePayment: (id: string) => void;
    isCompletingPayment: boolean;
}) {
    const hotelName = getBookingHotelName(booking);
    const location = getBookingHotelLocation(booking);
    const imageUrl = getBookingHotelImage(booking) ?? "/placeholder.svg?height=100&width=150";
    const ownerContact = getBookingOwnerContact(booking);
    const isCancelled = booking.status === "cancelled";
    const canCancel =
        !isCancelled &&
        ["pending", "confirmed"].includes(booking.status) &&
        new Date(booking.checkOutDate) >= new Date();
    const paymentStatus = booking.paymentStatus ?? "pending";
    const canCompletePayment =
        !isCancelled &&
        paymentStatus !== "paid" &&
        new Date(booking.checkOutDate) >= new Date();

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <img
                        src={imageUrl}
                        alt=""
                        className="w-full sm:w-32 h-40 sm:h-24 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    {hotelName}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                    <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                                    {location}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                    <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                                    {formatBookingDate(booking.checkInDate)} –{" "}
                                    {formatBookingDate(booking.checkOutDate)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                    <Users className="h-4 w-4 shrink-0" aria-hidden />
                                    {booking.guestsCount} guest
                                    {booking.guestsCount !== 1 ? "s" : ""}
                                </p>
                                {ownerContact && (
                                    <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                        <p className="font-medium text-foreground">{ownerContact.name}</p>
                                        {ownerContact.email && (
                                            <p className="flex items-center gap-1">
                                                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                                                <a
                                                    href={`mailto:${ownerContact.email}`}
                                                    className="hover:underline"
                                                >
                                                    {ownerContact.email}
                                                </a>
                                            </p>
                                        )}
                                        {ownerContact.phone && (
                                            <p className="flex items-center gap-1">
                                                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                                                <a
                                                    href={`tel:${ownerContact.phone}`}
                                                    className="hover:underline"
                                                >
                                                    {ownerContact.phone}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                                <Badge
                                    variant={getBookingStatusBadgeVariant(booking.status)}
                                    className="capitalize"
                                >
                                    {booking.status.replace("_", " ")}
                                </Badge>
                                <Badge
                                    variant={getBookingPaymentBadgeVariant(paymentStatus)}
                                    className="capitalize mt-1"
                                >
                                    Payment: {paymentStatus.replace("_", " ")}
                                </Badge>
                                <p className="text-lg font-bold mt-2 text-foreground">
                                    {booking.currency}{" "}
                                    {Number(booking.totalAmount).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Ref: {booking.bookingReference}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {typeof booking.hotel === "object" &&
                                booking.hotel !== null &&
                                "id" in booking.hotel && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="min-h-[44px] min-w-[44px]"
                                        asChild
                                    >
                                        <Link
                                            href={`/hotels/${(booking.hotel as { id: string }).id}`}
                                        >
                                            View property
                                        </Link>
                                    </Button>
                                )}
                            {canCompletePayment && (
                                <Button
                                    size="sm"
                                    className="min-h-[44px]"
                                    onClick={() => onCompletePayment(booking.id)}
                                    disabled={isCompletingPayment}
                                    aria-label={`Complete payment for booking ${booking.bookingReference}`}
                                >
                                    <CreditCard className="h-4 w-4 mr-2 shrink-0" aria-hidden />
                                    {isCompletingPayment ? "Processing…" : "Complete payment"}
                                </Button>
                            )}
                            {canCancel && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="min-h-[44px] text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => onCancel(booking.id)}
                                    disabled={isCancelling}
                                    aria-label={`Cancel booking ${booking.bookingReference}`}
                                >
                                    {isCancelling ? "Cancelling…" : "Cancel booking"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function DashboardContent() {
    const { user } = useAuth();
    const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

    const { data: bookingsResponse, isLoading, isError } = useGetBookingsQuery(
        { page: 1 },
        { skip: !user }
    );
    const { data: wishlistResponse, isLoading: wishlistLoading } = useGetWishlistQuery(undefined, { skip: !user });
    const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
    const [completePayment, { isLoading: isCompletingPayment }] = useCompletePaymentMutation();

    const rawResults = bookingsResponse?.data?.results ?? [];
    const bookings = Array.isArray(rawResults) ? rawResults : [];
    const savedHotels = wishlistResponse?.data ?? [];

    const { upcoming, past } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const up: Booking[] = [];
        const pa: Booking[] = [];
        for (const b of bookings) {
            const out = new Date(b.checkOutDate);
            out.setHours(0, 0, 0, 0);
            if (b.status === "cancelled" || out < today) {
                pa.push(b);
            } else {
                up.push(b);
            }
        }
        up.sort(
            (a, b) =>
                new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
        );
        pa.sort(
            (a, b) =>
                new Date(b.checkOutDate).getTime() - new Date(a.checkOutDate).getTime()
        );
        return { upcoming: up, past: pa };
    }, [bookings]);

    const handleConfirmCancel = async () => {
        if (!cancelTargetId) return;
        try {
            await cancelBooking({ id: cancelTargetId }).unwrap();
            setCancelTargetId(null);
        } catch {
            // Error handled by mutation / toast if needed
        }
    };

    const handleCompletePayment = (bookingId: string) => {
        completePayment({ id: bookingId }).unwrap().catch(() => {
            // Error handled by mutation / toast if needed
        });
    };

    const firstName = user?.firstName ?? user?.username ?? "there";

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome back, {firstName}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your trips and discover new places
                    </p>
                </div>
                <CenterLoader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome back, {firstName}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your trips and discover new places
                    </p>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" aria-hidden />
                    <AlertDescription>
                        Failed to load bookings. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, {firstName}!
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage your trips and discover new places
                </p>
            </div>

            <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList className="w-full sm:w-auto" role="tablist" aria-label="Booking tabs">
                    <TabsTrigger value="upcoming" role="tab" aria-selected="false">
                        Upcoming ({upcoming.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" role="tab" aria-selected="false">
                        Past ({past.length})
                    </TabsTrigger>
                    <TabsTrigger value="wishlist" role="tab" aria-selected="false">
                        Wishlist
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4" role="tabpanel">
                    {upcoming.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" aria-hidden />
                                <p className="mt-4 font-medium text-foreground">
                                    No upcoming trips
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Book a stay to see it here
                                </p>
                                <Button asChild className="mt-4 min-h-[44px]">
                                    <Link href="/search">Search hotels</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        upcoming.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={setCancelTargetId}
                                isCancelling={
                                    isCancelling && cancelTargetId === booking.id
                                }
                                onCompletePayment={handleCompletePayment}
                                isCompletingPayment={isCompletingPayment}
                            />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4" role="tabpanel">
                    {past.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" aria-hidden />
                                <p className="mt-4 font-medium text-foreground">
                                    No past trips yet
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Your completed and cancelled bookings will appear here
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        past.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={setCancelTargetId}
                                isCancelling={false}
                                onCompletePayment={handleCompletePayment}
                                isCompletingPayment={false}
                            />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-4" role="tabpanel">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground">
                            Hotels you saved from search and listings
                        </p>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/wishlist">Open full wishlist</Link>
                        </Button>
                    </div>
                    {wishlistLoading ? (
                        <CenterLoader />
                    ) : savedHotels.length === 0 ? (
                        <Card>
                            <CardContent className="py-10 text-center">
                                <Heart
                                    className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3"
                                    aria-hidden
                                />
                                <p className="font-medium text-foreground">No saved hotels yet</p>
                                <p className="text-sm text-muted-foreground mt-1 mb-4">
                                    Tap the heart on any hotel to save it here
                                </p>
                                <Button asChild>
                                    <Link href="/search">Browse hotels</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedHotels.map((item) => {
                                const img =
                                    item.hotel.mainPhoto ||
                                    item.hotel.thumbnail ||
                                    "/placeholder.svg?height=100&width=150";
                                const loc = item.hotel.cityName ?? "—";
                                const rating = item.hotel.rating;
                                return (
                                    <Card key={item.id}>
                                        <CardContent className="p-4">
                                            <div className="flex gap-3">
                                                <img
                                                    src={img}
                                                    alt=""
                                                    className="w-20 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-foreground truncate">
                                                        {item.hotel.name}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                                                        {loc}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <Star
                                                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                            aria-hidden
                                                        />
                                                        <span className="text-sm">
                                                            {rating != null ? Number(rating).toFixed(1) : "—"}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            ({item.hotel.reviewsCount} reviews)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full mt-3 min-h-[44px]"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/hotels/${item.hotel.id}`}>
                                                    View hotel
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <ConfirmDialog
                open={cancelTargetId !== null}
                onOpenChange={(open) => !open && setCancelTargetId(null)}
                title="Cancel booking?"
                description={
                    <>
                        This will cancel your reservation. You may be charged a fee
                        depending on the property’s cancellation policy. This action
                        cannot be undone.
                    </>
                }
                cancelLabel="Keep booking"
                confirmLabel="Cancel booking"
                pendingLabel="Cancelling…"
                confirmVariant="destructive"
                onConfirm={handleConfirmCancel}
                isPending={isCancelling}
            />
        </div>
    );
}
