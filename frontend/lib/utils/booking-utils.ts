import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types/booking";

export function formatBookingDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function getBookingStatusBadgeVariant(
    status: BookingStatus
): "default" | "secondary" | "destructive" | "outline" {
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

export function getBookingPaymentBadgeVariant(
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

export function getBookingHotelName(booking: Booking): string {
    const hotel = booking.hotel;
    if (typeof hotel === "object" && hotel !== null && "name" in hotel) {
        return (hotel as { name: string }).name;
    }
    return "Hotel";
}

export function getBookingHotelLocation(booking: Booking): string {
    const hotel = booking.hotel;
    if (typeof hotel === "object" && hotel !== null && "address" in hotel) {
        return (hotel as { address?: string }).address ?? "—";
    }
    return "—";
}

export function getBookingHotelImage(booking: Booking): string | null {
    const hotel = booking.hotel;
    if (typeof hotel === "object" && hotel !== null) {
        const h = hotel as { mainPhoto?: string; thumbnail?: string };
        return h.mainPhoto ?? h.thumbnail ?? null;
    }
    return null;
}

export function getBookingOwnerContact(
    booking: Booking
): { name: string; email?: string; phone?: string } | null {
    const hotel = booking.hotel;
    if (typeof hotel !== "object" || hotel === null || !("owner" in hotel)) {
        return null;
    }

    const owner = (hotel as { owner?: Record<string, unknown> }).owner;
    if (!owner || typeof owner !== "object") {
        return null;
    }

    const firstName = typeof owner.firstName === "string" ? owner.firstName : "";
    const lastName = typeof owner.lastName === "string" ? owner.lastName : "";
    const fullName = `${firstName} ${lastName}`.trim();

    const username = typeof owner.username === "string" ? owner.username : "";
    const email = typeof owner.email === "string" ? owner.email : undefined;
    const phone =
        typeof owner.phone === "string"
            ? owner.phone
            : typeof owner.phoneNumber === "string"
              ? owner.phoneNumber
              : undefined;

    return {
        name: fullName || username || "Property owner",
        email,
        phone,
    };
}
