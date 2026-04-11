"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Star, Heart, MapPin, Trash2, Share } from "lucide-react"
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "@/store/api/wishlistApi"
import CenterLoader from "@/components/loaders/center-loader"

export function WishlistContent() {
    const [removeTargetHotelId, setRemoveTargetHotelId] = useState<string | null>(null)
    const { data, isLoading } = useGetWishlistQuery()
    const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation()

    const items = data?.data || []

    const removeTargetName =
        removeTargetHotelId != null
            ? items.find((i) => i.hotel.id === removeTargetHotelId)?.hotel.name
            : undefined

    const confirmRemove = () => {
        if (!removeTargetHotelId) return
        const hotelId = removeTargetHotelId
        removeFromWishlist(hotelId)
            .unwrap()
            .then(() => setRemoveTargetHotelId(null))
            .catch(() => {
                // Error surfaced by RTK; keep dialog open so user can retry or cancel
            })
    }

    const shareWishlist = async () => {
        const url =
            typeof window !== "undefined" ? window.location.href : ""
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "My TripNest wishlist",
                    text: "Hotels I saved on TripNest",
                    url,
                })
                return
            }
            if (url && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url)
            }
        } catch {
            // User cancelled share or clipboard unavailable
        }
    }

    const getHotelImageUrl = (hotelId: string) => {
        return `https://picsum.photos/seed/hotel-${encodeURIComponent(
            hotelId
        )}/800/480?blur=1`;
    };

    if (isLoading) {
        return <CenterLoader />
    }

    if (!items.length) {
        return (
            <div className="text-center py-16">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Start exploring and save your favorite hotels</p>
                <Button asChild>
                    <Link href="/search">Explore Hotels</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    {items.length} hotel{items.length !== 1 ? "s" : ""} saved
                </p>
                <Button variant="outline" onClick={shareWishlist}>
                    <Share className="h-4 w-4 mr-2" />
                    Share Wishlist
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                            <img
                                src={getHotelImageUrl(item.hotel.id)}
                                alt={item.hotel.name}
                                className="w-full h-48 object-cover"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                                onClick={() => setRemoveTargetHotelId(item.hotel.id)}
                                disabled={isRemoving}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="absolute top-2 left-2">
                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg truncate">{item.hotel.name}</h3>
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm ml-1">{item.hotel.rating ?? "-"}</span>
                                </div>
                            </div>

                            <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{item.hotel.cityName ?? "—"}</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                                <Badge variant="secondary" className="text-xs">
                                    {item.hotel.stars}-Star
                                </Badge>
                            </div>

                            <p className="text-sm text-gray-500 mb-3">
                                {item.hotel.reviewsCount} reviews
                            </p>

                            <Button className="w-full mt-4" asChild>
                                <Link href={`/hotels/${item.hotel.id}`}>View Details</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ConfirmDialog
                open={removeTargetHotelId !== null}
                onOpenChange={(open) => !open && setRemoveTargetHotelId(null)}
                title="Remove from wishlist?"
                description={
                    removeTargetName
                        ? `“${removeTargetName}” will be removed from your saved hotels. You can add it again anytime.`
                        : "This hotel will be removed from your saved hotels. You can add it again anytime."
                }
                confirmLabel="Remove"
                pendingLabel="Removing…"
                confirmVariant="destructive"
                onConfirm={confirmRemove}
                isPending={isRemoving}
            />
        </div>
    )
}
