import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry } from "@/lib/api";
import {
    Facility,
    FacilityFormData,
    FacilityStats,
} from "@/lib/types/facility";
import { ApiResponse, PaginatedApiResponse } from "@/lib/types";

export const facilityApi = createApi({
    reducerPath: "facilityApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["Facility", "FacilityStats"],
    endpoints: (builder) => ({
        // Get all facilities
        getFacilities: builder.query<PaginatedApiResponse<Facility>, void>({
            query: () => "facilities/",
            providesTags: ["Facility"],
        }),

        // Get popular facilities
        getPopularFacilities: builder.query<ApiResponse<Facility[]>, void>({
            query: () => "facilities/popular/",
        }),

        // Admin endpoints
        getAdminFacilities: builder.query<PaginatedApiResponse<Facility>, void>(
            {
                query: () => "admin/facilities/",
                providesTags: ["Facility"],
            }
        ),

        getFacilityStats: builder.query<ApiResponse<FacilityStats>, void>({
            query: () => "admin/facilities/stats/",
            providesTags: ["FacilityStats"],
        }),

        createFacility: builder.mutation<
            ApiResponse<Facility>,
            FacilityFormData
        >({
            query: (data) => ({
                url: "admin/facilities/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Facility", "FacilityStats"],
        }),

        updateFacility: builder.mutation<
            ApiResponse<Facility>,
            { id: number; data: Partial<FacilityFormData> }
        >({
            query: ({ id, data }) => ({
                url: `admin/facilities/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Facility", "FacilityStats"],
        }),

        deleteFacility: builder.mutation<ApiResponse<void>, number>({
            query: (id) => ({
                url: `admin/facilities/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Facility", "FacilityStats"],
        }),

        restoreFacility: builder.mutation<ApiResponse<Facility>, number>({
            query: (id) => ({
                url: `admin/facilities/${id}/restore/`,
                method: "POST",
            }),
            invalidatesTags: ["Facility", "FacilityStats"],
        }),

        hardDeleteFacility: builder.mutation<ApiResponse<void>, number>({
            query: (id) => ({
                url: `admin/facilities/${id}/hard_delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Facility", "FacilityStats"],
        }),
    }),
});

export const {
    useGetFacilitiesQuery,
    useGetPopularFacilitiesQuery,
    useGetAdminFacilitiesQuery,
    useGetFacilityStatsQuery,
    useCreateFacilityMutation,
    useUpdateFacilityMutation,
    useDeleteFacilityMutation,
    useRestoreFacilityMutation,
    useHardDeleteFacilityMutation,
} = facilityApi;
