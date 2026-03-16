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
    Users,
    Home,
    Calendar,
    FileText,
    Settings,
    Building2,
    Hotel,
    Coffee,
    MapPin,
    Building,
    Settings2
} from "lucide-react";

const adminMenuItems = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: BarChart3,
    },
    {
        title: "User Management",
        url: "/admin/dashboard/users",
        icon: Users,
    },
    {
        title: "Category Management",
        url: "/admin/dashboard/categories",
        icon: Settings2
    }
];

const propertyMenuItems = [
    {
        title: "Hotel Chains",
        url: "/admin/dashboard/hotel-chains",
        icon: Building2,
    },
    {
        title: "Hotel Types",
        url: "/admin/dashboard/hotel-types",
        icon: Hotel,
    },
    {
        title: "Facilities",
        url: "/admin/dashboard/facilities",
        icon: Coffee,
    },
    {
        title: "Cities",
        url: "/admin/dashboard/cities",
        icon: MapPin,
    },
    {
        title: "Hotels",
        url: "/admin/dashboard/hotels",
        icon: Building,
    },
];

const systemMenuItems = [
    {
        title: "Booking Management",
        url: "/admin/bookings",
        icon: Calendar,
    },
    {
        title: "Content Management",
        url: "/admin/content",
        icon: FileText,
    },
    {
        title: "System Settings",
        url: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <h2 className="text-lg font-semibold px-4 py-2">
                    Admin Dashboard
                </h2>
            </SidebarHeader>
            <SidebarContent>
                {/* Main Administration */}
                <SidebarGroup>
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminMenuItems.map((item) => (
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

                {/* Property Management */}
                <SidebarGroup>
                    <SidebarGroupLabel>Property Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {propertyMenuItems.map((item) => (
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

                {/* System Management */}
                <SidebarGroup>
                    <SidebarGroupLabel>System</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {systemMenuItems.map((item) => (
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
