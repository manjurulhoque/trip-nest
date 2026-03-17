"use client";

import { useState, useEffect } from "react";
import { WishlistContent } from "@/components/wishlist/wishlist-content";
import CenterLoader from "@/components/loaders/center-loader";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../layout/app-sidebar";
import DashboardHeader from "../dashboard/dashboard-header";

export default function WishlistPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <CenterLoader />;
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="p-6">
                    <WishlistContent />
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
