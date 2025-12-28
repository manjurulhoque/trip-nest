import HotelTypesAdmin from "@/components/admin/hotel-types/hotel-types-admin";

export const metadata = {
    title: "Hotel Types | Admin Dashboard | TripNest",
    description:
        "Manage and configure different types of hotels and accommodations on the TripNest platform.",
};

export default function HotelTypesPage() {
    return <HotelTypesAdmin />;
}
