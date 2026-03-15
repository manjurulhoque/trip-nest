import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry, API_ENDPOINTS } from "@/lib/api";
import type {
    Booking,
    CreateBookingData,
    ApiResponse,
    PaginatedApiResponse,
} from "@/lib/types";

export const bookingApi = createApi({
    reducerPath: "bookingApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["Booking"],
    endpoints: (builder) => ({
        getBookings: builder.query<
            PaginatedApiResponse<Booking>,
            { page?: number; status?: string }
        >({
            query: ({ page = 1, status }) => {
                const params = new URLSearchParams();
                params.set("page", String(page));
                if (status) params.set("status", status);
                return `${API_ENDPOINTS.BOOKINGS.BASE}?${params.toString()}`;
            },
            providesTags: (result) =>
                result?.data?.results
                    ? [
                          ...result.data.results.map(({ id }) => ({
                              type: "Booking" as const,
                              id,
                          })),
                          { type: "Booking", id: "LIST" },
                      ]
                    : [{ type: "Booking", id: "LIST" }],
        }),

        getBooking: builder.query<ApiResponse<Booking>, string>({
            query: (id) => API_ENDPOINTS.BOOKINGS.DETAIL(id),
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),

        createBooking: builder.mutation<ApiResponse<Booking>, CreateBookingData>({
            query: (body) => ({
                url: API_ENDPOINTS.BOOKINGS.BASE,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Booking", id: "LIST" }],
        }),

        cancelBooking: builder.mutation<
            ApiResponse<Booking>,
            { id: string; cancellationReason?: string }
        >({
            query: ({ id, cancellationReason }) => ({
                url: API_ENDPOINTS.BOOKINGS.CANCEL(id),
                method: "POST",
                body: cancellationReason
                    ? { cancellationReason }
                    : undefined,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Booking", id },
                { type: "Booking", id: "LIST" },
            ],
        }),

        completePayment: builder.mutation<ApiResponse<Booking>, { id: string }>({
            query: ({ id }) => ({
                url: API_ENDPOINTS.BOOKINGS.COMPLETE_PAYMENT(id),
                method: "POST",
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Booking", id },
                { type: "Booking", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetBookingsQuery,
    useGetBookingQuery,
    useCreateBookingMutation,
    useCancelBookingMutation,
    useCompletePaymentMutation,
} = bookingApi;
