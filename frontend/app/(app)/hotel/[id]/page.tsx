import { Header } from "@/components/header";
import { HotelGallery } from "@/components/hotel/hotel-gallery";
import { HotelDetails } from "@/components/hotel/hotel-details";
import { HotelRooms } from "@/components/hotel/hotel-rooms";
import { HotelFacilities } from "@/components/hotel/hotel-facilities";
import { HotelReviews } from "@/components/hotel/hotel-reviews";
import { HotelLocation } from "@/components/hotel/hotel-location";

export default function HotelPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-6">
                <HotelGallery />
                <div className="mt-8 space-y-12">
                    <HotelDetails />
                    <HotelRooms />
                    <HotelFacilities />
                    <HotelLocation />
                    <HotelReviews />
                </div>
            </main>
        </div>
    );
}
