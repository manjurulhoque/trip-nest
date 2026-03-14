import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gray-100 mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Safety information
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Cancellation options
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Report a concern
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Community</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    TravelNest.org
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Disaster relief housing
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Support Afghan refugees
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Combating discrimination
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Hosting</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Try hosting
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    TravelNest Cover
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Hosting resources
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Community forum
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">TravelNest</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Newsroom
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    New features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-900">
                                    Investors
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">© {new Date().getFullYear()} TravelNest, Inc.</p>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                            Privacy
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                            Terms
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                            Sitemap
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            <Youtube className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
