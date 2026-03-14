"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "./login-form";
import Link from "next/link";
import CenterLoader from "@/components/loaders/center-loader";
import { Header } from "../layout/header";

const Login = () => {
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
                            Welcome back
                        </h1>
                        <p className="text-gray-600">
                            Sign in to your TripNest account
                        </p>
                    </div>
                    <LoginForm />
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                href="/auth/signup"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
