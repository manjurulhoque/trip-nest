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
import { cn } from "@/lib/utils";

export interface HeaderProps {
    /** Centered marketing nav for the landing page */
    variant?: "default" | "marketing";
}

export function Header({ variant = "default" }: HeaderProps) {
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

    const isMarketing = variant === "marketing";

    return (
        <header
            className={cn(
                "sticky top-0 z-50 border-b bg-white",
                isMarketing && "border-slate-200/80 shadow-sm"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-4">
                    <Link
                        href="/"
                        className={cn(
                            "text-xl sm:text-2xl font-bold shrink-0 tracking-tight",
                            isMarketing ? "text-primary" : "text-primary"
                        )}
                    >
                        TripNest
                    </Link>

                    {isMarketing ? (
                        <nav
                            className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-10"
                            aria-label="Primary"
                        >
                            <Link
                                href="/"
                                className="text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-violet-600"
                            >
                                Home
                            </Link>
                            <Link
                                href="/search"
                                className="text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-violet-600"
                            >
                                Stays
                            </Link>
                            <Link
                                href="/#about"
                                className="text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-violet-600"
                            >
                                About
                            </Link>
                            <Link
                                href="/#benefits"
                                className="text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-violet-600"
                            >
                                Features
                            </Link>
                            <Link
                                href="/contact"
                                className="text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-violet-600"
                            >
                                Contact
                            </Link>
                        </nav>
                    ) : (
                        <nav className="hidden md:flex flex-1 justify-start items-center space-x-6 pl-8">
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
                        </nav>
                    )}

                    <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
                        {!isMarketing && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hidden md:flex"
                            >
                                <Globe className="h-4 w-4 mr-2" />
                                EN
                            </Button>
                        )}

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
                                                <Link href="/dashboard/wishlist">
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
                                <Button asChild variant="ghost" size="sm" className="text-slate-700">
                                    <Link href="/auth/login">Sign in</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant={isMarketing ? "outline" : "default"}
                                    size="sm"
                                    className={cn(
                                        isMarketing &&
                                            "rounded-full border-primary text-primary hover:bg-primary/10"
                                    )}
                                >
                                    <Link href="/auth/signup">Sign up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
