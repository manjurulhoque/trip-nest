"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content";
import CenterLoader from "@/components/loaders/center-loader";

export default function AdminDashboard() {
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
                <AdminSidebar />
                <SidebarInset className="p-6">
                    <AdminDashboardContent />
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
