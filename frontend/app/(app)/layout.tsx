import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "../providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TripNest - Your Home Away From Home",
    description: "Find and book the perfect accommodation for your next trip",
    generator: "TripNest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
