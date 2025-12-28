import HotelChainsAdmin from "@/components/admin/hotel-chains/hotel-chains-admin";

export const metadata = {
    title: "Hotel Chains | Admin Dashboard | TripNest",
    description:
        "Manage hotel chains, their properties, and operations across the TripNest platform.",
};

export default function HotelChainsPage() {
    return <HotelChainsAdmin />;
}
