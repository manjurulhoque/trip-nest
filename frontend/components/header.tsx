"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Globe,
    Menu,
    User,
    Heart,
    Calendar,
    LogOut,
    Settings,
    Home,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/auth";

export function Header() {
    const {
        user,
        isAuthenticated,
        logout,
        isHost,
        isGuest,
        canListProperties,
        isSuperuser,
    } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-2xl font-bold text-primary"
                        >
                            TripNest
                        </Link>
                        <nav className="hidden md:flex space-x-6">
                            <Link
                                href="/search"
                                className="text-sm font-medium hover:text-primary"
                            >
                                Stays
                            </Link>
                            <Link
                                href="/experiences"
                                className="text-sm font-medium hover:text-primary"
                            >
                                Experiences
                            </Link>
                            <Link
                                href="/host"
                                className="text-sm font-medium hover:text-primary"
                            >
                                Become a Host
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden md:flex"
                        >
                            <Globe className="h-4 w-4 mr-2" />
                            EN
                        </Button>

                        {isAuthenticated ? (
                            // Authenticated User Menu
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center space-x-2"
                                    >
                                        <Menu className="h-4 w-4" />
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user?.avatar} />
                                            <AvatarFallback>
                                                {user?.firstName &&
                                                user?.lastName ? (
                                                    getInitials(
                                                        user.firstName,
                                                        user.lastName
                                                    )
                                                ) : (
                                                    <User className="h-4 w-4" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    {/* User Info */}
                                    <div className="px-2 py-1.5 text-sm font-medium">
                                        {user?.firstName} {user?.lastName}
                                    </div>
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                                        {user?.email}
                                    </div>
                                    <DropdownMenuSeparator />

                                    {/* Dashboard Links */}
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            <Home className="h-4 w-4 mr-2" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>

                                    {isSuperuser() && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin/dashboard">
                                                <Home className="h-4 w-4 mr-2" />
                                                Admin Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {isGuest() && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    My Trips
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/wishlist">
                                                    <Heart className="h-4 w-4 mr-2" />
                                                    Wishlist
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {isHost() && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/host/dashboard">
                                                <Home className="h-4 w-4 mr-2" />
                                                Host Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    {/* Profile & Settings */}
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Account Settings
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    {/* Logout */}
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            // Non-authenticated User Buttons
                            <div className="flex items-center space-x-2">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/auth/login">Sign In</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/auth/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
