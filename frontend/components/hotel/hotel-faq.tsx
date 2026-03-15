"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FAQ_ITEMS = [
    {
        question: "How do I book a hotel on TripNest?",
        answer:
            "Choose your dates and room, then click \"Select Room\" to go to checkout. Enter guest details and complete payment to confirm your reservation. You'll receive a booking confirmation by email.",
    },
    {
        question: "Can I see room availability before booking?",
        answer:
            "Yes. On the hotel page, the \"Available Rooms\" section shows only rooms available for your dates. If no rooms appear, try different dates or check back later.",
    },
    {
        question: "What is the refund policy?",
        answer:
            "Refund terms depend on the rate and property. Non-refundable rates typically do not allow cancellations. Refundable rates usually allow free cancellation up to a certain date; after that, fees may apply. Check the rate rules at checkout.",
    },
    {
        question: "Can I check in early?",
        answer:
            "Standard check-in times vary by property. Early check-in may be possible if the room is ready; contact the hotel directly after booking to request it. Late check-out can sometimes be arranged for a fee.",
    },
    {
        question: "How can I add extra services (e.g. geyser, room service)?",
        answer:
            "After booking, contact the hotel using the details in your confirmation. They can help you add services like geyser, breakfast, or room service, often for an additional charge.",
    },
    {
        question: "Can I get connecting rooms?",
        answer:
            "Many hotels offer connecting or adjoining rooms. Use the \"Special requests\" field at checkout to ask for connecting rooms, or contact the hotel after booking to confirm availability.",
    },
    {
        question: "Can I change my room view (e.g. garden to beach)?",
        answer:
            "View changes depend on availability and the rate you booked. Contact the hotel after booking to request a different view; they may offer an upgrade for an additional fee.",
    },
    {
        question: "Can I book a smoking room?",
        answer:
            "Smoking policies vary by property. Some hotels have designated smoking rooms; many are fully non-smoking. Check the hotel's policy on the property page or contact them before booking.",
    },
    {
        question: "Can I upgrade my room after booking?",
        answer:
            "You can request an upgrade by contacting the hotel directly with your booking reference. Upgrades are subject to availability and may incur an extra charge.",
    },
];

export function HotelFaq() {
    return (
        <section
            aria-labelledby="faq-heading"
            className="mt-12 scroll-mt-8"
        >
            <div className="text-center mb-8">
                <h2
                    id="faq-heading"
                    className="text-3xl font-bold text-foreground"
                >
                    Frequently Asked Questions
                </h2>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Find quick answers to common queries. Simplify your travel
                    planning with our concise and informative FAQ section.
                </p>
            </div>

            <Accordion
                type="single"
                collapsible
                className="w-full space-y-2"
            >
                {FAQ_ITEMS.map((item, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border rounded-lg bg-muted/50 px-4 data-[state=open]:bg-muted/70"
                    >
                        <AccordionTrigger className="hover:no-underline py-4 text-left">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4 pt-0">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <div className="mt-12 rounded-xl bg-primary/5 border border-primary/10 p-8 text-center">
                <h3 className="text-xl font-bold text-foreground">
                    Still have Questions?
                </h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                    Can&apos;t find the answer you&apos;re looking for? Our
                    support team is here to help you 24/7.
                </p>
                <Button asChild className="mt-6" size="lg">
                    <Link href="/contact">Let&apos;s Chat Now</Link>
                </Button>
            </div>
        </section>
    );
}
