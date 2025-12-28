import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import {
    DollarSign,
    Calendar,
    Star,
    MessageSquare,
    TrendingUp,
    Plus,
    Hotel,
    Eye,
    Edit,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import {
    useGetHostDashboardStatsQuery,
    useGetMyHotelsQuery,
    useToggleHotelActiveMutation,
} from "@/store/api/hotelApi";
import Link from "next/link";
import { toast } from "sonner";

const monthlyData = [
    { month: "Jan", bookings: 12, revenue: 3600 },
    { month: "Feb", bookings: 15, revenue: 4500 },
    { month: "Mar", bookings: 18, revenue: 5400 },
    { month: "Apr", bookings: 22, revenue: 6600 },
    { month: "May", bookings: 25, revenue: 7500 },
    { month: "Jun", bookings: 28, revenue: 8400 },
];

export function HostDashboardContent() {
    const {
        data: stats,
        isLoading: statsLoading,
        error: statsError,
    } = useGetHostDashboardStatsQuery();
    const { data: hotelsData, isLoading: hotelsLoading } = useGetMyHotelsQuery({
        page: 1,
    });
    const [toggleHotelActive] = useToggleHotelActiveMutation();

    const handleToggleHotel = async (
        hotelId: string,
        currentStatus: boolean
    ) => {
        try {
            await toggleHotelActive(hotelId).unwrap();
            toast.success(
                `Hotel ${
                    currentStatus ? "deactivated" : "activated"
                } successfully`
            );
        } catch (error) {
            toast.error("Failed to update hotel status");
        }
    };

    if (statsError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Error Loading Dashboard
                    </h2>
                    <p className="text-gray-600">
                        Please try refreshing the page
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Host Dashboard</h1>
                    <p className="text-gray-600">
                        Manage your properties and track performance
                    </p>
                </div>
                <Link href="/host/dashboard/add-hotel">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Hotel
                    </Button>
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Hotels
                        </CardTitle>
                        <Hotel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {stats?.total_hotels || 0}
                            </div>
                        )}
                        {statsLoading ? (
                            <Skeleton className="h-3 w-24" />
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                {`${stats?.active_hotels || 0} active, ${
                                    stats?.inactive_hotels || 0
                                } inactive`}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Rooms
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {stats?.total_rooms || 0}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Across all properties
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Rating
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {stats?.avg_rating
                                    ? stats.avg_rating.toFixed(1)
                                    : "N/A"}
                            </div>
                        )}
                        
                        {statsLoading ? (
                            <Skeleton className="h-3 w-24" />
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                {`Based on ${stats?.total_reviews || 0} reviews`}
                            </p>
                        )}
                        
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Properties
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {stats?.active_hotels || 0}
                            </div>
                        )}
                        {!statsLoading && stats && (
                            <Progress
                                value={
                                    stats.total_hotels > 0
                                        ? (stats.active_hotels /
                                              stats.total_hotels) *
                                          100
                                        : 0
                                }
                                className="mt-2"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Booking Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* My Hotels */}
            <Card>
                <CardHeader>
                    <CardTitle>My Hotels</CardTitle>
                </CardHeader>
                <CardContent>
                    {hotelsLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-4 w-64" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : hotelsData?.results?.length ? (
                        <div className="space-y-4">
                            {hotelsData.results.map((hotel) => (
                                <div
                                    key={hotel.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        {hotel.main_photo ? (
                                            <img
                                                src={hotel.main_photo}
                                                alt={hotel.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Hotel className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-lg">
                                                {hotel.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {hotel.city.name},{" "}
                                                {hotel.city.country_name}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                    <span className="text-sm">
                                                        {hotel.stars} stars
                                                    </span>
                                                </div>
                                                {hotel.rating && (
                                                    <div className="flex items-center">
                                                        <span className="text-sm">
                                                            {hotel.rating.toFixed(
                                                                1
                                                            )}{" "}
                                                            rating
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-500">
                                                    {hotel.room_count} rooms
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge
                                            variant={
                                                hotel.is_active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {hotel.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                        <div className="flex space-x-1">
                                            <Link href={`/hotel/${hotel.id}`}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`/host/dashboard/edit-hotel/${hotel.id}`}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleToggleHotel(
                                                        hotel.id,
                                                        hotel.is_active
                                                    )
                                                }
                                            >
                                                {hotel.is_active ? (
                                                    <ToggleRight className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Hotel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No Hotels Yet
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Start by adding your first hotel property
                            </p>
                            <Link href="/host/dashboard/add-hotel">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Hotel
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
