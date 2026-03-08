// User and authentication related types

export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "guest" | "host" | "admin";
    isActive: boolean;
    emailVerified: boolean;
    dateJoined: string;
    lastLogin?: string;
    avatar?: string;
    phone?: string;
    country?: string;
    city?: string;
    dateOfBirth?: string;
    preferredCurrency?: string;
    preferredLanguage?: string;
    isVerifiedHost?: boolean;
    hostApprovalStatus?: "pending" | "approved" | "rejected";
    businessName?: string;
    businessLicense?: string;
    taxId?: string;
    canListProperties?: boolean;
    canBookProperties?: boolean;
    canManageProperties?: boolean;
    canManageBookings?: boolean;
    canManageUsers?: boolean;
    isSuperuser?: boolean;
    isStaff?: boolean;
}

export interface UserProfile {
    id: string;
    user: User;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: "M" | "F" | "O";
    nationality?: string;
    profilePicture?: string;
    bio?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    preferences?: {
        currency?: string;
        language?: string;
        notifications?: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    };
    createdAt: string;
    updatedAt: string;
}

// Authentication types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
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
    userPermissions: Permission[];
    groupPermissions: Permission[];
    isSuperuser: boolean;
    isStaff: boolean;
}

// Profile update types
export interface ProfileUpdateData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: "M" | "F" | "O";
    nationality?: string;
    profilePicture?: string;
    bio?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
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
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

// Additional auth types for the API
export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    token: string;
    password: string;
    passwordConfirm: string;
}

export interface EmailVerificationRequest {
    token: string;
}

export interface SwitchToHostRequest {
    businessName?: string;
    businessAddress?: string;
    businessPhone?: string;
    taxId?: string;
    bankAccount?: string;
    termsAccepted: boolean;
}

export interface UserActivity {
    id: string;
    user: string;
    activityType: string;
    description: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
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
    totalUsers: number;
    activeUsers: number;
    pendingHosts: number;
    approvedHosts: number;
    newRegistrationsToday: number;
    newRegistrationsThisMonth: number;
}

export interface UserFilters {
    search?: string;
    role?: "guest" | "host" | "all";
    status?: "active" | "inactive" | "verified" | "unverified" | "all";
    page?: number;
    pageSize?: number;
}

export interface AdminUserFormData {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: "guest" | "host";
    isActive?: boolean;
    emailVerified?: boolean;
    phone?: string;
    country?: string;
    city?: string;
    hostApprovalStatus?: "pending" | "approved" | "rejected";
    businessName?: string;
}
