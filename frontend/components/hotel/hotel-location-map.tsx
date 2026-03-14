"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in react-leaflet (webpack/Next.js)
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

interface HotelLocationMapProps {
    latitude: number;
    longitude: number;
    title: string;
    address?: string;
    className?: string;
}

export function HotelLocationMap({
    latitude,
    longitude,
    title,
    address,
    className,
}: HotelLocationMapProps) {
    return (
        <div className={className}>
            <MapContainer
                center={[latitude, longitude]}
                zoom={15}
                scrollWheelZoom
                className="h-full w-full rounded-lg z-0"
                style={{ minHeight: 256 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        <span className="font-semibold">{title}</span>
                        {address && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {address}
                            </p>
                        )}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
