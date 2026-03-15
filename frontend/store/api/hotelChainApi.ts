import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry } from "@/lib/api";
import {
    HotelChain,
    HotelChainFormData,
    HotelChainStats,
} from "@/lib/types/hotel";
import { ApiResponse, PaginatedApiResponse } from "@/lib/types";

export const hotelChainApi = createApi({
    reducerPath: "hotelChainApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["HotelChain", "HotelChainStats"],
    endpoints: (builder) => ({
        // Get all hotel chains
        getHotelChains: builder.query<PaginatedApiResponse<HotelChain>, void>({
            query: () => "hotel-chains/",
            providesTags: ["HotelChain"],
        }),

        // Get single hotel chain
        getHotelChain: builder.query<ApiResponse<HotelChain>, string>({
            query: (id) => `hotel-chains/${id}/`,
            providesTags: (result, error, id) => [{ type: "HotelChain", id }],
        }),

        // Admin endpoints (page_size for loading all data)
        getAdminHotelChains: builder.query<
            PaginatedApiResponse<HotelChain>,
            { page?: number; page_size?: number } | void
        >({
            query: (params) => {
                const p = params ?? {};
                const search = new URLSearchParams();
                if (p.page != null) search.set("page", String(p.page));
                if (p.page_size != null)
                    search.set("page_size", String(p.page_size));
                const q = search.toString();
                return q
                    ? `admin/hotel-chains/?${q}`
                    : "admin/hotel-chains/";
            },
            providesTags: ["HotelChain"],
        }),

        getHotelChainStats: builder.query<ApiResponse<HotelChainStats>, void>({
            query: () => "admin/hotel-chains/stats/",
            providesTags: ["HotelChainStats"],
        }),

        createHotelChain: builder.mutation<
            ApiResponse<HotelChain>,
            HotelChainFormData
        >({
            query: (data) => ({
                url: "admin/hotel-chains/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["HotelChain", "HotelChainStats"],
        }),

        updateHotelChain: builder.mutation<
            ApiResponse<HotelChain>,
            { id: string; data: Partial<HotelChainFormData> }
        >({
            query: ({ id, data }) => ({
                url: `admin/hotel-chains/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["HotelChain", "HotelChainStats"],
        }),

        deleteHotelChain: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `admin/hotel-chains/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["HotelChain", "HotelChainStats"],
        }),

        restoreHotelChain: builder.mutation<ApiResponse<HotelChain>, string>({
            query: (id) => ({
                url: `admin/hotel-chains/${id}/restore/`,
                method: "POST",
            }),
            invalidatesTags: ["HotelChain", "HotelChainStats"],
        }),

        hardDeleteHotelChain: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `admin/hotel-chains/${id}/hard_delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["HotelChain", "HotelChainStats"],
        }),
    }),
});

export const {
    useGetHotelChainsQuery,
    useGetHotelChainQuery,
    useGetAdminHotelChainsQuery,
    useGetHotelChainStatsQuery,
    useCreateHotelChainMutation,
    useUpdateHotelChainMutation,
    useDeleteHotelChainMutation,
    useRestoreHotelChainMutation,
    useHardDeleteHotelChainMutation,
} = hotelChainApi;
