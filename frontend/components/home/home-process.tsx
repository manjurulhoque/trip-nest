import Image from "next/image";
import { MapPinned, ClipboardList, Sparkles, CreditCard } from "lucide-react";

const steps = [
    {
        icon: MapPinned,
        title: "Assisting to confirm destination",
        description: "We help you compare cities and neighborhoods so your shortlist matches how you like to travel.",
    },
    {
        icon: ClipboardList,
        title: "Provide details about your desired hotel",
        description: "Share budget, amenities, and dates—we surface stays that fit, without endless tab switching.",
    },
    {
        icon: Sparkles,
        title: "Notifying all benefits",
        description: "See perks clearly: breakfast, parking, flexible rates, and member savings before you commit.",
    },
    {
        icon: CreditCard,
        title: "Transaction",
        description: "Book through a secure flow with instant confirmation and human support when plans change.",
    },
];

const collageImages = [
    { src: "https://picsum.photos/seed/tn-process-1/600/400", alt: "Resort pool area" },
    { src: "https://picsum.photos/seed/tn-process-2/600/400", alt: "Hotel lobby" },
    { src: "https://picsum.photos/seed/tn-process-3/600/400", alt: "Ocean view balcony" },
];

export function HomeProcess() {
    return (
        <section id="about" className="py-16 md:py-24 bg-white scroll-mt-20">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl md:text-3xl font-bold uppercase tracking-tight text-slate-800 mb-12 md:mb-16">
                    The process — how we work
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
                    <ol className="space-y-8">
                        {steps.map(({ icon: Icon, title, description }, i) => (
                            <li key={title} className="flex gap-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                    <Icon className="h-6 w-6" aria-hidden />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                                        Step {i + 1}
                                    </p>
                                    <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="relative col-span-2 aspect-[16/10] rounded-2xl overflow-hidden shadow-md">
                            <Image
                                src={collageImages[0].src}
                                alt={collageImages[0].alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                            <Image
                                src={collageImages[1].src}
                                alt={collageImages[1].alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                            <Image
                                src={collageImages[2].src}
                                alt={collageImages[2].alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 50vw, 25vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
