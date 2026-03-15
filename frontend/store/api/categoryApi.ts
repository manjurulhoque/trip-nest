import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry } from "@/lib/api";
import {
    Category,
    CategoryFormData,
    CategoryStats,
} from "@/lib/types/facility";
import { ApiResponse, PaginatedApiResponse } from "@/lib/types";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["Category", "CategoryStats"],
    endpoints: (builder) => ({
        // Get all categories
        getCategories: builder.query<PaginatedApiResponse<Category>, void>({
            query: () => "categories/",
            providesTags: ["Category"],
        }),

        // Get single category
        getCategory: builder.query<ApiResponse<Category>, string>({
            query: (id) => `categories/${id}/`,
            providesTags: (result, error, id) => [{ type: "Category", id }],
        }),

        // Admin endpoints (page_size for loading all data)
        getAdminCategories: builder.query<
            PaginatedApiResponse<Category>,
            { page?: number; page_size?: number } | void
        >({
            query: (params) => {
                const p = params ?? {};
                const search = new URLSearchParams();
                if (p.page != null) search.set("page", String(p.page));
                if (p.page_size != null)
                    search.set("page_size", String(p.page_size));
                const q = search.toString();
                return q ? `admin/categories/?${q}` : "admin/categories/";
            },
            providesTags: ["Category"],
        }),

        getCategoryStats: builder.query<ApiResponse<CategoryStats>, void>({
            query: () => "categories/stats/",
            providesTags: ["CategoryStats"],
        }),

        createCategory: builder.mutation<
            ApiResponse<Category>,
            CategoryFormData
        >({
            query: (data) => ({
                url: "categories/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Category", "CategoryStats"],
        }),

        updateCategory: builder.mutation<
            ApiResponse<Category>,
            { id: string; data: Partial<CategoryFormData> }
        >({
            query: ({ id, data }) => ({
                url: `categories/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Category", id },
                "Category",
                "CategoryStats",
            ],
        }),

        deleteCategory: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `categories/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category", "CategoryStats"],
        }),

        restoreCategory: builder.mutation<ApiResponse<Category>, string>({
            query: (id) => ({
                url: `categories/${id}/restore/`,
                method: "POST",
            }),
            invalidatesTags: ["Category", "CategoryStats"],
        }),

        hardDeleteCategory: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `categories/${id}/hard_delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category", "CategoryStats"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useGetAdminCategoriesQuery,
    useGetCategoryStatsQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useRestoreCategoryMutation,
    useHardDeleteCategoryMutation,
} = categoryApi;
