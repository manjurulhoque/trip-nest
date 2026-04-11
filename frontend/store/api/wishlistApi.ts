import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry, API_ENDPOINTS } from "@/lib/api";
import { ApiResponse, WishlistItem } from "@/lib/types";

export const wishlistApi = createApi({
    reducerPath: "wishlistApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["Wishlist"],
    endpoints: (builder) => ({
        getWishlist: builder.query<ApiResponse<WishlistItem[]>, void>({
            query: () => API_ENDPOINTS.WISHLIST.BASE,
            providesTags: ["Wishlist"],
        }),

        addToWishlist: builder.mutation<
            ApiResponse<WishlistItem>,
            { hotelId: string; notes?: string }
        >({
            query: (body) => ({
                url: API_ENDPOINTS.WISHLIST.BASE,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Wishlist"],
        }),

        removeFromWishlist: builder.mutation<ApiResponse<unknown>, string>({
            query: (hotelId) => ({
                url: API_ENDPOINTS.WISHLIST.BASE,
                method: "DELETE",
                body: { hotelId },
            }),
            invalidatesTags: ["Wishlist"],
        }),
    }),
});

export const {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
} = wishlistApi;

