import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wifi, Car, Waves, Dumbbell, Coffee, Tv, Wind, Shield } from "lucide-react"

const amenities = [
  { name: "Free WiFi", icon: Wifi },
  { name: "Free Parking", icon: Car },
  { name: "Swimming Pool", icon: Waves },
  { name: "Fitness Center", icon: Dumbbell },
  { name: "Coffee Machine", icon: Coffee },
  { name: "Smart TV", icon: Tv },
  { name: "Air Conditioning", icon: Wind },
  { name: "Security System", icon: Shield },
]

export function PropertyDetails() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Luxury Beachfront Villa</h1>
          <div className="flex gap-2">
            <Badge>Superhost</Badge>
            <Badge variant="secondary">Entire villa</Badge>
          </div>
        </div>
        <p className="text-gray-600 mb-4">8 guests • 4 bedrooms • 4 beds • 3 bathrooms</p>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">About this place</h2>
        <p className="text-gray-700 leading-relaxed">
          Escape to this stunning beachfront villa offering unparalleled luxury and breathtaking ocean views. This
          meticulously designed property features spacious living areas, a gourmet kitchen, and private beach access.
          Perfect for families or groups seeking an unforgettable coastal retreat with all the modern amenities you
          could desire.
        </p>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
        <div className="grid grid-cols-2 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity.name} className="flex items-center gap-3">
              <amenity.icon className="h-5 w-5 text-gray-600" />
              <span>{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">House Rules</h2>
        <div className="space-y-2 text-gray-700">
          <p>• Check-in: 3:00 PM - 10:00 PM</p>
          <p>• Check-out: 11:00 AM</p>
          <p>• No smoking</p>
          <p>• No pets allowed</p>
          <p>• No parties or events</p>
          <p>• Quiet hours: 10:00 PM - 8:00 AM</p>
        </div>
      </div>
    </div>
  )
}
