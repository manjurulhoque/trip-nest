import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "../providers";

export const metadata: Metadata = {
    title: "TripNest | Dashboard",
    description: "TripNest Dashboard",
    generator: "TripNest",
};

export default function UserDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
