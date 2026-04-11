"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSearchHotelsQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { HotelSearchParams } from "@/lib/types/hotel";
import { Hotel } from "@/lib/types/hotel";
import Link from "next/link";
import { hotelUrlWithTripParams } from "./search-utils";
import { WishlistToggleButton } from "@/components/wishlist/wishlist-toggle-button";

const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;

interface SearchResultsMapProps {
    searchParams: HotelSearchParams;
}

function getMapCenter(hotels: Hotel[]): [number, number] {
    const withCoords = hotels.filter(
        (h) =>
            h.latitude != null &&
            h.longitude != null &&
            Number.isFinite(h.latitude) &&
            Number.isFinite(h.longitude)
    );
    if (withCoords.length === 0) return DEFAULT_CENTER;
    const lat =
        withCoords.reduce((sum, h) => sum + (h.latitude ?? 0), 0) /
        withCoords.length;
    const lng =
        withCoords.reduce((sum, h) => sum + (h.longitude ?? 0), 0) /
        withCoords.length;
    return [lat, lng];
}

export function SearchResultsMap({ searchParams }: SearchResultsMapProps) {
    const { data: response, isLoading, error } = useSearchHotelsQuery({
        ...searchParams,
        page: searchParams.page ?? 1,
    });

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !response.data) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {response?.errors?.detail ||
                        "Failed to load search results"}
                </AlertDescription>
            </Alert>
        );
    }

    const hotels = response.data?.results ?? [];
    const withCoords = hotels.filter(
        (h): h is Hotel & { latitude: number; longitude: number } =>
            h.latitude != null &&
            h.longitude != null &&
            Number.isFinite(h.latitude) &&
            Number.isFinite(h.longitude)
    );
    const center = getMapCenter(hotels);
    const zoom = withCoords.length === 0 ? DEFAULT_ZOOM : 12;

    if (hotels.length === 0) {
        return (
            <div className="text-center py-8 rounded-lg bg-muted/50">
                <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                <p className="text-muted-foreground">
                    Try adjusting your search filters
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden border">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom
                className="h-full w-full rounded-lg z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {withCoords.map((hotel) => (
                    <Marker
                        key={hotel.id}
                        position={[hotel.latitude, hotel.longitude]}
                    >
                        <Popup>
                            <div className="min-w-[180px]">
                                <span className="font-semibold">
                                    {hotel.name}
                                </span>
                                {hotel.address && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {hotel.address}
                                    </p>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <WishlistToggleButton hotelId={hotel.id} />
                                    <Link
                                        href={hotelUrlWithTripParams(hotel.id, searchParams)}
                                        className="inline-block text-sm font-medium text-primary hover:underline"
                                    >
                                        View details →
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            {withCoords.length < hotels.length && (
                <p className="text-xs text-muted-foreground p-2 bg-background/80">
                    {hotels.length - withCoords.length} result(s) without
                    coordinates not shown on map
                </p>
            )}
        </div>
    );
}
