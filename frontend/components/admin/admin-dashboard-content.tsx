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

const platformData = [
    { month: "Jan", users: 1200, bookings: 450, revenue: 135000 },
    { month: "Feb", users: 1350, bookings: 520, revenue: 156000 },
    { month: "Mar", users: 1500, bookings: 580, revenue: 174000 },
    { month: "Apr", users: 1680, bookings: 640, revenue: 192000 },
    { month: "May", users: 1850, bookings: 720, revenue: 216000 },
    { month: "Jun", users: 2100, bookings: 850, revenue: 255000 },
];

const userTypeData = [
    { name: "Guests", value: 1800, color: "#3b82f6" },
    { name: "Hosts", value: 300, color: "#10b981" },
];

const pendingActions = [
    {
        id: 1,
        type: "Property Review",
        description: "New listing requires approval",
        priority: "High",
        time: "2 hours ago",
    },
    {
        id: 2,
        type: "Dispute Resolution",
        description: "Guest complaint about cleanliness",
        priority: "Medium",
        time: "4 hours ago",
    },
    {
        id: 3,
        type: "Host Verification",
        description: "Identity verification pending",
        priority: "Low",
        time: "1 day ago",
    },
];

export function AdminDashboardContent() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-600">
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
                        <div className="text-2xl font-bold">2,100</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            +13.5% from last month
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
                        <div className="text-2xl font-bold">1,245</div>
                        <p className="text-xs text-muted-foreground">
                            +8.2% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Monthly Bookings
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">850</div>
                        <p className="text-xs text-muted-foreground">
                            +18.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Platform Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$255K</div>
                        <p className="text-xs text-muted-foreground">
                            +18.1% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Platform Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={platformData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="users" fill="#3b82f6" />
                                <Bar dataKey="bookings" fill="#10b981" />
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
                                        <span className="text-sm">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium">
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
                    <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                        Pending Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingActions.map((action) => (
                            <div
                                key={action.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div>
                                    <h4 className="font-semibold">
                                        {action.type}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {action.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {action.time}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            action.priority === "High"
                                                ? "destructive"
                                                : action.priority === "Medium"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {action.priority}
                                    </Badge>
                                    <Button size="sm">Review</Button>
                                </div>
                            </div>
                        ))}
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
