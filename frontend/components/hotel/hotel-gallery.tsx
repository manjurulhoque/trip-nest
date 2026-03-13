"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import { useGetHotelQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface HotelGalleryProps {
    hotelId: string;
}

export function HotelGallery({ hotelId }: HotelGalleryProps) {
    const { data: response, isLoading, error } = useGetHotelQuery(hotelId);
    const [currentImage, setCurrentImage] = useState(0);

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !response.data) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {response?.errors?.detail || "Failed to load hotel images"}
                </AlertDescription>
            </Alert>
        );
    }

    const hotel = response.data;
    const images = hotel.images.map((img) => img.urlHd || img.url);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    if (images.length === 0) {
        return (
            <div className="relative w-full min-w-0">
                <div className="grid grid-cols-4 gap-2 h-80 sm:h-96">
                    <div className="col-span-4">
                        <img
                            src="/placeholder.svg"
                            alt="No images available"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-w-0 overflow-hidden rounded-xl">
            <div className="grid grid-cols-4 gap-2 h-80 sm:h-96">
                <div
                    className={
                        images.length > 1 ? "col-span-2 relative" : "col-span-4 relative"
                    }
                >
                    <img
                        src={images[currentImage] || "/placeholder.svg"}
                        alt={`Hotel view ${currentImage + 1}`}
                        className={
                            images.length > 1
                                ? "w-full h-full object-cover"
                                : "w-full h-full object-cover"
                        }
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                        aria-label="Previous photo"
                    >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                        aria-label="Next photo"
                    >
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
                {images.length > 1 && (
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                        {images.slice(1, 5).map((image, index) => (
                            <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Hotel view ${index + 2}`}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                                onClick={() => setCurrentImage(index + 1)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Button
                variant="outline"
                className="absolute bottom-4 right-4 bg-white"
            >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Show all photos
            </Button>
        </div>
    );
}
