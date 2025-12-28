"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import CenterLoader from "@/components/loaders/center-loader";

export default function Dashboard() {
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
                    <DashboardContent />
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
