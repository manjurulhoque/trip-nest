import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, MessageCircle } from "lucide-react"

export function HostInfo() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">Hosted by John Doe</h3>
              <Badge className="bg-pink-100 text-pink-800">Superhost</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                4.9 (156 reviews)
              </div>
              <span>5 years hosting</span>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Identity verified
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Welcome to my beautiful beachfront villa! I'm passionate about providing exceptional experiences for my
              guests. I live nearby and am always available to help make your stay memorable. I love sharing local
              recommendations and ensuring you have everything you need for a perfect vacation.
            </p>
            <div className="flex gap-3">
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Host
              </Button>
              <Button variant="outline">View Profile</Button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-gray-600">Response rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold">1 hour</p>
              <p className="text-sm text-gray-600">Response time</p>
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
