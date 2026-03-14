"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutParams } from "@/lib/types/checkout";

function toDateStr(d: Date): string {
    return d.toISOString().slice(0, 10);
}

function parseDateStr(s: string): Date {
    const d = new Date(s);
    return d;
}

interface CheckoutDatesGuestsProps {
    params: CheckoutParams;
    onParamsChange: (updates: Partial<CheckoutParams>) => void;
    minAdults?: number;
    maxAdults?: number;
    maxChildren?: number;
}

export function CheckoutDatesGuests({
    params,
    onParamsChange,
    minAdults = 1,
    maxAdults = 10,
    maxChildren = 10,
}: CheckoutDatesGuestsProps) {
    const checkInDate = parseDateStr(params.checkIn);
    const checkOutDate = parseDateStr(params.checkOut);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minCheckOut = new Date(checkInDate);
    minCheckOut.setDate(minCheckOut.getDate() + 1);

    const handleCheckInSelect = (date: Date | undefined) => {
        if (!date) return;
        const newCheckIn = toDateStr(date);
        onParamsChange({ checkIn: newCheckIn });
        const currentCheckOut = new Date(params.checkOut);
        if (currentCheckOut <= date) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            onParamsChange({ checkOut: toDateStr(nextDay) });
        }
    };

    const handleCheckOutSelect = (date: Date | undefined) => {
        if (!date) return;
        onParamsChange({ checkOut: toDateStr(date) });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Dates &amp; guests
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Check-in</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {params.checkIn
                                        ? parseDateStr(
                                              params.checkIn
                                          ).toLocaleDateString("en-US", {
                                              weekday: "short",
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkInDate}
                                    onSelect={handleCheckInSelect}
                                    disabled={(date) =>
                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Check-out</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {params.checkOut
                                        ? parseDateStr(
                                              params.checkOut
                                          ).toLocaleDateString("en-US", {
                                              weekday: "short",
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkOutDate}
                                    onSelect={handleCheckOutSelect}
                                    disabled={(date) =>
                                        date <= checkInDate ||
                                        date <= new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Adults
                        </Label>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                onClick={() =>
                                    onParamsChange({
                                        adults: Math.max(
                                            minAdults,
                                            params.adults - 1
                                        ),
                                    })
                                }
                                disabled={params.adults <= minAdults}
                            >
                                −
                            </Button>
                            <span className="min-w-[2rem] text-center font-medium">
                                {params.adults}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                onClick={() =>
                                    onParamsChange({
                                        adults: Math.min(
                                            maxAdults,
                                            params.adults + 1
                                        ),
                                    })
                                }
                                disabled={params.adults >= maxAdults}
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Children</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                onClick={() =>
                                    onParamsChange({
                                        children: Math.max(
                                            0,
                                            params.children - 1
                                        ),
                                    })
                                }
                                disabled={params.children <= 0}
                            >
                                −
                            </Button>
                            <span className="min-w-[2rem] text-center font-medium">
                                {params.children}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                onClick={() =>
                                    onParamsChange({
                                        children: Math.min(
                                            maxChildren,
                                            params.children + 1
                                        ),
                                    })
                                }
                                disabled={params.children >= maxChildren}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    {params.adults} adult{params.adults !== 1 ? "s" : ""}
                    {params.children > 0
                        ? `, ${params.children} child${params.children !== 1 ? "ren" : ""}`
                        : ""}{" "}
                    · Total{" "}
                    {params.adults + params.children} guest
                    {params.adults + params.children !== 1 ? "s" : ""}
                </p>
            </CardContent>
        </Card>
    );
}
