import HotelDetailPage from "@/components/hotel/hotel-detail-page";

export default async function HotelPage({ params }: { params: { id: string } }) {
    const { id: hotelId } = await params;
    return <HotelDetailPage hotelId={hotelId} />;
}
