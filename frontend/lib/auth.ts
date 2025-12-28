import { UserDetail } from "./types/auth";
import { getSession, signOut } from "next-auth/react";

// Role checking utilities
export const isAdmin = (user?: UserDetail | null): boolean =>
    user?.is_superuser || false;
export const isHost = (user?: UserDetail | null): boolean =>
    user?.role === "host";
export const isGuest = (user?: UserDetail | null): boolean =>
    user?.role === "guest";
export const isVerifiedHost = (user?: UserDetail | null): boolean =>
    user?.is_verified_host || false;
export const canListProperties = (user?: UserDetail | null): boolean =>
    user?.can_list_properties || false;
export const canBookProperties = (user?: UserDetail | null): boolean =>
    user?.can_book_properties || false;

// Permission checking utilities
export const hasPermission = (
    user: UserDetail | null,
    permission: string
): boolean => {
    if (!user) return false;
    return true; // TODO: Implement permission checking
};

export const hasRole = (user: UserDetail | null, role: string): boolean => {
    if (!user) return false;
    return user.role === role;
};

// Session utilities
export const getCurrentUser = async (): Promise<UserDetail | null> => {
    const session = await getSession();
    return session?.user || null;
};

// Get user initials for avatar fallback
export const getInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName && !lastName) return "U";
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}`;
};

// Auth utilities
export const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
};
