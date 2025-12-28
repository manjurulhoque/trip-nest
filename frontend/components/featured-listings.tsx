import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const featuredHotels = [
  {
    id: 1,
    title: "Luxury Beachfront Villa",
    location: "Malibu, California",
    price: 450,
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg?height=300&width=400",
    badge: "Superhost",
  },
  {
    id: 2,
    title: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    price: 280,
    rating: 4.8,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=400",
    badge: "New",
  },
  {
    id: 3,
    title: "Modern City Apartment",
    location: "New York, NY",
    price: 320,
    rating: 4.7,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=400",
    badge: "Popular",
  },
  {
    id: 4,
    title: "Historic Countryside Manor",
    location: "Tuscany, Italy",
    price: 380,
    rating: 4.9,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=400",
    badge: "Superhost",
  },
]

export function FeaturedListings() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={hotel.image || "/placeholder.svg"} alt={hotel.title} className="w-full h-48 object-cover" />
                <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-white text-black">{hotel.badge}</Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg truncate">{hotel.title}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{hotel.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
                <p className="text-sm text-gray-500 mb-3">{hotel.reviews} reviews</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${hotel.price}</span>
                  <span className="text-sm text-gray-500">per night</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
