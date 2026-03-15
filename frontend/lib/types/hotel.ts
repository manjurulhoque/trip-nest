// Hotel related types and interfaces

import { Category } from "./category";

export interface City {
    id: string;
    name: string;
    countryName: string;
}

export interface HotelChain {
    id: string;
    chainId?: number;
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    headquartersCountry?: string;
    headquartersCountryName?: string;
    isActive?: boolean;
    hotelCount?: number;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
    deletedAt?: string;
}

export interface HotelType {
    id: string;
    typeId?: number;
    name: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
    hotelCount?: number;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
    deletedAt?: string;
}

export interface Facility {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    category: Category;
}

export interface HotelImage {
    id: string;
    url: string;
    urlHd?: string;
    thumbnailUrl?: string;
    caption?: string;
    order: number;
    defaultImage: boolean;
}

export interface QuickFact {
    icon: string;
    text: string;
}

export interface RoomImage {
    id: string;
    room: string; // Room ID
    url: string;
    urlHd?: string;
    thumbnailUrl?: string;
    caption?: string;
    order: number;
    isPrimary: boolean;
}

export interface RoomType {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    isActive: boolean;
}


export interface HotelRoom {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    maxGuests: number;
    bedType: string;
    size: number;
    amenities: Facility[];
    availableRooms: number;
    isPopular: boolean;
    hotel: string; // Hotel ID
    roomType: string;
    maxOccupancy: number;
    basePrice: number;
    sizeSqm?: number;
    bedCount: number;
    bathroomType: string;
    hasBalcony: boolean;
    hasSeaView: boolean;
    hasCityView: boolean;
    hasMountainView: boolean;
    photos: RoomImage[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/** Alias for HotelRoom for use in room listing components */
export type Room = HotelRoom;

export interface NearbyAttraction {
    name: string;
    distance: string;
    walkTime: string;
}

export interface Transportation {
    name: string;
    distance: string;
    time: string;
}

export interface HotelReview {
    id: string;
    userName: string;
    userAvatar?: string;
    createdAt: string;
    rating: number;
    title?: string;
    comment: string;
    helpfulCount: number;
    roomType?: string;
    stayType?: string;
}

export interface RatingBreakdown {
    stars: number;
    count: number;
    percentage: number;
}

export interface CategoryRating {
    category: string;
    rating: number;
}

export interface Hotel {
    id: string;
    name: string;
    mainPhoto?: string;
    thumbnail?: string;
    latitude?: number;
    longitude?: number;
    address: string;
    city: City;
    addressSuburb?: string;
    stars: number;
    rating?: number;
    ranking: number;
    reviewsCount: number;
    bestSeller: boolean;
    chain?: HotelChain;
    hotelType?: HotelType;
    startingPrice?: number;
    facilities: Facility[];
    images: HotelImage[];
    isActive: boolean;
    roomCount: number;
    createdAt: string;
    updatedAt?: string;
    owner?: {
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
    mainImage?: HotelImage;

    // Optional fields that may not be present in all responses
    description?: string;
    additionalInfo?: string;
    location?: string;
    averageRating?: number;
    type?: string;
    tags?: string[];
    quickFacts?: QuickFact[];
    rooms?: HotelRoom[];
    nearbyAttractions?: NearbyAttraction[];
    transportation?: Transportation[];
    reviews?: HotelReview[];
    ratingBreakdown?: RatingBreakdown[];
    categoryRatings?: CategoryRating[];
}

export interface PopularDestination {
    cityId: string;
    cityName: string;
    cityCountryName: string;
    hotelCount: number;
    avgRating: number | null;
}

export interface HotelStats {
    totalHotels: number;
    activeHotels: number;
    inactiveHotels: number;
    totalRooms: number;
    avgRating: number;
    totalReviews: number;
    recentHotels: Hotel[];
}

// Hotel Chain form data types
export interface HotelChainFormData {
    chainId: number;
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    headquartersCountry?: string;
    isActive: boolean;
}

// Hotel Chain statistics for admin dashboard
export interface HotelChainStats {
    totalChains: number;
    activeChains: number;
    inactiveChains: number;
    deletedChains: number;
    chainsWithHotels: Array<{
        id: string;
        name: string;
        hotelCount: number;
        isActive: boolean;
    }>;
    recentChains: HotelChain[];
}

// Hotel Type form data types
export interface HotelTypeFormData {
    typeId: number;
    name: string;
    description?: string;
    icon?: string;
    isActive: boolean;
}

// Hotel Type statistics for admin dashboard
export interface HotelTypeStats {
    totalTypes: number;
    activeTypes: number;
    inactiveTypes: number;
    deletedTypes: number;
    typesWithHotels: Array<{
        id: string;
        name: string;
        hotelCount: number;
        isActive: boolean;
    }>;
    recentTypes: HotelType[];
}

export interface HotelFormData {
    name: string;
    mainPhoto?: string;
    thumbnail?: string;
    latitude?: number;
    longitude?: number;
    address: string;
    city: string;
    addressSuburb?: string;
    stars: number;
    rating?: number;
    chain?: string;
    hotelType?: string;
    facilityIds?: string[];
    images?: Array<{
        url: string;
        urlHd?: string;
        thumbnailUrl?: string;
        caption?: string;
        order: number;
        defaultImage: boolean;
    }>;
    isActive: boolean;
}

export interface FormLookupData {
    cities: Array<{
        id: string;
        name: string;
        countryName: string;
    }>;
    hotelChains: Array<{
        id: string;
        name: string;
    }>;
    types: Array<{
        id: string;
        name: string;
    }>;
    facilities: Facility[];
    chains: Array<{
        id: string;
        name: string;
    }>;
}

// Hotel search parameters (includes trip params from search hero)
export interface HotelSearchParams {
    city?: string;
    stars?: number;
    minRating?: number;
    priceMin?: number;
    priceMax?: number;
    facilities?: string[];
    q?: string;
    page?: number;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
}

// Hotel filter options
export interface HotelFilters {
    stars?: number[];
    rating?: [number, number];
    price?: [number, number];
    facilities?: string[];
    hotelTypes?: string[];
    chains?: string[];
}

// Hotel booking related types
export interface HotelAvailability {
    hotelId: string;
    checkIn: string;
    checkOut: string;
    availableRooms: number;
    minPrice: number;
    maxPrice: number;
}

// Response types for API calls
export interface HotelListResponse {
    results: Hotel[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface ToggleHotelActiveResponse {
    message: string;
    isActive: boolean;
}
