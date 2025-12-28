import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry, API_ENDPOINTS } from "@/lib/api";
import {
    UserDetail,
    PasswordChangeRequest,
    ProfileUpdateData,
    PasswordResetRequest,
    PasswordResetConfirmRequest,
    EmailVerificationRequest,
    SwitchToHostRequest,
    UserActivity,
} from "@/lib/types/auth";
import {
    User,
    UserListResponse,
    AdminUserStats,
    UserFilters,
    AdminUserFormData,
} from "@/lib/types/user";
import { ApiResponse, PaginatedApiResponse } from "@/lib/types/http";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithRetry,
    tagTypes: ["User", "Profile", "Activity"],
    endpoints: (builder) => ({
        // Profile endpoints
        getCurrentUser: builder.query<ApiResponse<UserDetail>, void>({
            query: () => API_ENDPOINTS.AUTH.PROFILE,
            providesTags: ["User"],
        }),

        updateProfile: builder.mutation<
            ApiResponse<UserDetail>,
            ProfileUpdateData
        >({
            query: (updates) => ({
                url: API_ENDPOINTS.AUTH.PROFILE,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["User", "Profile"],
        }),

        // Password management
        changePassword: builder.mutation<
            ApiResponse<{ message: string }>,
            PasswordChangeRequest
        >({
            query: (passwords) => ({
                url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
                method: "POST",
                body: passwords,
            }),
        }),

        requestPasswordReset: builder.mutation<
            ApiResponse<{ message: string }>,
            PasswordResetRequest
        >({
            query: (email) => ({
                url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
                method: "POST",
                body: email,
            }),
        }),

        confirmPasswordReset: builder.mutation<
            ApiResponse<{ message: string }>,
            PasswordResetConfirmRequest
        >({
            query: (resetData) => ({
                url: API_ENDPOINTS.AUTH.RESET_PASSWORD_CONFIRM,
                method: "POST",
                body: resetData,
            }),
        }),

        // Email verification
        verifyEmail: builder.mutation<
            ApiResponse<{ message: string }>,
            EmailVerificationRequest
        >({
            query: (token) => ({
                url: API_ENDPOINTS.AUTH.VERIFY_EMAIL,
                method: "POST",
                body: token,
            }),
            invalidatesTags: ["User"],
        }),

        resendVerificationEmail: builder.mutation<
            ApiResponse<{ message: string }>,
            void
        >({
            query: () => ({
                url: API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
                method: "POST",
            }),
        }),

        // Role management
        switchToHost: builder.mutation<
            ApiResponse<UserDetail>,
            SwitchToHostRequest
        >({
            query: (hostData) => ({
                url: API_ENDPOINTS.AUTH.SWITCH_TO_HOST,
                method: "POST",
                body: hostData,
            }),
            invalidatesTags: ["User", "Profile"],
        }),

        getUserRoleInfo: builder.query<
            ApiResponse<{
                role: string;
                can_list_properties: boolean;
                can_book_properties: boolean;
                host_approval_status?: string;
            }>,
            void
        >({
            query: () => API_ENDPOINTS.AUTH.ROLE_INFO,
            providesTags: ["User"],
        }),

        // Dashboard stats
        getHostDashboardStats: builder.query<
            ApiResponse<{
                total_properties: number;
                active_bookings: number;
                total_earnings: number;
                pending_reviews: number;
                recent_activities: any[];
            }>,
            void
        >({
            query: () => API_ENDPOINTS.AUTH.HOST_DASHBOARD,
            providesTags: ["User"],
        }),

        getGuestDashboardStats: builder.query<
            ApiResponse<{
                total_bookings: number;
                upcoming_trips: number;
                past_trips: number;
                favorite_properties: number;
                recent_activities: any[];
            }>,
            void
        >({
            query: () => API_ENDPOINTS.AUTH.GUEST_DASHBOARD,
            providesTags: ["User"],
        }),

        // Activity tracking
        getUserActivities: builder.query<
            PaginatedApiResponse<UserActivity>,
            { page?: number; page_size?: number }
        >({
            query: ({ page = 1, page_size = 20 } = {}) => ({
                url: API_ENDPOINTS.AUTH.USER_ACTIVITY,
                params: { page, page_size },
            }),
            providesTags: ["Activity"],
        }),

        // Account management
        deactivateAccount: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: API_ENDPOINTS.AUTH.DEACTIVATE_ACCOUNT,
                method: "DELETE",
            }),
            invalidatesTags: ["User", "Profile", "Activity"],
        }),

        // Profile status
        getProfileStatus: builder.query<
            {
                profile_completion: number;
                missing_fields: string[];
                verification_status: {
                    email_verified: boolean;
                    phone_verified?: boolean;
                    identity_verified?: boolean;
                };
                recommendations: string[];
            },
            void
        >({
            query: () => API_ENDPOINTS.AUTH.PROFILE_STATUS,
            providesTags: ["Profile"],
        }),

        // Admin user management endpoints
        getAdminUsers: builder.query<
            ApiResponse<UserListResponse>,
            UserFilters
        >({
            query: (filters = {}) => {
                const params = new URLSearchParams();
                if (filters.search) params.append("search", filters.search);
                if (filters.role && filters.role !== "all")
                    params.append("role", filters.role);
                if (filters.page)
                    params.append("page", filters.page.toString());
                if (filters.page_size)
                    params.append("page_size", filters.page_size.toString());

                // Handle status filters
                if (filters.status && filters.status !== "all") {
                    if (filters.status === "active")
                        params.append("is_active", "true");
                    else if (filters.status === "inactive")
                        params.append("is_active", "false");
                    else if (filters.status === "verified")
                        params.append("email_verified", "true");
                    else if (filters.status === "unverified")
                        params.append("email_verified", "false");
                }

                return {
                    url: "users/users/",
                    params,
                };
            },
            providesTags: ["User"],
        }),

        getUserStats: builder.query<ApiResponse<AdminUserStats>, void>({
            query: () => "users/users/stats/",
            providesTags: ["User"],
        }),

        updateUser: builder.mutation<
            ApiResponse<User>,
            { id: string; data: AdminUserFormData }
        >({
            query: ({ id, data }) => ({
                url: `users/users/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        toggleUserStatus: builder.mutation<ApiResponse<User>, string>({
            query: (id) => ({
                url: `users/users/${id}/toggle-status/`,
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),

        approveHost: builder.mutation<
            ApiResponse<User>,
            { id: string; approved: boolean; notes?: string }
        >({
            query: ({ id, approved, notes }) => ({
                url: `users/users/${id}/approve_host/`,
                method: "POST",
                body: {
                    host_approval_status: approved ? "approved" : "rejected",
                    notes,
                },
            }),
            invalidatesTags: ["User"],
        }),

        getPendingHosts: builder.query<ApiResponse<User[]>, void>({
            query: () => "users/users/pending_hosts/",
            providesTags: ["User"],
        }),
    }),
});

export const {
    // Profile
    useGetCurrentUserQuery,
    useUpdateProfileMutation,

    // Password management
    useChangePasswordMutation,
    useRequestPasswordResetMutation,
    useConfirmPasswordResetMutation,

    // Email verification
    useVerifyEmailMutation,
    useResendVerificationEmailMutation,

    // Role management
    useSwitchToHostMutation,
    useGetUserRoleInfoQuery,

    // Dashboard
    useGetHostDashboardStatsQuery,
    useGetGuestDashboardStatsQuery,

    // Activity
    useGetUserActivitiesQuery,

    // Account management
    useDeactivateAccountMutation,

    // Profile status
    useGetProfileStatusQuery,

    // Admin user management
    useGetAdminUsersQuery,
    useGetUserStatsQuery,
    useUpdateUserMutation,
    useToggleUserStatusMutation,
    useApproveHostMutation,
    useGetPendingHostsQuery,
} = authApi;
