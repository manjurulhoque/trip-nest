"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import CenterLoader from "@/components/loaders/center-loader";

export default function CookiesPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <CenterLoader />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto prose prose-gray">
                    <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Last updated: December 21, 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            What are cookies?
                        </h2>
                        <p className="mb-4">
                            Cookies are small text files that are placed on your
                            computer or mobile device when you visit our
                            website. They help us provide you with a better
                            experience by remembering your preferences and
                            improving our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Types of cookies we use
                        </h2>

                        <h3 className="text-xl font-semibold mb-3">
                            Essential Cookies
                        </h3>
                        <p className="mb-4">
                            These cookies are necessary for the website to
                            function properly. They enable basic functions like
                            page navigation and access to secure areas of the
                            website.
                        </p>

                        <h3 className="text-xl font-semibold mb-3">
                            Performance Cookies
                        </h3>
                        <p className="mb-4">
                            These cookies collect information about how visitors
                            use our website, such as which pages are visited
                            most often. This data helps us improve how our
                            website works.
                        </p>

                        <h3 className="text-xl font-semibold mb-3">
                            Functionality Cookies
                        </h3>
                        <p className="mb-4">
                            These cookies allow the website to remember choices
                            you make and provide enhanced, more personal
                            features.
                        </p>

                        <h3 className="text-xl font-semibold mb-3">
                            Marketing Cookies
                        </h3>
                        <p className="mb-4">
                            These cookies are used to deliver advertisements
                            more relevant to you and your interests.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Managing cookies
                        </h2>
                        <p className="mb-4">
                            You can control and/or delete cookies as you wish.
                            You can delete all cookies that are already on your
                            computer and you can set most browsers to prevent
                            them from being placed.
                        </p>
                        <p className="mb-4">
                            However, if you do this, you may have to manually
                            adjust some preferences every time you visit a site
                            and some services and functionalities may not work.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Third-party cookies
                        </h2>
                        <p className="mb-4">
                            We may also use third-party services such as Google
                            Analytics, which may place cookies on your device.
                            These services have their own privacy policies and
                            cookie policies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Contact us
                        </h2>
                        <p className="mb-4">
                            If you have any questions about our use of cookies,
                            please contact us at:
                        </p>
                        <p className="mb-2">Email: cookies@travelnest.com</p>
                        <p className="mb-2">Phone: +1 (555) 123-4567</p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
