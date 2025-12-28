import { useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { LoginRequest, RegisterRequest, UserDetail } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import {
    isAdmin,
    isHost,
    isGuest,
    isVerifiedHost,
    canListProperties,
    canBookProperties,
    hasPermission,
    hasRole,
} from "@/lib/auth";

export const useAuth = () => {
    const { data: session, status, update } = useSession();
    const { toast } = useToast();
    const router = useRouter();

    // Auth state
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const user = session?.user;

    // Login function
    const login = useCallback(
        async (credentials: LoginRequest) => {
            try {
                const result = await signIn("credentials", {
                    ...credentials,
                    redirect: false,
                });

                if (result?.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error,
                    });
                    return false;
                }

                toast({
                    title: "Success",
                    description: "Login successful!",
                });
                return true;
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description:
                        error.message || "An error occurred during login",
                });
                return false;
            }
        },
        [toast]
    );

    // Register function
    const register = useCallback(
        async (data: RegisterRequest) => {
            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || result.error || "Registration failed"
                    );
                }

                toast({
                    title: "Success",
                    description:
                        "Registration successful! Please login to continue.",
                });

                return result;
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message || "Registration failed",
                });
                throw error;
            }
        },
        [toast]
    );

    // Logout function
    const logout = useCallback(async () => {
        try {
            await signOut({ callbackUrl: "/auth/login" });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Logout failed",
            });
        }
    }, [toast]);

    // Role checking functions
    const isSuperuser = useCallback(() => isAdmin(user), [user]);

    const isHostUser = useCallback(() => isHost(user), [user]);

    const isGuestUser = useCallback(() => isGuest(user), [user]);

    const isVerifiedHostUser = useCallback(() => isVerifiedHost(user), [user]);

    const canListPropertiesUser = useCallback(
        () => canListProperties(user),
        [user]
    );

    const canBookPropertiesUser = useCallback(
        () => canBookProperties(user),
        [user]
    );

    const hasPermissionUser = useCallback(
        (permission: string) => hasPermission(user ?? null, permission),
        [user]
    );

    const hasRoleUser = useCallback(
        (role: string) => hasRole(user ?? null, role),
        [user]
    );

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        isSuperuser,
        isHost: isHostUser,
        isGuest: isGuestUser,
        isVerifiedHost: isVerifiedHostUser,
        canListProperties: canListPropertiesUser,
        canBookProperties: canBookPropertiesUser,
        hasPermission: hasPermissionUser,
        hasRole: hasRoleUser,
        updateSession: update,
    };
};

// Additional hook for auth guards
export const useAuthGuard = () => {
    const { status, data: session } = useSession();
    const user = session?.user as UserDetail | undefined;

    const requireAuth = useCallback(() => {
        if (status === "unauthenticated") {
            window.location.href = "/auth/login";
            return false;
        }
        return status === "authenticated";
    }, [status]);

    const requireGuest = useCallback(() => {
        if (status === "unauthenticated" || (user && user.role !== "guest")) {
            window.location.href = "/dashboard";
            return false;
        }
        return status === "authenticated" && user?.role === "guest";
    }, [status, user]);

    const requireHost = useCallback(() => {
        if (status === "unauthenticated" || (user && user.role !== "host")) {
            window.location.href = "/dashboard";
            return false;
        }
        return status === "authenticated" && user?.role === "host";
    }, [status, user]);

    return {
        requireAuth,
        requireGuest,
        requireHost,
    };
};
