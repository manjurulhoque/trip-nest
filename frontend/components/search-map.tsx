import { Card, CardContent } from "@/components/ui/card"

export function SearchMap() {
  return (
    <Card className="h-96">
      <CardContent className="p-0 h-full">
        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Interactive Map View</p>
        </div>
      </CardContent>
    </Card>
  )
}
