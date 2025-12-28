"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SearchHero } from "@/components/search-hero";
import { FeaturedListings } from "@/components/featured-listings";
import { PopularDestinations } from "@/components/popular-destinations";
import { RecentArticles } from "@/components/recent-articles";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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

export default function HomePage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <Header />
            </motion.div>

            <main>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                >
                    <SearchHero />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    transition={{ delay: 0.2 }}
                >
                    <FeaturedListings />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    transition={{ delay: 0.1 }}
                >
                    <PopularDestinations />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    transition={{ delay: 0.1 }}
                >
                    <RecentArticles />
                </motion.div>
            </main>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
            >
                <Footer />
            </motion.div>
        </div>
    );
}
