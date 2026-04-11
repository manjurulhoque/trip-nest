import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandCoins, Dumbbell, CarFront } from "lucide-react";

const benefits = [
    {
        icon: HandCoins,
        title: "No advance payment",
        description:
            "Reserve with confidence on eligible stays—pay at the property when it suits your plans, with clear cancellation terms upfront.",
    },
    {
        icon: Dumbbell,
        title: "Anytime gym access",
        description:
            "Many of our partner hotels offer 24-hour fitness centers so you can keep your routine whether you arrive early or late.",
    },
    {
        icon: CarFront,
        title: "Outside car parking",
        description:
            "Driving in? Filter for properties with on-site or nearby parking, including free and discounted options where available.",
    },
];

export function HomeBenefits() {
    return (
        <section id="benefits" className="py-16 md:py-24 bg-slate-50 scroll-mt-20">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl md:text-3xl font-bold uppercase tracking-tight text-slate-800 mb-12 md:mb-16">
                    Popular{" "}
                    <span className="text-violet-600">benefits</span> that we provide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {benefits.map(({ icon: Icon, title, description }) => (
                        <Card
                            key={title}
                            className="border-0 shadow-md hover:shadow-lg transition-shadow rounded-2xl bg-white"
                        >
                            <CardContent className="p-8 text-center">
                                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                    <Icon className="h-7 w-7" aria-hidden />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button
                        asChild
                        className="rounded-full bg-violet-600 hover:bg-violet-700 px-10 uppercase font-semibold tracking-wide"
                    >
                        <Link href="/search">View all</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
