"use client";

import "@/app/globals.css";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Providers } from "../providers";


export default function HostLayoutWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <HostLayout>{children}</HostLayout>
                </Providers>
            </body>
        </html>
    );
}


export function HostLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isHost, isLoading } = useAuth();
    const { toast } = useToast();
    if (!isHost() && !isLoading) {
        toast({
            title: "Unauthorized",
            description: "You are not authorized to access this page",
            variant: "destructive",
        });
        redirect("/");
    }

    return (
        <>{children}</>
    );
}
