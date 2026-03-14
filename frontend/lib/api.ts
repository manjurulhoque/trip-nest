import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, ApiError } from "./types/http";
import { getSession, signOut } from "next-auth/react";

// Base API configuration
export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/",
    prepareHeaders: async (headers, { getState }) => {
        const session = await getSession();
        if (session?.accessToken) {
            headers.set("authorization", `Bearer ${session.accessToken}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

// Base query with auto-retry for common errors
export const baseQueryWithRetry = async (
    args: any,
    api: any,
    extraOptions: any
) => {
    let result = await baseQuery(args, api, extraOptions);

    // Handle 401 errors (token expired)
    if (result.error && result.error.status === 401) {
        // sign out and redirect to login page
        await signOut();
        window.location.href = "/auth/login";
        return result;
    }

    // Transform error responses to match our API error format
    if (result.error) {
        return {
            error: {
                status: result.error.status,
                data: {
                    success: false,
                    errors: result.error.data,
                    data: null,
                } as ApiError,
            },
        };
    }

    // Transform successful responses to match our API response format
    if (result.data && typeof result.data === "object") {
        // Check if response is already in our format
        if ("success" in result.data) {
            return result;
        }

        // Transform to our format
        return {
            ...result,
            data: {
                success: true,
                data: result.data,
            } as ApiResponse<any>,
        };
    }

    return result;
};

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "users/auth/login/",
        REGISTER: "users/auth/register/",
        LOGOUT: "users/auth/logout/",
        PROFILE: "users/profile/",
        CHANGE_PASSWORD: "users/password/change/",
        RESET_PASSWORD: "users/password/reset/",
        RESET_PASSWORD_CONFIRM: "users/password/reset/confirm/",
        VERIFY_EMAIL: "users/email/verify/",
        RESEND_VERIFICATION: "users/email/resend/",
        SWITCH_TO_HOST: "users/switch-to-host/",
        ROLE_INFO: "users/role-info/",
        HOST_DASHBOARD: "users/host-dashboard/",
        GUEST_DASHBOARD: "users/guest-dashboard/",
        USER_ACTIVITY: "users/activity/",
        DEACTIVATE_ACCOUNT: "users/deactivate/",
        PROFILE_STATUS: "users/profile/status/",
    },
    HOTELS: {
        BASE: "hotels/",
        MY_HOTELS: "hotels/my-hotels/",
        DETAIL: (id: string) => `hotels/${id}/`,
        TOGGLE_ACTIVE: (id: string) => `hotels/${id}/toggle-active/`,
        FORM_DATA: "hotels/form-data/",
        SEARCH: "hotels/search/",
        FEATURED: "hotels/featured/",
        POPULAR_DESTINATIONS: "hotels/popular-destinations/",
        DASHBOARD_STATS: "hotels/dashboard-stats/",
    },
    FACILITIES: {
        BASE: "facilities/",
        CATEGORIES: "facilities/categories/",
        POPULAR: "facilities/popular/",
        ADMIN: {
            BASE: "admin/facilities/",
            STATS: "admin/facilities/stats/",
            RESTORE: (id: number) => `admin/facilities/${id}/restore/`,
            HARD_DELETE: (id: number) => `admin/facilities/${id}/hard_delete/`,
        },
    },
    // Room endpoints
    ROOMS: {
        BASE: "rooms/",
        BY_HOTEL: (hotelId: string) => `hotels/${hotelId}/rooms/`,
    },
    // Review endpoints
    REVIEWS: {
        BASE: "reviews/",
        BY_HOTEL: (hotelId: string) => `hotels/${hotelId}/reviews/`,
    },
    // Booking endpoints
    BOOKINGS: {
        BASE: "bookings/",
        DETAIL: (id: string) => `bookings/${id}/`,
        CANCEL: (id: string) => `bookings/${id}/cancel/`,
    },
} as const;
