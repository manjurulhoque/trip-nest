import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Star } from "lucide-react"

const upcomingTrips = [
  {
    id: 1,
    property: "Luxury Beachfront Villa",
    location: "Malibu, California",
    checkIn: "Dec 25, 2024",
    checkOut: "Dec 30, 2024",
    guests: 4,
    total: 2250,
    status: "Confirmed",
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    property: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    checkIn: "Jan 15, 2025",
    checkOut: "Jan 20, 2025",
    guests: 2,
    total: 1400,
    status: "Pending",
    image: "/placeholder.svg?height=100&width=150",
  },
]

const pastTrips = [
  {
    id: 3,
    property: "Modern City Apartment",
    location: "New York, NY",
    checkIn: "Nov 10, 2024",
    checkOut: "Nov 15, 2024",
    guests: 2,
    total: 1600,
    status: "Completed",
    image: "/placeholder.svg?height=100&width=150",
    canReview: true,
  },
]

const wishlistItems = [
  {
    id: 1,
    property: "Historic Countryside Manor",
    location: "Tuscany, Italy",
    price: 380,
    rating: 4.9,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    property: "Seaside Cottage",
    location: "Cornwall, UK",
    price: 220,
    rating: 4.7,
    image: "/placeholder.svg?height=100&width=150",
  },
]

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-gray-600">Manage your trips and discover new places</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="past">Past Trips</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTrips.map((trip) => (
            <Card key={trip.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={trip.image || "/placeholder.svg"}
                    alt={trip.property}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{trip.property}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {trip.location}
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {trip.checkIn} - {trip.checkOut}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{trip.guests} guests</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={trip.status === "Confirmed" ? "default" : "secondary"}>{trip.status}</Badge>
                        <p className="text-lg font-bold mt-2">${trip.total}</p>
                        <p className="text-sm text-gray-500">total</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact Host
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastTrips.map((trip) => (
            <Card key={trip.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={trip.image || "/placeholder.svg"}
                    alt={trip.property}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{trip.property}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {trip.location}
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {trip.checkIn} - {trip.checkOut}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{trip.status}</Badge>
                        <p className="text-lg font-bold mt-2">${trip.total}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Receipt
                      </Button>
                      {trip.canReview && (
                        <Button size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Leave Review
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlistItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.property}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.property}</h4>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.location}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{item.rating}</span>
                        </div>
                        <span className="font-bold">${item.price}/night</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
