// User and authentication related types

export interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "guest" | "host" | "admin";
    is_active: boolean;
    email_verified: boolean;
    date_joined: string;
    last_login?: string;
    avatar?: string;
    phone?: string;
    country?: string;
    city?: string;
    date_of_birth?: string;
    preferred_currency?: string;
    preferred_language?: string;
    is_verified_host?: boolean;
    host_approval_status?: "pending" | "approved" | "rejected";
    business_name?: string;
    business_license?: string;
    tax_id?: string;
    can_list_properties?: boolean;
    can_book_properties?: boolean;
    can_manage_properties?: boolean;
    can_manage_bookings?: boolean;
    can_manage_users?: boolean;
    is_superuser?: boolean;
    is_staff?: boolean;
}

export interface UserProfile {
    id: string;
    user: User;
    phone_number?: string;
    date_of_birth?: string;
    gender?: "M" | "F" | "O";
    nationality?: string;
    profile_picture?: string;
    bio?: string;
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    preferences?: {
        currency?: string;
        language?: string;
        notifications?: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    };
    created_at: string;
    updated_at: string;
}

// Authentication types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    role?: "guest" | "host";
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginResponse {
    user: User;
    access: string;
    refresh: string;
    message: string;
}

export interface RegisterResponse {
    user: User;
    message: string;
}

export interface LogoutRequest {
    refresh: string;
}

export interface RefreshTokenRequest {
    refresh: string;
}

export interface RefreshTokenResponse {
    access: string;
    refresh?: string;
}

// Auth state types
export interface AuthState {
    isLoading: boolean;
    error: string | null;
}

// Permission types
export type UserRole = "guest" | "host" | "admin";

export interface Permission {
    id: string;
    name: string;
    codename: string;
}

export interface UserPermissions {
    user_permissions: Permission[];
    group_permissions: Permission[];
    is_superuser: boolean;
    is_staff: boolean;
}

// Profile update types
export interface ProfileUpdateData {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    date_of_birth?: string;
    gender?: "M" | "F" | "O";
    nationality?: string;
    profile_picture?: string;
    bio?: string;
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    preferences?: {
        currency?: string;
        language?: string;
        notifications?: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    };
}

export interface PasswordChangeData {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
}

// Additional auth types for the API
export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    token: string;
    password: string;
    password_confirm: string;
}

export interface EmailVerificationRequest {
    token: string;
}

export interface SwitchToHostRequest {
    business_name?: string;
    business_address?: string;
    business_phone?: string;
    tax_id?: string;
    bank_account?: string;
    terms_accepted: boolean;
}

export interface UserActivity {
    id: string;
    user: string;
    activity_type: string;
    description: string;
    metadata?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

// API response types
export interface UserListResponse {
    results: User[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface ProfileResponse {
    user: User;
    profile: UserProfile;
}

// Admin user management types
export interface AdminUserStats {
    total_users: number;
    active_users: number;
    pending_hosts: number;
    approved_hosts: number;
    new_registrations_today: number;
    new_registrations_this_month: number;
}

export interface UserFilters {
    search?: string;
    role?: "guest" | "host" | "all";
    status?: "active" | "inactive" | "verified" | "unverified" | "all";
    page?: number;
    page_size?: number;
}

export interface AdminUserFormData {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: "guest" | "host";
    is_active?: boolean;
    email_verified?: boolean;
    phone?: string;
    country?: string;
    city?: string;
    host_approval_status?: "pending" | "approved" | "rejected";
    business_name?: string;
}
