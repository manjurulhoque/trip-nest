import { Hotel } from "./hotel";

export interface WishlistHotelSummary {
    id: string;
    name: string;
    mainPhoto?: string;
    thumbnail?: string;
    cityName?: string | null;
    rating?: number | null;
    reviewsCount: number;
    stars: number;
}

export interface WishlistItem {
    id: string;
    hotel: WishlistHotelSummary;
    notes?: string;
    createdAt: string;
}

