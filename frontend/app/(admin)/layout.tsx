"use client";

import "@/app/globals.css";
import { useAuth } from "@/hooks/useAuth";
import { redirect, RedirectType } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Providers } from "../providers";

export default function AdminLayoutWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <AdminLayout>
                        {children}
                    </AdminLayout>
                </Providers>
            </body>
        </html>
    );
}

const AdminLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { isSuperuser, isLoading } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!isSuperuser() && !isLoading) {
            toast({
                title: "Unauthorized",
                description: "You are not authorized to access this page",
                variant: "destructive",
            });
            redirect("/", RedirectType.replace);
        }
    }, [isSuperuser]);

    return (
        <>
            {children}
        </>
    );
}
