import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry, API_ENDPOINTS } from "@/lib/api";
import {
    Hotel,
    HotelStats,
    HotelFormData,
    FormLookupData,
    HotelSearchParams,
    HotelListResponse,
    ToggleHotelActiveResponse,
    ApiResponse,
    PaginatedApiResponse,
} from "@/lib/types";

export const hotelApi = createApi({
    reducerPath: "hotelApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["Hotel", "HotelStats"],
    endpoints: (builder) => ({
        // Host Dashboard Stats
        getHostDashboardStats: builder.query<ApiResponse<HotelStats>, void>({
            query: () => API_ENDPOINTS.HOTELS.DASHBOARD_STATS,
            providesTags: ["HotelStats"],
        }),

        // Get host's hotels
        getMyHotels: builder.query<
            PaginatedApiResponse<Hotel>,
            { page?: number }
        >({
            query: ({ page = 1 }) =>
                `${API_ENDPOINTS.HOTELS.MY_HOTELS}?page=${page}`,
            providesTags: ["Hotel"],
        }),

        // Get all hotels (public)
        getHotels: builder.query<
            PaginatedApiResponse<Hotel>,
            { page?: number; search?: string }
        >({
            query: ({ page = 1, search = "" }) =>
                `${API_ENDPOINTS.HOTELS.BASE}?page=${page}&search=${search}`,
            providesTags: ["Hotel"],
        }),

        // Get single hotel
        getHotel: builder.query<ApiResponse<Hotel>, string>({
            query: (id) => API_ENDPOINTS.HOTELS.DETAIL(id),
            providesTags: (result, error, id) => [{ type: "Hotel", id }],
        }),

        // Create hotel
        createHotel: builder.mutation<ApiResponse<Hotel>, HotelFormData>({
            query: (data) => ({
                url: API_ENDPOINTS.HOTELS.BASE,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Hotel", "HotelStats"],
        }),

        // Update hotel
        updateHotel: builder.mutation<
            ApiResponse<Hotel>,
            { id: string; data: Partial<HotelFormData> }
        >({
            query: ({ id, data }) => ({
                url: API_ENDPOINTS.HOTELS.DETAIL(id),
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Hotel", id },
                "Hotel",
                "HotelStats",
            ],
        }),

        // Delete hotel
        deleteHotel: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: API_ENDPOINTS.HOTELS.DETAIL(id),
                method: "DELETE",
            }),
            invalidatesTags: ["Hotel", "HotelStats"],
        }),

        // Toggle hotel active status
        toggleHotelActive: builder.mutation<
            ApiResponse<ToggleHotelActiveResponse>,
            string
        >({
            query: (id) => ({
                url: API_ENDPOINTS.HOTELS.TOGGLE_ACTIVE(id),
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Hotel", id },
                "Hotel",
                "HotelStats",
            ],
        }),

        // Get form lookup data
        getFormData: builder.query<ApiResponse<FormLookupData>, void>({
            query: () => API_ENDPOINTS.HOTELS.FORM_DATA,
        }),

        // Search hotels
        searchHotels: builder.query<
            PaginatedApiResponse<Hotel>,
            HotelSearchParams
        >({
            query: (params) => {
                const searchParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (Array.isArray(value)) {
                            value.forEach((v) =>
                                searchParams.append(`${key}[]`, v)
                            );
                        } else {
                            searchParams.append(key, value.toString());
                        }
                    }
                });
                return `${
                    API_ENDPOINTS.HOTELS.SEARCH
                }?${searchParams.toString()}`;
            },
            providesTags: ["Hotel"],
        }),

        // Get featured hotels
        getFeaturedHotels: builder.query<ApiResponse<Hotel[]>, void>({
            query: () => API_ENDPOINTS.HOTELS.FEATURED,
            providesTags: ["Hotel"],
        }),
    }),
});

export const {
    useGetHostDashboardStatsQuery,
    useGetMyHotelsQuery,
    useGetHotelsQuery,
    useGetHotelQuery,
    useCreateHotelMutation,
    useUpdateHotelMutation,
    useDeleteHotelMutation,
    useToggleHotelActiveMutation,
    useGetFormDataQuery,
    useSearchHotelsQuery,
    useGetFeaturedHotelsQuery,
} = hotelApi;
