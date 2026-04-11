"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, CalendarIcon, Users, Star, Bed } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
        <section className="relative min-h-[min(88vh,920px)] w-full overflow-hidden bg-slate-900">
            <Image
                src="/images/hero-banner.jpg"
                alt="Luxury tropical resort pool at golden hour"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/20" aria-hidden />

            <div className="relative z-10 container mx-auto px-4 pt-10 pb-44 md:pb-48 lg:pb-52">
                <div className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 flex-col gap-3">
                    <Button
                        type="button"
                        asChild
                        size="sm"
                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md border-0"
                    >
                        <Link href="#benefits" className="gap-2">
                            <Star className="h-4 w-4 shrink-0" aria-hidden />
                            Outstanding Services
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        asChild
                        size="sm"
                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md border-0"
                    >
                        <Link href="#popular-rooms" className="gap-2">
                            <Bed className="h-4 w-4 shrink-0" aria-hidden />
                            Rooms
                        </Link>
                    </Button>
                </div>

                <div className="max-w-4xl mx-auto text-center pt-6 md:pt-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-bold tracking-tight text-white leading-tight uppercase">
                        Explore your{" "}
                        <span className="relative inline-block px-3 py-0.5 mx-1">
                            <span
                                className="absolute inset-0 rounded-full border-2 border-primary -rotate-1"
                                aria-hidden
                            />
                            <span className="relative text-primary">dream</span>
                        </span>{" "}
                        hotel all over the world
                    </h1>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 md:pb-10">
                <Card className="max-w-5xl mx-auto rounded-2xl border-0 shadow-xl bg-white p-4 md:p-6 text-foreground">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 lg:items-end">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Search location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                                <Input
                                    placeholder="City, region, or hotel"
                                    className="pl-10 h-11 rounded-xl border-slate-200"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Check in
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "justify-start text-left font-normal w-full h-11 rounded-xl border-slate-200"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                                        <span className="truncate">
                                            {checkInDate.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
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
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Check out
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start text-left font-normal w-full h-11 rounded-xl border-slate-200"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                                        <span className="truncate">
                                            {checkOutDate.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
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
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Guests
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start text-left font-normal w-full h-11 rounded-xl border-slate-200"
                                    >
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

                        <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                            <Button
                                type="button"
                                className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 font-semibold uppercase tracking-wide shadow-md"
                                onClick={handleSearch}
                            >
                                Book now
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}
