import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry } from "@/lib/api";
import {
    HotelType,
    HotelTypeFormData,
    HotelTypeStats,
} from "@/lib/types/hotel";
import { ApiResponse, PaginatedApiResponse } from "@/lib/types";

export const hotelTypeApi = createApi({
    reducerPath: "hotelTypeApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["HotelType", "HotelTypeStats"],
    endpoints: (builder) => ({
        // Get all hotel types
        getHotelTypes: builder.query<PaginatedApiResponse<HotelType>, void>({
            query: () => "hotel-types/",
            providesTags: ["HotelType"],
        }),

        // Get single hotel type
        getHotelType: builder.query<ApiResponse<HotelType>, string>({
            query: (id) => `hotel-types/${id}/`,
            providesTags: (result, error, id) => [{ type: "HotelType", id }],
        }),

        // Admin endpoints
        getAdminHotelTypes: builder.query<
            PaginatedApiResponse<HotelType>,
            void
        >({
            query: () => "admin/hotel-types/",
            providesTags: ["HotelType"],
        }),

        getHotelTypeStats: builder.query<ApiResponse<HotelTypeStats>, void>({
            query: () => "admin/hotel-types/stats/",
            providesTags: ["HotelTypeStats"],
        }),

        createHotelType: builder.mutation<
            ApiResponse<HotelType>,
            HotelTypeFormData
        >({
            query: (data) => ({
                url: "admin/hotel-types/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["HotelType", "HotelTypeStats"],
        }),

        updateHotelType: builder.mutation<
            ApiResponse<HotelType>,
            { id: string; data: Partial<HotelTypeFormData> }
        >({
            query: ({ id, data }) => ({
                url: `admin/hotel-types/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["HotelType", "HotelTypeStats"],
        }),

        deleteHotelType: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `admin/hotel-types/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["HotelType", "HotelTypeStats"],
        }),

        restoreHotelType: builder.mutation<ApiResponse<HotelType>, string>({
            query: (id) => ({
                url: `admin/hotel-types/${id}/restore/`,
                method: "POST",
            }),
            invalidatesTags: ["HotelType", "HotelTypeStats"],
        }),

        hardDeleteHotelType: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `admin/hotel-types/${id}/hard_delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["HotelType", "HotelTypeStats"],
        }),
    }),
});

export const {
    useGetHotelTypesQuery,
    useGetHotelTypeQuery,
    useGetAdminHotelTypesQuery,
    useGetHotelTypeStatsQuery,
    useCreateHotelTypeMutation,
    useUpdateHotelTypeMutation,
    useDeleteHotelTypeMutation,
    useRestoreHotelTypeMutation,
    useHardDeleteHotelTypeMutation,
} = hotelTypeApi;
