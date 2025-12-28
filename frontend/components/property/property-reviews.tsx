import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "December 2024",
    rating: 5,
    content:
      "Absolutely stunning property with incredible ocean views! The villa exceeded all our expectations. Everything was pristine and the host was incredibly responsive.",
    helpful: 12,
  },
  {
    id: 2,
    author: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "November 2024",
    rating: 5,
    content:
      "Perfect location and amazing amenities. The private beach access was a game-changer for our family vacation. Highly recommend!",
    helpful: 8,
  },
  {
    id: 3,
    author: "Emma Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "October 2024",
    rating: 4,
    content:
      "Beautiful property with great facilities. The only minor issue was the WiFi speed, but everything else was perfect. Would definitely stay again.",
    helpful: 5,
  },
]

const ratingBreakdown = [
  { stars: 5, count: 89, percentage: 70 },
  { stars: 4, count: 28, percentage: 22 },
  { stars: 3, count: 7, percentage: 6 },
  { stars: 2, count: 2, percentage: 1 },
  { stars: 1, count: 1, percentage: 1 },
]

export function PropertyReviews() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="flex items-center">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-xl font-semibold">4.9</span>
          <span className="text-gray-600 ml-1">(127 reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Rating Breakdown</h3>
          <div className="space-y-3">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm w-6">{item.stars}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <Progress value={item.percentage} className="flex-1" />
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {reviews.slice(0, 2).map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{review.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{review.author}</h4>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{review.date}</p>
                      <p className="text-sm">{review.content}</p>
                      <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        Show all 127 reviews
      </Button>
    </div>
  )
}
