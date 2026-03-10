import { Header } from "@/components/header";
import { HotelGallery } from "@/components/hotel/hotel-gallery";
import { HotelDetails } from "@/components/hotel/hotel-details";
import { HotelRooms } from "@/components/hotel/hotel-rooms";
import { HotelFacilities } from "@/components/hotel/hotel-facilities";
import { HotelReviews } from "@/components/hotel/hotel-reviews";
import { HotelLocation } from "@/components/hotel/hotel-location";

export default async function HotelPage({ params }: { params: { id: string } }) {
    const { id: hotelId } = await params;
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 min-w-0">
                        <HotelGallery hotelId={hotelId} />
                    </div>
                    <div className="lg:col-span-2 lg:sticky lg:top-6 lg:self-start">
                        <HotelDetails hotelId={hotelId} />
                    </div>
                </div>
                <div className="mt-8 space-y-12">
                    <HotelRooms hotelId={hotelId} />
                    <HotelFacilities hotelId={hotelId} />
                    <HotelLocation hotelId={hotelId} />
                    <HotelReviews hotelId={hotelId} />
                </div>
            </main>
        </div>
    );
}
