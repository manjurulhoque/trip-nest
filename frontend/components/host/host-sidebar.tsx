import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar";
import {
    BarChart3,
    Home,
    MessageSquare,
    User,
    DollarSign,
    Calendar,
} from "lucide-react";

const hostMenuItems = [
    {
        title: "Dashboard",
        url: "/host/dashboard",
        icon: BarChart3,
    },
    {
        title: "Hotels",
        url: "/host/dashboard/hotels",
        icon: Home,
    },
    {
        title: "Bookings",
        url: "/host/dashboard/bookings",
        icon: Calendar,
    },
    {
        title: "Messages",
        url: "/host/dashboard/messages",
        icon: MessageSquare,
    },
    {
        title: "Payouts",
        url: "/host/dashboard/payouts",
        icon: DollarSign,
    },
    {
        title: "Profile",
        url: "/host/dashboard/profile",
        icon: User,
    },
];

export function HostSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <h2 className="text-lg font-semibold px-4 py-2">
                    Host Dashboard
                </h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Host Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {hostMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
