"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SearchHero } from "@/components/search/search-hero";
import { HomePartners } from "@/components/home/home-partners";
import { HomeBenefits } from "@/components/home/home-benefits";
import { HomeProcess } from "@/components/home/home-process";
import { HomePopularRooms } from "@/components/home/home-popular-rooms";
import { HomeTestimonials } from "@/components/home/home-testimonials";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <Header variant="marketing" />
            </motion.div>

            <main>
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                    <SearchHero />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                >
                    <HomePartners />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    transition={{ delay: 0.05 }}
                >
                    <HomeBenefits />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    transition={{ delay: 0.05 }}
                >
                    <HomeProcess />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    transition={{ delay: 0.05 }}
                >
                    <HomePopularRooms />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    transition={{ delay: 0.05 }}
                >
                    <HomeTestimonials />
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
