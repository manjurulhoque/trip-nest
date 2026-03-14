"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ForgotPasswordForm } from "./forgot-password-form";
import { Header } from "../layout/header";
import Link from "next/link";
import CenterLoader from "@/components/loaders/center-loader";

// Animation variants
const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

const ForgotPassword = () => {
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
                    <motion.div
                        className="text-center mb-8"
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-3xl font-bold mb-2">
                            Reset your password
                        </h1>
                        <p className="text-gray-600">
                            Enter your email address and we'll send you a link
                            to reset your password
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                    >
                        <ForgotPasswordForm />
                    </motion.div>

                    <motion.div
                        className="text-center mt-6"
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                    >
                        <p className="text-sm text-gray-600">
                            Remember your password?{" "}
                            <Link
                                href="/auth/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
