import HotelsAdmin from "@/components/admin/hotels/hotels-admin";

export const metadata = {
    title: "Admin | Hotels",
    description: "Admin view of all hotels on TripNest.",
};

export default function AdminHotelsPage() {
    return <HotelsAdmin />;
}

