"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CenterLoader from "@/components/loaders/center-loader";
import { useGetBookingQuery } from "@/store/api/bookingApi";
import type { Booking } from "@/lib/types/booking";

interface BookingDetailsDialogProps {
    bookingId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDialog({
    bookingId,
    open,
    onOpenChange,
}: BookingDetailsDialogProps) {
    const {
        data: bookingDetailResponse,
        isLoading,
    } = useGetBookingQuery(bookingId as string, {
        skip: !bookingId,
    } as any);

    const handleClose = () => {
        onOpenChange(false);
    };

    const booking: Booking | undefined = bookingDetailResponse?.data;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Booking details</DialogTitle>
                    <DialogDescription>
                        Full information about the selected booking.
                    </DialogDescription>
                </DialogHeader>
                {isLoading || !booking ? (
                    <div className="py-10">
                        <CenterLoader />
                    </div>
                ) : (
                    <div className="space-y-4 py-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Reference
                                </p>
                                <p className="font-semibold">
                                    {booking.bookingReference}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Booking status
                                    </span>
                                    <Badge
                                        variant={
                                            booking.status === "confirmed" ||
                                            booking.status === "checked_in"
                                                ? "default"
                                                : booking.status === "cancelled" ||
                                                  booking.status === "no_show"
                                                ? "destructive"
                                                : "secondary"
                                        }
                                    >
                                        {booking.status.replace("_", " ")}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Payment status
                                    </span>
                                    <Badge
                                        variant={
                                            booking.paymentStatus === "paid"
                                                ? "default"
                                                : booking.paymentStatus === "failed"
                                                ? "destructive"
                                                : "secondary"
                                        }
                                    >
                                        {booking.paymentStatus.replace("_", " ")}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Booker
                                </p>
                                <p className="text-sm font-medium">
                                    {booking.user.firstName}{" "}
                                    {booking.user.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {booking.user.email}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Hotel & room
                                </p>
                                <p className="text-sm font-medium">
                                    {booking.hotel.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Room: {booking.room.name}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Stay
                                </p>
                                <p className="text-sm">
                                    {new Date(
                                        booking.checkInDate
                                    ).toLocaleString()}{" "}
                                    –{" "}
                                    {new Date(
                                        booking.checkOutDate
                                    ).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {booking.totalNights} nights ·{" "}
                                    {booking.guestsCount} guests
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Payment
                                </p>
                                <p className="text-sm font-medium">
                                    {booking.totalAmount.toLocaleString(
                                        undefined,
                                        {
                                            style: "currency",
                                            currency: booking.currency,
                                        }
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Room rate:{" "}
                                    {booking.roomRate.toLocaleString(
                                        undefined,
                                        {
                                            style: "currency",
                                            currency: booking.currency,
                                        }
                                    )}{" "}
                                    · Taxes:{" "}
                                    {booking.taxes.toLocaleString(
                                        undefined,
                                        {
                                            style: "currency",
                                            currency: booking.currency,
                                        }
                                    )}{" "}
                                    · Fees:{" "}
                                    {booking.fees.toLocaleString(
                                        undefined,
                                        {
                                            style: "currency",
                                            currency: booking.currency,
                                        }
                                    )}
                                </p>
                            </div>
                        </div>

                        {booking.guestDetails &&
                            booking.guestDetails.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                        Guests
                                    </p>
                                    <ul className="space-y-1 text-sm">
                                        {booking.guestDetails.map(
                                            (guest: (typeof booking.guestDetails)[number]) => (
                                                <li
                                                    key={guest.id}
                                                    className="flex justify-between text-xs md:text-sm"
                                                >
                                                    <span>
                                                        {guest.firstName}{" "}
                                                        {guest.lastName}
                                                        {guest.isPrimary
                                                            ? " (primary)"
                                                            : ""}
                                                    </span>
                                                    {guest.nationality && (
                                                        <span className="text-muted-foreground">
                                                            {guest.nationality}
                                                        </span>
                                                    )}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                        {booking.cancellationReason && (
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Cancellation reason
                                </p>
                                <p className="text-sm">
                                    {booking.cancellationReason}
                                </p>
                            </div>
                        )}
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

