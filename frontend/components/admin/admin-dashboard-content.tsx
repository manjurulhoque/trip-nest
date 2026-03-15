"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Users,
    Home,
    Calendar,
    DollarSign,
    TrendingUp,
    AlertTriangle,
} from "lucide-react";
import { useGetUserStatsQuery } from "@/store/api/authApi";
import { useGetHotelsQuery } from "@/store/api/hotelApi";
import { useGetBookingsQuery } from "@/store/api/bookingApi";
import { useGetFacilityStatsQuery } from "@/store/api/facilityApi";
import { useGetPendingHostsQuery } from "@/store/api/authApi";
import CenterLoader from "@/components/loaders/center-loader";
import Link from "next/link";

export function AdminDashboardContent() {
    const { data: userStatsResponse, isLoading: userStatsLoading } = useGetUserStatsQuery();
    const { data: hotelsResponse } = useGetHotelsQuery({ page: 1 });
    const { data: bookingsResponse } = useGetBookingsQuery({ page: 1 });
    const { data: facilityStatsResponse } = useGetFacilityStatsQuery();
    const { data: pendingHostsResponse } = useGetPendingHostsQuery();

    const userStats = userStatsResponse?.data;
    const totalUsers = userStats?.totalUsers ?? 0;
    const activeUsers = userStats?.activeUsers ?? 0;
    const newThisMonth = userStats?.newRegistrationsThisMonth ?? 0;
    const pendingHosts = userStats?.pendingHosts ?? 0;
    const approvedHosts = userStats?.approvedHosts ?? 0;

    const hotelCount = hotelsResponse?.data?.count ?? 0;
    const bookingCount = bookingsResponse?.data?.count ?? 0;
    const facilityStats = facilityStatsResponse?.data;
    const totalFacilities = facilityStats?.totalFacilities ?? 0;

    const guestCount = totalUsers - approvedHosts - pendingHosts;
    const hostCount = approvedHosts + pendingHosts;
    const userTypeData = [
        { name: "Guests", value: Math.max(0, guestCount), color: "#3b82f6" },
        { name: "Hosts", value: hostCount, color: "#10b981" },
    ].filter((d) => d.value > 0);

    const pendingList = pendingHostsResponse?.data ?? [];
    const pendingActions = pendingList.slice(0, 5).map((user: { id: string; firstName?: string; lastName?: string; email?: string }, i: number) => ({
        id: user.id,
        type: "Host Verification",
        description: `${user.firstName ?? ""} ${user.lastName ?? ""} (${user.email ?? ""}) – pending host approval`,
        priority: "High",
        time: "",
    }));

    if (userStatsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <CenterLoader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Platform overview and management tools
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 inline mr-1" aria-hidden />
                            {newThisMonth} new this month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Listings
                        </CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{hotelCount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Hotels on platform
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bookings
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{bookingCount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            All-time bookings
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Facilities
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{totalFacilities.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Amenities & categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Platform Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={[
                                    { name: "Users", count: totalUsers, fill: "#3b82f6" },
                                    { name: "Hotels", count: hotelCount, fill: "#10b981" },
                                    { name: "Bookings", count: bookingCount, fill: "#8b5cf6" },
                                    { name: "Facilities", count: totalFacilities, fill: "#f59e0b" },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={userTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {userTypeData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            {userTypeData.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        />
                                        <span className="text-sm text-foreground">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                        <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" aria-hidden />
                        Pending Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingActions.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">
                                No pending host verifications.
                            </p>
                        ) : (
                            pendingActions.map((action) => (
                                <div
                                    key={action.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            {action.type}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {action.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="destructive">
                                            {action.priority}
                                        </Badge>
                                        <Button size="sm" asChild>
                                            <Link href="/admin/dashboard/users">
                                                Review
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Server Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            99.9%
                        </div>
                        <Progress value={99.9} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">245ms</div>
                        <p className="text-xs text-muted-foreground">
                            Average response time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Error Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            0.1%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Last 24 hours
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
