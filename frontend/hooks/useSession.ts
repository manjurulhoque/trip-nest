import { useSession as useNextAuthSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSession(requireAuth = false) {
    const { data: session, status, update } = useNextAuthSession();
    const router = useRouter();

    useEffect(() => {
        if (requireAuth && status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [requireAuth, status, router]);

    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            // Handle token refresh error (e.g., force sign in)
            router.push("/auth/login");
        }
    }, [session, router]);

    return { session, status, update };
}
