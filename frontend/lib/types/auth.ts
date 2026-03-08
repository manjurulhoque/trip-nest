// User Role Types
export type UserRole = "guest" | "host";

export type HostApprovalStatus = "pending" | "approved" | "rejected";

// User Profile Types
export interface UserProfile {
    id: string;
    user: string;
    bio?: string;
    website?: string;
    travelPreferences: Record<string, any>;
    loyaltyPrograms: Record<string, any>;
    hostingExperience?: string;
    propertyTypes: string[];
    instantBooking: boolean;
    profilePublic: boolean;
    showReviews: boolean;
    showContactInfo: boolean;
    createdAt: string;
    updatedAt: string;
}

// Base User Interface
export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    avatar?: string;
    role: UserRole;
    roleDisplay: string;
    dateJoined: string;
    isVerifiedHost: boolean;
}

// Detailed User Interface (for authenticated user)
export interface UserDetail extends User {
    preferredCurrency: string;
    preferredLanguage: string;
    emailVerified: boolean;
    hostApprovalStatus?: HostApprovalStatus;
    businessName?: string;
    businessLicense?: string;
    taxId?: string;
    profile?: UserProfile;
    canListProperties: boolean;
    canBookProperties: boolean;
    isStaff?: boolean;
    isSuperuser?: boolean;
}

// Authentication Request Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    preferredCurrency?: string;
    preferredLanguage?: string;
    role?: UserRole;
    password: string;
    passwordConfirm: string;
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
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    token: string;
    password: string;
    passwordConfirm: string;
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
    activityType: string;
    description: string;
    metadata: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
    updatedAt: string;
}

// Profile Update Types
export interface ProfileUpdateData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    avatar?: string;
    preferredCurrency?: string;
    preferredLanguage?: string;
    businessName?: string;
    businessLicense?: string;
    taxId?: string;
}

// Host Switch Types
export interface SwitchToHostRequest {
    businessName?: string;
    businessLicense?: string;
    taxId?: string;
    hostingExperience?: string;
    propertyTypes?: string[];
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
