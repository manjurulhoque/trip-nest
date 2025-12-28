"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Users, Star } from "lucide-react"

export function PropertyBooking() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("2")

  const basePrice = 450
  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0
  const subtotal = basePrice * nights
  const serviceFee = subtotal * 0.12
  const taxes = subtotal * 0.08
  const total = subtotal + serviceFee + taxes

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">${basePrice}</span>
            <span className="text-gray-600 ml-1">per night</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-semibold">4.9</span>
            <span className="text-sm text-gray-500 ml-1">(127 reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
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
        </div>

        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger>
            <Users className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 guest</SelectItem>
            <SelectItem value="2">2 guests</SelectItem>
            <SelectItem value="3">3 guests</SelectItem>
            <SelectItem value="4">4 guests</SelectItem>
            <SelectItem value="5">5 guests</SelectItem>
            <SelectItem value="6">6 guests</SelectItem>
            <SelectItem value="7">7 guests</SelectItem>
            <SelectItem value="8">8 guests</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full" size="lg" disabled={!checkIn || !checkOut}>
          Reserve
        </Button>

        <p className="text-center text-sm text-gray-600">You won't be charged yet</p>

        {nights > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  ${basePrice} × {nights} nights
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
