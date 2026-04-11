"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
} from "@/store/api/wishlistApi";

export interface WishlistToggleButtonProps {
    hotelId: string;
    className?: string;
    /** Use inside clickable parents (e.g. cards wrapped in Link) */
    stopPropagation?: boolean;
}

export function WishlistToggleButton({
    hotelId,
    className,
    stopPropagation = false,
}: WishlistToggleButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const isAuthed = status === "authenticated" && !!session?.accessToken;

    const { data: wishlistRes } = useGetWishlistQuery(undefined, {
        skip: !isAuthed,
    });

    const items = wishlistRes?.data ?? [];
    const isSaved = items.some((w) => w.hotel.id === hotelId);

    const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
    const [removeFromWishlist, { isLoading: isRemoving }] =
        useRemoveFromWishlistMutation();

    const busy = isAdding || isRemoving;

    const handleClick = useCallback(
        async (e: React.MouseEvent) => {
            if (stopPropagation) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (!isAuthed) {
                const callback = pathname || "/";
                router.push(
                    `/auth/login?callbackUrl=${encodeURIComponent(callback)}`
                );
                return;
            }

            try {
                if (isSaved) {
                    await removeFromWishlist(hotelId).unwrap();
                } else {
                    await addToWishlist({ hotelId }).unwrap();
                }
            } catch {
                // RTK surfaces error on hook; optional toast can be added later
            }
        },
        [
            stopPropagation,
            isAuthed,
            pathname,
            router,
            isSaved,
            hotelId,
            addToWishlist,
            removeFromWishlist,
        ]
    );

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
                "bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500",
                isSaved && "text-red-500",
                className
            )}
            onClick={handleClick}
            disabled={busy}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
            <Heart
                className={cn(
                    "h-4 w-4",
                    isSaved && "fill-red-500 text-red-500"
                )}
            />
        </Button>
    );
}
