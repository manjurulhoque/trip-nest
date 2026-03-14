"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Bed, Maximize, Wifi, Coffee, Tv } from "lucide-react";
import { useGetHotelQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Room, Facility } from "@/lib/types/hotel";

interface HotelRoomsProps {
    hotelId: string;
}

const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
        case "free wifi":
            return <Wifi className="h-3 w-3" aria-hidden="true" />;
        case "coffee machine":
            return <Coffee className="h-3 w-3" aria-hidden="true" />;
        case "smart tv":
            return <Tv className="h-3 w-3" aria-hidden="true" />;
        default:
            return null;
    }
};

export function HotelRooms({ hotelId }: HotelRoomsProps) {
    const getRoomImageUrl = (roomId: string) => {
        return `https://picsum.photos/seed/room-${encodeURIComponent(
            roomId
        )}/800/480?blur=1`;
    };

    const { data: response, isLoading, error } = useGetHotelQuery(hotelId);

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !response.data) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Failed to load hotel rooms
                </AlertDescription>
            </Alert>
        );
    }

    const hotel = response.data;
    const rooms = hotel.rooms || [];

    if (rooms.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Available Rooms</h2>
                    <p className="text-gray-600">
                        No rooms are currently available
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Available Rooms</h2>
                <p className="text-gray-600">
                    Choose from our selection of comfortable and luxurious
                    accommodations
                </p>
            </div>

            <div className="space-y-6">
                {rooms.map((room: Room) => (
                    <Card key={room.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:w-80 flex-shrink-0">
                                    <img
                                        src={getRoomImageUrl(room.id)}
                                        alt={room.name}
                                        className="w-full h-48 lg:h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-semibold">
                                                    {room.name}
                                                </h3>
                                                {room.isPopular && (
                                                    <Badge className="bg-primary">
                                                        Most Popular
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-3">
                                                {room.description}
                                            </p>

                                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Users
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                    <span>
                                                        Up to {room.maxGuests}{" "}
                                                        guests
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bed
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{room.bedType}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Maximize
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{room.size} m²</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {room.amenities
                                                    .slice(0, 4)
                                                    .map(
                                                        (amenity: Facility) => (
                                                            <div
                                                                key={amenity.id}
                                                                className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded"
                                                            >
                                                                {getAmenityIcon(
                                                                    amenity.name
                                                                )}
                                                                <span>
                                                                    {
                                                                        amenity.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                {room.amenities.length > 4 && (
                                                    <span className="text-xs text-gray-500">
                                                        +
                                                        {room.amenities.length -
                                                            4}{" "}
                                                        more
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-500">
                                                {room.availableRooms} room
                                                {room.availableRooms !== 1
                                                    ? "s"
                                                    : ""}{" "}
                                                left at this price
                                            </p>
                                        </div>

                                        <div className="text-right ml-6">
                                            <div className="mb-2">
                                                {room.originalPrice && (
                                                    <span className="text-sm text-gray-500 line-through block">
                                                        ${room.originalPrice}
                                                    </span>
                                                )}
                                                <span className="text-2xl font-bold text-primary">
                                                    ${room.price}
                                                </span>
                                                <span className="text-sm text-gray-600 block">
                                                    per night
                                                </span>
                                            </div>
                                            <Button className="w-full min-w-[120px]">
                                                Select Room
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
