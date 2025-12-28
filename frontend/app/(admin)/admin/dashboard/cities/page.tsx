import CitiesAdmin from "@/components/admin/cities/cities-admin";

export const metadata = {
    title: "Cities | Admin Dashboard | TripNest",
    description:
        "Manage cities, locations, and geographical data for properties on the TripNest platform.",
};

export default function CitiesPage() {
    return <CitiesAdmin />;
}
