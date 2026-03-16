import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry, API_ENDPOINTS } from "@/lib/api";
import { ApiResponse, PaginatedApiResponse } from "@/lib/types";

export interface CoreCity {
    id: string;
    name: string;
    country: string;
    countryName: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    isPopular: boolean;
    isActive: boolean;
}

export interface CoreCountry {
    id: string;
    name: string;
    code: string;
    currency?: string;
    phoneCode?: string;
    isActive: boolean;
}

export const coreApi = createApi({
    reducerPath: "coreApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["City", "Country"],
    endpoints: (builder) => ({
        getCities: builder.query<
            PaginatedApiResponse<CoreCity>,
            { page?: number; page_size?: number; search?: string } | void
        >({
            query: (params) => {
                const p = params ?? {};
                const search = new URLSearchParams();
                if (p.page != null) search.set("page", String(p.page));
                if (p.page_size != null)
                    search.set("page_size", String(p.page_size));
                if (p.search) search.set("search", p.search);
                const q = search.toString();
                return q
                    ? `${API_ENDPOINTS.CORE.CITIES}?${q}`
                    : API_ENDPOINTS.CORE.CITIES;
            },
            providesTags: ["City"],
        }),

        getCountries: builder.query<
            PaginatedApiResponse<CoreCountry>,
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
                    ? `${API_ENDPOINTS.CORE.COUNTRIES}?${q}`
                    : API_ENDPOINTS.CORE.COUNTRIES;
            },
            providesTags: ["Country"],
        }),

        getAdminCountries: builder.query<
            PaginatedApiResponse<CoreCountry>,
            { page?: number; page_size?: number; search?: string } | void
        >({
            query: (params) => {
                const p = params ?? {};
                const search = new URLSearchParams();
                if (p.page != null) search.set("page", String(p.page));
                if (p.page_size != null)
                    search.set("page_size", String(p.page_size));
                if (p.search) search.set("search", p.search);
                const q = search.toString();
                return q
                    ? `${API_ENDPOINTS.CORE.ADMIN.COUNTRIES}?${q}`
                    : API_ENDPOINTS.CORE.ADMIN.COUNTRIES;
            },
            providesTags: ["Country"],
        }),
    }),
});

export const {
    useGetCitiesQuery,
    useGetCountriesQuery,
    useGetAdminCountriesQuery,
} = coreApi;
