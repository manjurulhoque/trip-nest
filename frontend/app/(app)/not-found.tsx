"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, MapPin, Search, Plane, Compass } from "lucide-react";

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

const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.8,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Animated 404 Illustration */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={scaleIn}
                    className="mb-8"
                >
                    <div className="relative">
                        {/* Large 404 Text */}
                        <motion.h1
                            className="text-9xl font-bold text-muted-foreground/20 mb-4"
                            variants={fadeInUp}
                        >
                            404
                        </motion.h1>

                        {/* Floating Travel Icons */}
                        <motion.div
                            animate={{
                                y: [-10, 10, -10],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute top-4 left-1/4 text-primary"
                        >
                            <Plane size={32} />
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [-10, 10, -10],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1,
                            }}
                            className="absolute top-8 right-1/4 text-primary"
                        >
                            <Compass size={28} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Oops! Wrong destination
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            Looks like this page took a detour. Don't worry,
                            we'll help you get back on track to find your
                            perfect getaway.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
                    >
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <Link href="/" className="flex items-center gap-2">
                                <Home size={18} />
                                Go Home
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={() => window.history.back()}
                        >
                            <button className="flex items-center gap-2">
                                <ArrowLeft size={18} />
                                Go Back
                            </button>
                        </Button>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ delay: 0.6 }}
                        className="pt-8 border-t border-border/50"
                    >
                        <p className="text-sm text-muted-foreground mb-4">
                            Popular destinations to explore:
                        </p>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                <Link
                                    href="/search"
                                    className="flex items-center gap-1"
                                >
                                    <Search size={14} />
                                    Search Hotels
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                <Link
                                    href="/"
                                    className="flex items-center gap-1"
                                >
                                    <MapPin size={14} />
                                    Popular Cities
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                <Link
                                    href="/contact"
                                    className="flex items-center gap-1"
                                >
                                    Need Help?
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <motion.div
                        className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-primary/5"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.1, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    <motion.div
                        className="absolute bottom-1/4 right-10 w-24 h-24 rounded-full bg-primary/5"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
