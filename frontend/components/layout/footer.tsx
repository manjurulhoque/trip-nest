import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer id="contact" className="bg-slate-100 border-t border-slate-200/80 scroll-mt-20">
            <div className="container mx-auto px-4 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <p className="text-2xl font-bold text-primary tracking-tight">TripNest</p>
                        <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
                            Discover and book hotels worldwide with transparent pricing, verified listings, and
                            flexible stays tailored to how you travel.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a
                                href="https://facebook.com"
                                className="text-slate-500 hover:text-primary transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                className="text-slate-500 hover:text-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                className="text-slate-500 hover:text-primary transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                className="text-slate-500 hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://youtube.com"
                                className="text-slate-500 hover:text-primary transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">About</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <Link href="/#about" className="hover:text-primary">
                                    How we work
                                </Link>
                            </li>
                            <li>
                                <Link href="/search" className="hover:text-primary">
                                    Browse stays
                                </Link>
                            </li>
                            <li>
                                <Link href="/host" className="hover:text-primary">
                                    Become a host
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <Link href="/contact" className="hover:text-primary">
                                    Help center
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Safety information
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Cancellation options
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Report a concern
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Contact us</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li>1200 Traveler Way, Suite 400</li>
                            <li>San Francisco, CA 94102</li>
                            <li>
                                <a href="tel:+14155550100" className="hover:text-primary">
                                    +1 (415) 555-0100
                                </a>
                            </li>
                            <li>
                                <a href="mailto:support@tripnest.com" className="hover:text-primary">
                                    support@tripnest.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-10 bg-slate-200" />

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} TripNest, Inc. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/privacy" className="hover:text-primary">
                            Privacy
                        </Link>
                        <Link href="/cookies" className="hover:text-primary">
                            Cookies
                        </Link>
                        <Link href="/terms" className="hover:text-primary">
                            Terms
                        </Link>
                        <a href="#" className="hover:text-primary">
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
