// User Role Types
export type UserRole = "guest" | "host";

export type HostApprovalStatus = "pending" | "approved" | "rejected";

// User Profile Types
export interface UserProfile {
    id: string;
    user: string;
    bio?: string;
    website?: string;
    travel_preferences: Record<string, any>;
    loyalty_programs: Record<string, any>;
    hosting_experience?: string;
    property_types: string[];
    instant_booking: boolean;
    profile_public: boolean;
    show_reviews: boolean;
    show_contact_info: boolean;
    created_at: string;
    updated_at: string;
}

// Base User Interface
export interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone?: string;
    date_of_birth?: string;
    country?: string;
    city?: string;
    avatar?: string;
    role: UserRole;
    role_display: string;
    date_joined: string;
    is_verified_host: boolean;
}

// Detailed User Interface (for authenticated user)
export interface UserDetail extends User {
    preferred_currency: string;
    preferred_language: string;
    email_verified: boolean;
    host_approval_status?: HostApprovalStatus;
    business_name?: string;
    business_license?: string;
    tax_id?: string;
    profile?: UserProfile;
    can_list_properties: boolean;
    can_book_properties: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
}

// Authentication Request Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone?: string;
    date_of_birth?: string;
    country?: string;
    city?: string;
    preferred_currency?: string;
    preferred_language?: string;
    role?: UserRole;
    password: string;
    password_confirm: string;
}

// Authentication Response Types
export interface LoginResponse {
    user: UserDetail;
    access: string;
    refresh: string;
    message: string;
}

export interface RegisterResponse {
    user: UserDetail;
    message: string;
}

// Password Management Types
export interface PasswordChangeRequest {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    token: string;
    password: string;
    password_confirm: string;
}

// Email Verification Types
export interface EmailVerificationRequest {
    token: string;
}

// Auth State Types
export interface AuthState {
    isLoading: boolean;
    error: string | null;
}

// User Activity Types
export interface UserActivity {
    id: string;
    user: User;
    activity_type: string;
    description: string;
    metadata: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
    updated_at: string;
}

// Profile Update Types
export interface ProfileUpdateData {
    first_name?: string;
    last_name?: string;
    phone?: string;
    date_of_birth?: string;
    country?: string;
    city?: string;
    avatar?: string;
    preferred_currency?: string;
    preferred_language?: string;
    business_name?: string;
    business_license?: string;
    tax_id?: string;
}

// Host Switch Types
export interface SwitchToHostRequest {
    business_name?: string;
    business_license?: string;
    tax_id?: string;
    hosting_experience?: string;
    property_types?: string[];
}

// Next-Auth Types
declare module "next-auth" {
    interface Session {
        user: UserDetail;
        accessToken: string;
        error?: string;
    }

    interface JWT {
        accessToken: string;
        refreshToken: string;
        user: UserDetail;
        error?: string;
    }
}
