"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin, Trash2, Share } from "lucide-react"

const wishlistItems = [
  {
    id: 1,
    name: "Grand Luxury Hotel & Resort",
    location: "San Francisco, CA",
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviews: 2847,
    image: "/placeholder.svg?height=200&width=300",
    badges: ["5-Star", "Luxury"],
    addedDate: "Dec 15, 2024",
  },
  {
    id: 2,
    name: "Seaside Boutique Hotel",
    location: "Monterey, CA",
    price: 189,
    rating: 4.6,
    reviews: 1234,
    image: "/placeholder.svg?height=200&width=300",
    badges: ["Beachfront", "Romantic"],
    addedDate: "Dec 10, 2024",
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Lake Tahoe, CA",
    price: 159,
    originalPrice: 199,
    rating: 4.7,
    reviews: 892,
    image: "/placeholder.svg?height=200&width=300",
    badges: ["Mountain View", "Ski Resort"],
    addedDate: "Dec 5, 2024",
  },
  {
    id: 4,
    name: "Urban Chic Hotel",
    location: "Los Angeles, CA",
    price: 229,
    rating: 4.5,
    reviews: 1567,
    image: "/placeholder.svg?height=200&width=300",
    badges: ["Modern", "City Center"],
    addedDate: "Nov 28, 2024",
  },
]

export function WishlistContent() {
  const [items, setItems] = useState(wishlistItems)

  const removeFromWishlist = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const shareWishlist = () => {
    // Handle sharing logic
    console.log("Sharing wishlist...")
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-6">Start exploring and save your favorite hotels</p>
        <Button>Explore Hotels</Button>
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
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                onClick={() => removeFromWishlist(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="absolute top-2 left-2">
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm ml-1">{item.rating}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{item.location}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {item.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-gray-500 mb-3">Added {item.addedDate}</p>
              <p className="text-xs text-gray-500 mb-3">{item.reviews} reviews</p>

              <div className="flex items-center justify-between">
                <div>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through mr-2">${item.originalPrice}</span>
                  )}
                  <span className="text-lg font-bold text-primary">${item.price}</span>
                  <span className="text-sm text-gray-500 ml-1">per night</span>
                </div>
              </div>

              <Button className="w-full mt-4">Book Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
