"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, MapPin, CalendarIcon, Users } from "lucide-react"
import { useState } from "react"

export function SearchHero() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()

  return (
    <section className="relative bg-gradient-to-r from-primary to-emerald-600 text-white py-20">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Find your next stay</h1>
        <p className="text-xl mb-8 opacity-90">Search deals on hotels, homes, and much more...</p>

        <Card className="max-w-4xl mx-auto p-6 bg-white text-black">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Where are you going?" className="pl-10" />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? checkIn.toDateString() : "Check-in"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? checkOut.toDateString() : "Check-out"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
              </PopoverContent>
            </Popover>

            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="2 adults · 0 children" className="pl-10" />
            </div>
          </div>

          <Button className="w-full mt-4 bg-primary hover:bg-primary/90" size="lg">
            <Search className="mr-2 h-4 w-4" />
            Search Hotels
          </Button>
        </Card>
      </div>
    </section>
  )
}
