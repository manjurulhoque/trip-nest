"use client";

import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <ReduxProvider>
                    {children}
                    <Toaster />
                </ReduxProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
