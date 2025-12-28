// Booking and room related types

import { Hotel } from "./hotel";
import { User } from "./user";

export interface Room {
    id: string;
    hotel: string; // Hotel ID
    room_type: string;
    name: string;
    description?: string;
    max_occupancy: number;
    base_price: number;
    size_sqm?: number;
    bed_type: string;
    bed_count: number;
    bathroom_type: string;
    has_balcony: boolean;
    has_sea_view: boolean;
    has_city_view: boolean;
    has_mountain_view: boolean;
    amenities: string[];
    images: RoomImage[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface RoomImage {
    id: string;
    room: string; // Room ID
    url: string;
    url_hd?: string;
    thumbnail_url?: string;
    caption?: string;
    order: number;
    is_primary: boolean;
}

export interface RoomType {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    is_active: boolean;
}

// Booking types
export interface Booking {
    id: string;
    booking_reference: string;
    user: User;
    hotel: Hotel;
    room: Room;
    check_in_date: string;
    check_out_date: string;
    guests_count: number;
    adults_count: number;
    children_count: number;
    total_nights: number;
    room_rate: number;
    taxes: number;
    fees: number;
    total_amount: number;
    currency: string;
    status: BookingStatus;
    payment_status: PaymentStatus;
    special_requests?: string;
    guest_details: GuestDetails[];
    created_at: string;
    updated_at: string;
    cancelled_at?: string;
    cancellation_reason?: string;
}

export type BookingStatus =
    | "pending"
    | "confirmed"
    | "checked_in"
    | "checked_out"
    | "cancelled"
    | "no_show";

export type PaymentStatus =
    | "pending"
    | "paid"
    | "partially_paid"
    | "refunded"
    | "failed";

export interface GuestDetails {
    id: string;
    booking: string; // Booking ID
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    nationality?: string;
    passport_number?: string;
    is_primary: boolean;
}

// Booking creation and search types
export interface BookingSearchParams {
    destination?: string;
    check_in: string;
    check_out: string;
    guests: number;
    adults: number;
    children: number;
    rooms?: number;
}

export interface CreateBookingData {
    hotel_id: string;
    room_id: string;
    check_in_date: string;
    check_out_date: string;
    guests_count: number;
    adults_count: number;
    children_count: number;
    special_requests?: string;
    guest_details: Omit<GuestDetails, "id" | "booking">[];
}

export interface BookingAvailability {
    room_id: string;
    available: boolean;
    price_per_night: number;
    total_price: number;
    currency: string;
    restrictions?: string[];
}

// Payment types
export interface Payment {
    id: string;
    booking: string; // Booking ID
    amount: number;
    currency: string;
    payment_method: PaymentMethod;
    payment_provider: string;
    transaction_id?: string;
    status: PaymentStatus;
    processed_at?: string;
    created_at: string;
    updated_at: string;
}

export type PaymentMethod =
    | "credit_card"
    | "debit_card"
    | "paypal"
    | "bank_transfer"
    | "cash";

export interface PaymentIntent {
    id: string;
    booking_id: string;
    amount: number;
    currency: string;
    client_secret: string;
    status: string;
}

// Cancellation types
export interface CancellationPolicy {
    id: string;
    hotel: string; // Hotel ID
    name: string;
    description: string;
    free_cancellation_hours: number;
    cancellation_fee_percentage: number;
    no_show_fee_percentage: number;
    is_active: boolean;
}

export interface CancellationRequest {
    booking_id: string;
    reason: string;
    requested_refund_amount?: number;
}

// Review types for bookings
export interface BookingReview {
    id: string;
    booking: string; // Booking ID
    hotel: string; // Hotel ID
    room: string; // Room ID
    user: string; // User ID
    overall_rating: number;
    cleanliness_rating: number;
    comfort_rating: number;
    location_rating: number;
    service_rating: number;
    value_rating: number;
    comment?: string;
    pros?: string;
    cons?: string;
    would_recommend: boolean;
    created_at: string;
    updated_at: string;
}

// API response types
export interface BookingListResponse {
    results: Booking[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface RoomListResponse {
    results: Room[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface AvailabilityResponse {
    hotel_id: string;
    check_in: string;
    check_out: string;
    available_rooms: BookingAvailability[];
}
