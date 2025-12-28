import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Star } from "lucide-react"

export function BookingSummary() {
  const bookingDetails = {
    hotel: "Grand Luxury Hotel & Resort",
    room: "Deluxe King Room",
    checkIn: "Dec 25, 2024",
    checkOut: "Dec 30, 2024",
    nights: 5,
    guests: 2,
    roomPrice: 299,
    taxes: 89.7,
    serviceFee: 35.88,
    total: 1583.58,
    rating: 4.8,
    reviews: 2847,
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <img
              src="/placeholder.svg?height=80&width=120"
              alt={bookingDetails.hotel}
              className="w-20 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{bookingDetails.hotel}</h3>
              <p className="text-sm text-gray-600">{bookingDetails.room}</p>
              <div className="flex items-center mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-xs">
                  {bookingDetails.rating} ({bookingDetails.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            Downtown San Francisco, CA
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              Check-in
            </div>
            <span className="text-sm font-medium">{bookingDetails.checkIn}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              Check-out
            </div>
            <span className="text-sm font-medium">{bookingDetails.checkOut}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              Guests
            </div>
            <span className="text-sm font-medium">{bookingDetails.guests} adults</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Duration</span>
            <Badge variant="secondary">{bookingDetails.nights} nights</Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-semibold">Price Breakdown</h4>

          <div className="flex justify-between text-sm">
            <span>
              ${bookingDetails.roomPrice} × {bookingDetails.nights} nights
            </span>
            <span>${(bookingDetails.roomPrice * bookingDetails.nights).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Taxes and fees</span>
            <span>${bookingDetails.taxes}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Service fee</span>
            <span>${bookingDetails.serviceFee}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">${bookingDetails.total}</span>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary">Free Cancellation</Badge>
          </div>
          <p className="text-xs text-gray-600">
            Cancel for free until 24 hours before check-in. After that, cancel before Dec 23 for a partial refund.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
