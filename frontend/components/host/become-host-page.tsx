"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    CheckCircle2,
    Home,
    Shield,
    Star,
    Users,
} from "lucide-react";
import { useSwitchToHostMutation } from "@/store/api/authApi";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";

export function BecomeHostPage() {
    const { isAuthenticated, isGuest, isHost, user, updateSession } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [switchToHost, { isLoading }] = useSwitchToHostMutation();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        if (isHost()) {
            router.replace("/host/dashboard");
        }
    }, [isAuthenticated, isHost, router]);

    const handleBecomeHost = async () => {
        if (!isAuthenticated) {
            router.push("/auth/login?next=/host");
            return;
        }

        if (!isGuest()) {
            router.push("/host/dashboard");
            return;
        }

        try {
            const response = await switchToHost({}).unwrap();
            const updatedUser = response.data;

            if (updatedUser) {
                await updateSession((prev: any) => ({
                    ...prev,
                    user: {
                        ...(prev?.user ?? user),
                        ...updatedUser,
                    },
                }));
            }

            toast({
                title: "Welcome, Host!",
                description:
                    "Your account has been updated. You can now manage your properties.",
            });
            router.replace("/host/dashboard");
        } catch (error: any) {
            const description =
                error?.data?.errors?.error ||
                "Failed to switch to host. Please try again.";

            toast({
                variant: "destructive",
                title: "Unable to become a host",
                description,
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4 py-10">
                    <div className="grid gap-10 lg:grid-cols-[3fr,2fr] items-start">
                        <div className="space-y-6">
                            <Badge className="mb-2" variant="outline">
                                Become a Host
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Share your space with travelers around the world
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Earn money by hosting guests, manage your properties
                                in a powerful dashboard, and join a trusted
                                community of TripNest hosts.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                            <Home className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-base">
                                            List your properties
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 text-sm text-muted-foreground">
                                        Add hotels and rooms, manage availability,
                                        and keep everything organized in one place.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                        <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-base">
                                            Manage bookings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 text-sm text-muted-foreground">
                                        Track reservations, respond to guests, and
                                        keep your calendar up to date.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                        <div className="p-2 rounded-full bg-amber-50 text-amber-600">
                                            <Star className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-base">
                                            Build your reputation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 text-sm text-muted-foreground">
                                        Delight guests, collect reviews, and grow
                                        your ratings over time.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                        <div className="p-2 rounded-full bg-sky-50 text-sky-600">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-base">
                                            Secure & verified
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 text-sm text-muted-foreground">
                                        We verify hosts and support safe,
                                        high-quality stays for every guest.
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-dashed">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                                Ready to start hosting?
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                            </h2>
                                            <p className="text-sm text-muted-foreground max-w-xl">
                                                We&apos;ll switch your account to
                                                host mode so you can list
                                                properties and access the host
                                                dashboard. You can still book
                                                stays as a guest.
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                By becoming a host, you agree to
                                                follow TripNest&apos;s hosting
                                                standards and local regulations.
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end gap-2 min-w-[220px]">
                                            <Button
                                                size="lg"
                                                className="w-full md:w-auto"
                                                onClick={handleBecomeHost}
                                                disabled={isLoading}
                                            >
                                                {isLoading
                                                    ? "Updating account..."
                                                    : "Become a Host"}
                                            </Button>
                                            {!isAuthenticated && (
                                                <p className="text-xs text-muted-foreground">
                                                    You will be asked to sign in or
                                                    create an account first.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Trusted by hosts worldwide
                                    <Users className="h-5 w-5 text-primary" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Hosts on TripNest benefit from:
                                    </p>
                                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                        <li>Modern tools to manage hotels</li>
                                        <li>Transparent performance analytics</li>
                                        <li>Secure guest communication</li>
                                        <li>Reliable payouts and reporting</li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold">
                                            4.9
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                            <Star className="h-3 w-3 text-yellow-400" />
                                            average host rating
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold">
                                            24/7
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            support for hosts
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold">
                                            100+
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            countries served
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-muted-foreground">
                                    <p className="font-medium text-slate-900 mb-1">
                                        Already a host elsewhere?
                                    </p>
                                    <p>
                                        You can easily bring your existing
                                        properties to TripNest and reach new
                                        travelers with our global audience.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

