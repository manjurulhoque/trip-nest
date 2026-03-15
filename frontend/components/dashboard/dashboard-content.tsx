"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, CreditCard, MapPin, Star, Users, AlertCircle } from "lucide-react";
import {
    useGetBookingsQuery,
    useCancelBookingMutation,
    useCompletePaymentMutation,
} from "@/store/api/bookingApi";
import { useAuth } from "@/hooks/useAuth";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types/booking";

const wishlistItems = [
    {
        id: "1",
        property: "Historic Countryside Manor",
        location: "Tuscany, Italy",
        price: 380,
        rating: 4.9,
        image: "/placeholder.svg?height=100&width=150",
    },
    {
        id: "2",
        property: "Seaside Cottage",
        location: "Cornwall, UK",
        price: 220,
        rating: 4.7,
        image: "/placeholder.svg?height=100&width=150",
    },
];

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusBadgeVariant(status: BookingStatus): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "confirmed":
        case "checked_in":
            return "default";
        case "pending":
            return "secondary";
        case "cancelled":
        case "no_show":
            return "destructive";
        case "checked_out":
        default:
            return "outline";
    }
}

function getPaymentBadgeVariant(
    paymentStatus: PaymentStatus
): "default" | "secondary" | "destructive" | "outline" {
    switch (paymentStatus) {
        case "paid":
            return "default";
        case "pending":
        case "partially_paid":
            return "secondary";
        case "failed":
        case "refunded":
            return "destructive";
        default:
            return "outline";
    }
}

function getHotelName(booking: Booking): string {
    const hotel = booking.hotel;
    if (typeof hotel === "object" && hotel !== null && "name" in hotel) {
        return (hotel as { name: string }).name;
    }
    return "Hotel";
}

function getHotelLocation(booking: Booking): string {
    const hotel = booking.hotel;
    if (typeof hotel === "object" && hotel !== null && "address" in hotel) {
        return (hotel as { address?: string }).address ?? "—";
    }
    return "—";
}

function getHotelImage(booking: Booking): string | null {
    const hotel = booking.hotel;
    if (typeof hotel === "object" && hotel !== null) {
        const h = hotel as { mainPhoto?: string; thumbnail?: string };
        return h.mainPhoto ?? h.thumbnail ?? null;
    }
    return null;
}

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
    const hotelName = getHotelName(booking);
    const location = getHotelLocation(booking);
    const imageUrl = getHotelImage(booking) ?? "/placeholder.svg?height=100&width=150";
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
                                    {formatDate(booking.checkInDate)} –{" "}
                                    {formatDate(booking.checkOutDate)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                    <Users className="h-4 w-4 shrink-0" aria-hidden />
                                    {booking.guestsCount} guest
                                    {booking.guestsCount !== 1 ? "s" : ""}
                                </p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                                <Badge
                                    variant={getStatusBadgeVariant(booking.status)}
                                    className="capitalize"
                                >
                                    {booking.status.replace("_", " ")}
                                </Badge>
                                <Badge
                                    variant={getPaymentBadgeVariant(paymentStatus)}
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
                                            href={`/hotel/${(booking.hotel as { id: string }).id}`}
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
    const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
    const [completePayment, { isLoading: isCompletingPayment }] = useCompletePaymentMutation();

    const rawResults = bookingsResponse?.data?.results ?? [];
    const bookings = Array.isArray(rawResults) ? rawResults : [];

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlistItems.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="w-20 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-foreground">
                                                {item.property}
                                            </h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                                                {item.location}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1">
                                                    <Star
                                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                        aria-hidden
                                                    />
                                                    <span className="text-sm">{item.rating}</span>
                                                </div>
                                                <span className="font-bold text-foreground">
                                                    ${item.price}/night
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full mt-3 min-h-[44px]"
                                        size="sm"
                                        asChild
                                    >
                                        <Link href="/search">Book now</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <AlertDialog
                open={cancelTargetId !== null}
                onOpenChange={(open) => !open && setCancelTargetId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cancel your reservation. You may be charged a
                            fee depending on the property’s cancellation policy. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep booking</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmCancel}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Cancel booking
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
