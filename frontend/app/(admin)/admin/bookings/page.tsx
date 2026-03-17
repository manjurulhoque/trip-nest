import BookingsAdmin from "@/components/admin/bookings/bookings-admin";

export const metadata = {
    title: "Admin | Bookings",
    description: "Admin view of all bookings on TripNest.",
};

export default function AdminBookingsPage() {
    return <BookingsAdmin />;
}

