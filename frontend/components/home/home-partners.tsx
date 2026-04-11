const partners = ["Radisson", "Booking.com", "Infinity Hotels", "Marriott", "Hilton"];

export function HomePartners() {
    return (
        <section className="border-b border-slate-200/80 bg-white py-8" aria-label="Partner brands">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
                    {partners.map((name) => (
                        <span
                            key={name}
                            className="text-lg md:text-xl font-semibold text-slate-400 grayscale select-none"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
