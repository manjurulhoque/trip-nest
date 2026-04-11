"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        quote:
            "TripNest made our anniversary trip effortless—from comparing neighborhoods to locking in a flexible rate. Support answered within minutes when we tweaked our dates.",
        name: "Hasina Kulsuma",
        role: "Founder & CEO, Northwind Travel Co.",
        image: "https://picsum.photos/seed/tn-client-1/160/160",
    },
    {
        quote:
            "As a frequent business traveler, I rely on clear amenities and parking filters. This platform actually shows what matters before checkout—not buried in fine print.",
        name: "Marcus Chen",
        role: "Operations Director",
        image: "https://picsum.photos/seed/tn-client-2/160/160",
    },
    {
        quote:
            "We booked a family stay with two rooms and got one invoice and one support thread. That simplicity is rare in hotel booking.",
        name: "Elena Rossi",
        role: "Guest, Milan",
        image: "https://picsum.photos/seed/tn-client-3/160/160",
    },
];

export function HomeTestimonials() {
    const [i, setI] = useState(0);
    const t = testimonials[i];
    const n = testimonials.length;

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-rose-50/80 to-violet-50/40">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl md:text-3xl font-bold uppercase tracking-tight text-slate-800 mb-10 md:mb-14">
                    What our <span className="text-violet-600">clients</span> say
                </h2>
                <div className="max-w-3xl mx-auto relative">
                    <div className="rounded-3xl bg-rose-100/60 border border-rose-200/50 shadow-sm px-6 py-10 md:px-12 md:py-12">
                        <blockquote className="text-slate-700 text-center text-base md:text-lg leading-relaxed mb-8">
                            &ldquo;{t.quote}&rdquo;
                        </blockquote>
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative h-16 w-16 rounded-full overflow-hidden ring-4 ring-white shadow-md">
                                <Image
                                    src={t.image}
                                    alt={t.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-slate-900">{t.name}</p>
                                <p className="text-sm text-slate-600">{t.role}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full border-slate-300"
                            onClick={() => setI((v) => (v - 1 + n) % n)}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2 px-2">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setI(idx)}
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-colors",
                                        idx === i ? "bg-violet-600" : "bg-slate-300"
                                    )}
                                    aria-label={`Go to testimonial ${idx + 1}`}
                                    aria-current={idx === i}
                                />
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full border-slate-300"
                            onClick={() => setI((v) => (v + 1) % n)}
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
