import EditHotelPage from "@/components/hotel/edit-hotel-page";

export const metadata = {
    title: "Edit Hotel | TripNest Host",
    description:
        "Edit your hotel details, update information, and manage your property listing.",
};

export default function EditHotel({ params }: { params: { id: string } }) {
    return <EditHotelPage hotelId={params.id} />;
}
