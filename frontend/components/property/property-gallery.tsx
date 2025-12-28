"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react"

const images = [
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
]

export function PropertyGallery() {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-2 h-96">
        <div className="col-span-2 relative">
          <img
            src={images[currentImage] || "/placeholder.svg"}
            alt="Property main view"
            className="w-full h-full object-cover rounded-l-lg"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
              alt={`Property view ${index + 2}`}
              className="w-full h-full object-cover rounded-r-lg cursor-pointer hover:opacity-80"
              onClick={() => setCurrentImage(index + 1)}
            />
          ))}
        </div>
      </div>
      <Button variant="outline" className="absolute bottom-4 right-4 bg-white">
        <Grid3X3 className="h-4 w-4 mr-2" />
        Show all photos
      </Button>
    </div>
  )
}
