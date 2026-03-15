"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, CalendarIcon, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

function formatDateForUrl(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function getDefaultCheckIn(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getDefaultCheckOut(checkIn: Date): Date {
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function SearchHero() {
    const router = useRouter();
    const defaultCheckIn = useMemo(() => getDefaultCheckIn(), []);
    const defaultCheckOut = useMemo(() => getDefaultCheckOut(defaultCheckIn), [defaultCheckIn]);

    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState<Date | undefined>(defaultCheckIn);
    const [checkOut, setCheckOut] = useState<Date | undefined>(defaultCheckOut);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    const handleCheckInSelect = (date: Date | undefined) => {
        setCheckIn(date);
        if (date && checkOut && checkOut <= date) {
            setCheckOut(getDefaultCheckOut(date));
        }
    };

    const handleCheckOutSelect = (date: Date | undefined) => {
        setCheckOut(date);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination.trim()) params.set("q", destination.trim());
        const checkInDate = checkIn ?? defaultCheckIn;
        const checkOutDate = checkOut ?? defaultCheckOut;
        params.set("checkIn", formatDateForUrl(checkInDate));
        params.set("checkOut", formatDateForUrl(checkOutDate));
        params.set("adults", String(adults));
        params.set("children", String(children));
        router.push(`/search?${params.toString()}`);
    };

    const checkInDate = checkIn ?? defaultCheckIn;
    const checkOutDate = checkOut ?? defaultCheckOut;
    const guestsLabel = `${adults} adult${adults !== 1 ? "s" : ""} · ${children} child${children !== 1 ? "ren" : ""}`;

    return (
        <section className="relative bg-gradient-to-r from-primary to-emerald-600 text-white py-20">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Find your next stay</h1>
                <p className="text-xl mb-8 opacity-90">Search deals on hotels, homes, and much more...</p>

                <Card className="max-w-4xl mx-auto p-6 bg-white text-black">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden />
                            <Input
                                placeholder="Where are you going?"
                                className="pl-10"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal w-full">
                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                                    <span className="truncate">{checkInDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkInDate}
                                    onSelect={handleCheckInSelect}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal w-full">
                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                                    <span className="truncate">{checkOutDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={checkOutDate}
                                    onSelect={handleCheckOutSelect}
                                    disabled={(date) => date <= checkInDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal w-full">
                                    <Users className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                                    <span className="truncate">{guestsLabel}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Adults</span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                                            >
                                                −
                                            </Button>
                                            <span className="w-6 text-center tabular-nums">{adults}</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setAdults((a) => a + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Children</span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setChildren((c) => Math.max(0, c - 1))}
                                            >
                                                −
                                            </Button>
                                            <span className="w-6 text-center tabular-nums">{children}</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setChildren((c) => c + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button
                        type="button"
                        className="w-full mt-4 bg-primary hover:bg-primary/90"
                        size="lg"
                        onClick={handleSearch}
                    >
                        <Search className="mr-2 h-4 w-4" aria-hidden />
                        Search Hotels
                    </Button>
                </Card>
            </div>
        </section>
    );
}
