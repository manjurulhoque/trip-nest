"use client";

import { useState, useEffect } from "react";
import { SignupForm } from "@/components/auth/signup-form";
import { Header } from "@/components/header";
import Link from "next/link";
import CenterLoader from "@/components/loaders/center-loader";

export default function Signup() {
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
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Create your account
                        </h1>
                        <p className="text-gray-600">
                            Join TripNest and start your journey
                        </p>
                    </div>
                    <SignupForm />
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
