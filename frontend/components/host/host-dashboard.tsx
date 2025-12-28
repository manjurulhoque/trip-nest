"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HostSidebar } from "@/components/host/host-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { HostDashboardContent } from "@/components/dashboard/host-dashboard-content";
import CenterLoader from "@/components/loaders/center-loader";

export default function HostDashboard() {
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
                <HostSidebar />
                <SidebarInset className="p-6">
                    <HostDashboardContent />
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
