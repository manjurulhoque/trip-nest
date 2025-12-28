import { Card, CardContent } from "@/components/ui/card"

const destinations = [
  {
    name: "Paris",
    country: "France",
    properties: 1234,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Tokyo",
    country: "Japan",
    properties: 987,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "New York",
    country: "USA",
    properties: 2156,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "London",
    country: "UK",
    properties: 1876,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Barcelona",
    country: "Spain",
    properties: 743,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Rome",
    country: "Italy",
    properties: 892,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function PopularDestinations() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <p className="text-sm opacity-90">{destination.country}</p>
                  <p className="text-sm opacity-75">{destination.properties} properties</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
