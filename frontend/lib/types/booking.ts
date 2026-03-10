// Booking and room related types

import { Hotel, Room } from "./hotel";
import { User } from "./user";

// Booking types
export interface Booking {
    id: string;
    bookingReference: string;
    user: User;
    hotel: Hotel;
    room: Room;
    checkInDate: string;
    checkOutDate: string;
    guestsCount: number;
    adultsCount: number;
    childrenCount: number;
    totalNights: number;
    roomRate: number;
    taxes: number;
    fees: number;
    totalAmount: number;
    currency: string;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    specialRequests?: string;
    guestDetails: GuestDetails[];
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
    cancellationReason?: string;
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
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    nationality?: string;
    passportNumber?: string;
    isPrimary: boolean;
}

// Booking creation and search types
export interface BookingSearchParams {
    destination?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    adults: number;
    children: number;
    rooms?: number;
}

export interface CreateBookingData {
    hotelId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    guestsCount: number;
    adultsCount: number;
    childrenCount: number;
    specialRequests?: string;
    guestDetails: Omit<GuestDetails, "id" | "booking">[];
}

export interface BookingAvailability {
    roomId: string;
    available: boolean;
    pricePerNight: number;
    totalPrice: number;
    currency: string;
    restrictions?: string[];
}

// Payment types
export interface Payment {
    id: string;
    booking: string; // Booking ID
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentProvider: string;
    transactionId?: string;
    status: PaymentStatus;
    processedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export type PaymentMethod =
    | "credit_card"
    | "debit_card"
    | "paypal"
    | "bank_transfer"
    | "cash";

export interface PaymentIntent {
    id: string;
    bookingId: string;
    amount: number;
    currency: string;
    clientSecret: string;
    status: string;
}

// Cancellation types
export interface CancellationPolicy {
    id: string;
    hotel: string; // Hotel ID
    name: string;
    description: string;
    freeCancellationHours: number;
    cancellationFeePercentage: number;
    noShowFeePercentage: number;
    isActive: boolean;
}

export interface CancellationRequest {
    bookingId: string;
    reason: string;
    requestedRefundAmount?: number;
}

// Review types for bookings
export interface BookingReview {
    id: string;
    booking: string; // Booking ID
    hotel: string; // Hotel ID
    room: string; // Room ID
    user: string; // User ID
    overallRating: number;
    cleanlinessRating: number;
    comfortRating: number;
    locationRating: number;
    serviceRating: number;
    valueRating: number;
    comment?: string;
    pros?: string;
    cons?: string;
    wouldRecommend: boolean;
    createdAt: string;
    updatedAt: string;
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
    hotelId: string;
    checkIn: string;
    checkOut: string;
    availableRooms: BookingAvailability[];
}
