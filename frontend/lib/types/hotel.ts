// Hotel related types and interfaces

export interface City {
    id: string;
    name: string;
    country_name: string;
}

export interface HotelChain {
    id: string;
    chain_id?: number;
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    headquarters_country?: string;
    headquarters_country_name?: string;
    is_active?: boolean;
    hotel_count?: number;
    created_at?: string;
    updated_at?: string;
    is_deleted?: boolean;
    deleted_at?: string;
}

export interface HotelType {
    id: string;
    type_id?: number;
    name: string;
    description?: string;
    icon?: string;
    is_active?: boolean;
    hotel_count?: number;
    created_at?: string;
    updated_at?: string;
    is_deleted?: boolean;
    deleted_at?: string;
}

export interface Facility {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    category: string;
}

export interface HotelImage {
    id: string;
    url: string;
    url_hd?: string;
    thumbnail_url?: string;
    caption?: string;
    order: number;
    default_image: boolean;
}

export interface QuickFact {
    icon: string;
    text: string;
}

export interface HotelRoom {
    id: string;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    max_guests: number;
    bed_type: string;
    size: number;
    amenities: Facility[];
    image: string;
    available_rooms: number;
    is_popular: boolean;
}

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
    user_name: string;
    user_avatar?: string;
    created_at: string;
    rating: number;
    title?: string;
    comment: string;
    helpful_count: number;
    room_type?: string;
    stay_type?: string;
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
    main_photo?: string;
    thumbnail?: string;
    latitude?: number;
    longitude?: number;
    address: string;
    city: City;
    address_suburb?: string;
    stars: number;
    rating?: number;
    ranking: number;
    reviews_count: number;
    best_seller: boolean;
    chain?: HotelChain;
    hotel_type?: HotelType;
    price?: number;
    facilities: Facility[];
    images: HotelImage[];
    is_active: boolean;
    room_count: number;
    min_price?: number;
    created_at: string;
    updated_at?: string;
    owner?: {
        id: string;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
    };
    main_image?: HotelImage;

    // Optional fields that may not be present in all responses
    description?: string;
    additional_info?: string;
    location?: string;
    average_rating?: number;
    total_reviews?: number;
    base_price?: number;
    type?: string;
    tags?: string[];
    quick_facts?: QuickFact[];
    rooms?: HotelRoom[];
    nearby_attractions?: NearbyAttraction[];
    transportation?: Transportation[];
    reviews?: HotelReview[];
    rating_breakdown?: RatingBreakdown[];
    category_ratings?: CategoryRating[];
}

export interface HotelStats {
    total_hotels: number;
    active_hotels: number;
    inactive_hotels: number;
    total_rooms: number;
    avg_rating: number;
    total_reviews: number;
    recent_hotels: Hotel[];
}

// Hotel Chain form data types
export interface HotelChainFormData {
    chain_id: number;
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    headquarters_country?: string;
    is_active: boolean;
}

// Hotel Chain statistics for admin dashboard
export interface HotelChainStats {
    total_chains: number;
    active_chains: number;
    inactive_chains: number;
    deleted_chains: number;
    chains_with_hotels: Array<{
        id: string;
        name: string;
        hotel_count: number;
        is_active: boolean;
    }>;
    recent_chains: HotelChain[];
}

// Hotel Type form data types
export interface HotelTypeFormData {
    type_id: number;
    name: string;
    description?: string;
    icon?: string;
    is_active: boolean;
}

// Hotel Type statistics for admin dashboard
export interface HotelTypeStats {
    total_types: number;
    active_types: number;
    inactive_types: number;
    deleted_types: number;
    types_with_hotels: Array<{
        id: string;
        name: string;
        hotel_count: number;
        is_active: boolean;
    }>;
    recent_types: HotelType[];
}

export interface HotelFormData {
    name: string;
    main_photo?: string;
    thumbnail?: string;
    latitude?: number;
    longitude?: number;
    address: string;
    city: string;
    address_suburb?: string;
    stars: number;
    rating?: number;
    chain?: string;
    hotel_type?: string;
    price?: number;
    facility_ids?: string[];
    images?: Array<{
        url: string;
        url_hd?: string;
        thumbnail_url?: string;
        caption?: string;
        order: number;
        default_image: boolean;
    }>;
    is_active: boolean;
}

export interface FormLookupData {
    cities: Array<{
        id: string;
        name: string;
        country__name: string;
    }>;
    hotel_chains: Array<{
        id: string;
        name: string;
    }>;
    hotel_types: Array<{
        id: string;
        name: string;
    }>;
    facilities: Facility[];
    chains: Array<{
        id: string;
        name: string;
    }>;
}

// Hotel search parameters
export interface HotelSearchParams {
    city?: string;
    stars?: number;
    min_rating?: number;
    price_min?: number;
    price_max?: number;
    facilities?: string[];
    q?: string;
    page?: number;
}

// Hotel filter options
export interface HotelFilters {
    stars?: number[];
    rating?: [number, number];
    price?: [number, number];
    facilities?: string[];
    hotel_types?: string[];
    chains?: string[];
}

// Hotel booking related types
export interface HotelAvailability {
    hotel_id: string;
    check_in: string;
    check_out: string;
    available_rooms: number;
    min_price: number;
    max_price: number;
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
    is_active: boolean;
}
