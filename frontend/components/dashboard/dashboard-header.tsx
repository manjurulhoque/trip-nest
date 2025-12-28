"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Bell,
    Settings,
    User,
    LogOut,
    Home,
    Calendar,
    Heart,
    MessageSquare,
    ChevronDown,
    Sun,
    Moon,
    Menu,
    Laptop,
    Shield,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/auth";
import { useTheme } from "next-themes";

const DashboardHeader = () => {
    const { user, isAuthenticated, logout, isHost, isGuest, isSuperuser } =
        useAuth();
    const { theme, setTheme } = useTheme();

    const [searchQuery, setSearchQuery] = useState("");
    const [notifications] = useState([
        {
            id: 1,
            title: "New booking request",
            message: "You have a new booking request for Villa Sunset",
            time: "2 minutes ago",
            unread: true,
            icon: "calendar",
        },
        {
            id: 2,
            title: "Payment received",
            message: "Payment of $150 has been received for booking #1234",
            time: "1 hour ago",
            unread: true,
            icon: "payment",
        },
        {
            id: 3,
            title: "Review posted",
            message: "A guest left a 5-star review for your property",
            time: "3 hours ago",
            unread: false,
            icon: "star",
        },
    ]);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <header className="bg-white dark:bg-gray-950 border-b border-border/40 sticky top-0 z-50">
            <div className="flex h-16 items-center">
                {/* Left Section - Logo and Search */}
                <div className="flex items-center gap-4 flex-1 min-w-0 pl-2">
                    {/* Mobile Menu Button */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 flex-shrink-0"
                    >
                        <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            TripNest
                        </span>
                        <Badge
                            variant="outline"
                            className="hidden md:inline-flex"
                        >
                            Dashboard
                        </Badge>
                    </Link>

                    {/* Search Box */}
                    <form
                        onSubmit={handleSearch}
                        className="flex-1 max-w-md hidden md:block"
                    >
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <Input
                                type="text"
                                placeholder="Search bookings, properties, guests..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 h-9 w-full bg-muted/30 border-muted-foreground/20 hover:bg-muted/50 focus:bg-background transition-colors"
                            />
                        </div>
                    </form>
                </div>

                {/* Right Section - Actions and Profile */}
                <div className="flex items-center gap-2 pr-4">
                    {/* Theme Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:inline-flex"
                            >
                                {theme === "light" && (
                                    <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                )}
                                {theme === "dark" && (
                                    <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                )}
                                {theme === "system" && (
                                    <Laptop className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="h-4 w-4 mr-2" />
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="h-4 w-4 mr-2" />
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setTheme("system")}
                            >
                                <Laptop className="h-4 w-4 mr-2" />
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <Badge
                                            variant="default"
                                            className="relative inline-flex rounded-full h-4 w-4 items-center justify-center p-0 text-[10px] font-medium"
                                        >
                                            {unreadCount > 9
                                                ? "9+"
                                                : unreadCount}
                                        </Badge>
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-[380px] max-h-[480px] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <div>
                                    <h3 className="font-semibold">
                                        Notifications
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        You have {unreadCount} unread messages
                                    </p>
                                </div>
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        Mark all as read
                                    </Button>
                                )}
                            </div>

                            {notifications.length > 0 ? (
                                <div className="py-2">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                                                notification.unread
                                                    ? "bg-muted/20"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`rounded-full p-2 ${
                                                        notification.unread
                                                            ? "bg-primary/10 text-primary"
                                                            : "bg-muted"
                                                    }`}
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/80 mt-1">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                                {notification.unread && (
                                                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <Bell className="h-12 w-12 mx-auto text-muted-foreground/30" />
                                    <p className="mt-3 text-sm font-medium">
                                        No notifications
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        We'll notify you when something arrives.
                                    </p>
                                </div>
                            )}

                            <div className="border-t p-4">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link href="/notifications">
                                        View all notifications
                                    </Link>
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Settings */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:inline-flex"
                            >
                                <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Settings</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/dashboard/settings/profile"
                                    className="flex items-center"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    Profile Settings
                                </Link>
                            </DropdownMenuItem>

                            {isHost() && (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/dashboard/settings/properties"
                                            className="flex items-center"
                                        >
                                            <Home className="h-4 w-4 mr-2" />
                                            Property Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/dashboard/settings/pricing"
                                            className="flex items-center"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Pricing & Availability
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/dashboard/settings/notifications"
                                    className="flex items-center"
                                >
                                    <Bell className="h-4 w-4 mr-2" />
                                    Notification Preferences
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Profile */}
                    {isAuthenticated && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-2 px-2 md:pl-2 md:pr-4 hover:bg-muted/50"
                                >
                                    <Avatar className="h-8 w-8 border-2 border-muted">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                            {user?.first_name &&
                                            user?.last_name ? (
                                                getInitials(
                                                    user.first_name,
                                                    user.last_name
                                                )
                                            ) : (
                                                <User className="h-4 w-4" />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:block text-left">
                                        <div className="text-sm font-medium">
                                            {user?.first_name} {user?.last_name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {user?.role === "host"
                                                ? "Host"
                                                : "Guest"}
                                        </div>
                                    </div>
                                    <ChevronDown className="h-4 w-4 hidden md:block text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                <div className="px-3 py-2 border-b">
                                    <div className="text-sm font-medium">
                                        {user?.first_name} {user?.last_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {user?.email}
                                    </div>
                                </div>

                                <div className="py-2">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center"
                                        >
                                            <Home className="h-4 w-4 mr-2" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>

                                    {isSuperuser() && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/admin/dashboard"
                                                className="flex items-center"
                                            >
                                                <Shield className="h-4 w-4 mr-2" />
                                                Admin Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {isGuest() && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/dashboard/trips"
                                                    className="flex items-center"
                                                >
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    My Trips
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/wishlist"
                                                    className="flex items-center"
                                                >
                                                    <Heart className="h-4 w-4 mr-2" />
                                                    Wishlist
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {isHost() && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/host/dashboard"
                                                className="flex items-center"
                                            >
                                                <Home className="h-4 w-4 mr-2" />
                                                Host Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                </div>

                                <DropdownMenuSeparator />

                                <div className="py-2">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/dashboard/profile"
                                            className="flex items-center"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            View Profile
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/dashboard/settings"
                                            className="flex items-center"
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                </div>

                                <DropdownMenuSeparator />

                                <div className="py-2">
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
