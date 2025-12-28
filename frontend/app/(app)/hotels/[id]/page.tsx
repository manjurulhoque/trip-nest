import PropertyPage from "@/components/property/property-page";

export const metadata = {
    title: "Property Details | TripNest",
    description:
        "View detailed information about this property including amenities, reviews, and booking options.",
};

export default function Property({ params }: { params: { id: string } }) {
    return <PropertyPage propertyId={params.id} />;
}
