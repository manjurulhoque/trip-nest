"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    MapPin,
    Star,
    Power,
    PowerOff,
    Hotel as HotelIcon,
    TrendingUp,
    Users,
} from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HostSidebar } from "@/components/host/host-sidebar";
import { useToast } from "@/components/ui/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    useGetMyHotelsQuery,
    useGetHostDashboardStatsQuery,
    useToggleHotelActiveMutation,
    useDeleteHotelMutation,
} from "@/store/api/hotelApi";
import { Hotel as HotelType } from "@/lib/types";
import Link from "next/link";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const tableRowVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: {
            duration: 0.3,
        },
    },
};

const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

export default function HostHotelsManagement() {
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // API calls
    const {
        data: hotelsResponse,
        isLoading: hotelsLoading,
        error: hotelsError,
    } = useGetMyHotelsQuery({ page: currentPage });

    const {
        data: statsResponse,
        isLoading: statsLoading,
        error: statsError,
    } = useGetHostDashboardStatsQuery();

    const [toggleHotelActive] = useToggleHotelActiveMutation();
    const [deleteHotel] = useDeleteHotelMutation();

    const rawData = hotelsResponse?.data;
    const hotels = Array.isArray(rawData)
        ? rawData
        : (rawData?.results ?? []);
    const totalHotels =
        typeof rawData?.count === "number"
            ? rawData.count
            : (Array.isArray(rawData) ? rawData.length : 0);
    const stats = statsResponse?.data;

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, selectedStatus]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Filter hotels based on search and status
    const filteredHotels = hotels.filter((hotel: HotelType) => {
        const matchesSearch =
            !debouncedSearchQuery ||
            hotel.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()) ||
            hotel.address
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()) ||
            hotel.city?.name
                ?.toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase());

        const matchesStatus =
            selectedStatus === "all" ||
            (selectedStatus === "active" && hotel.isActive) ||
            (selectedStatus === "inactive" && !hotel.isActive);

        return matchesSearch && matchesStatus;
    });

    if (!isMounted || hotelsLoading || statsLoading) {
        return <CenterLoader />;
    }

    if (hotelsError || statsError) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardHeader />
                <SidebarProvider>
                    <HostSidebar />
                    <SidebarInset className="p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-red-600 mb-2">
                                    Error Loading Hotels
                                </h3>
                                <p className="text-gray-600">
                                    Please try again later.
                                </p>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        );
    }

    const handleToggleStatus = async (hotel: HotelType) => {
        try {
            await toggleHotelActive(hotel.id).unwrap();
            toast({
                title: "Success",
                description: `${hotel.name} has been ${hotel.isActive ? "deactivated" : "activated"
                    }.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update hotel status. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteHotel = async (hotel: HotelType) => {
        try {
            await deleteHotel(hotel.id).unwrap();
            toast({
                title: "Success",
                description: `${hotel.name} has been deleted.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete hotel. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-background"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
        >
            <DashboardHeader />
            <SidebarProvider>
                <HostSidebar />
                <SidebarInset className="p-6">
                    <motion.div
                        className="p-6 space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Hotel Management
                                </h1>
                                <p className="text-gray-600">
                                    Manage your hotel listings and track
                                    performance
                                </p>
                            </div>
                            <Link href="/host/dashboard/add-hotel">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Hotel
                                </Button>
                            </Link>
                        </div>

                        {/* Stats Cards */}
                        {stats && (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                                variants={containerVariants}
                            >
                                <motion.div variants={cardVariants}>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Hotels
                                            </CardTitle>
                                            <HotelIcon className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stats.totalHotels || 0}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={cardVariants}>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Active Hotels
                                            </CardTitle>
                                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stats.activeHotels || 0}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={cardVariants}>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Rooms
                                            </CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stats.totalRooms || 0}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={cardVariants}>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Avg Rating
                                            </CardTitle>
                                            <Star className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stats.avgRating != null
                                                    ? Number(
                                                        stats.avgRating
                                                    ).toFixed(1)
                                                    : "N/A"}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Filters */}
                        <motion.div
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <Input
                                placeholder="Search hotels..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-sm"
                            />
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>

                        {/* Hotels Table */}
                        <motion.div
                            className="border rounded-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hotel</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {filteredHotels.map(
                                            (hotel: HotelType, index) => (
                                                <motion.tr
                                                    key={hotel.id}
                                                    variants={tableRowVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    layout
                                                    transition={{
                                                        delay: index * 0.05,
                                                        layout: {
                                                            duration: 0.3,
                                                        },
                                                    }}
                                                    className="border-b transition-colors hover:bg-muted/50"
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-3">
                                                            {hotel.mainPhoto && (
                                                                <img
                                                                    src={
                                                                        hotel.mainPhoto
                                                                    }
                                                                    alt={
                                                                        hotel.name
                                                                    }
                                                                    className="w-12 h-12 object-cover rounded"
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="font-semibold">
                                                                    {hotel.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        hotel.stars
                                                                    }
                                                                    ★ Hotel
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm">
                                                                {hotel.city
                                                                    ?.name ||
                                                                    hotel.address}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <span>
                                                                {hotel.rating?.toFixed(
                                                                    1
                                                                ) || "N/A"}
                                                            </span>
                                                            <span className="text-gray-500 text-sm">
                                                                (
                                                                {hotel.reviewsCount ||
                                                                    0}
                                                                )
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">
                                                            $
                                                            {hotel.price ||
                                                                "N/A"}
                                                            <span className="text-gray-500 text-sm">
                                                                /night
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                hotel.isActive
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className={
                                                                hotel.isActive
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }
                                                        >
                                                            {hotel.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <motion.div
                                                            className="flex justify-end space-x-2"
                                                            initial={{
                                                                opacity: 0,
                                                                x: 20,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    index *
                                                                    0.05 +
                                                                    0.2,
                                                            }}
                                                        >
                                                            <Link
                                                                href={`/hotels/${hotel.id}`}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                href={`/host/dashboard/edit-hotel/${hotel.id}`}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleToggleStatus(
                                                                        hotel
                                                                    )
                                                                }
                                                                className={
                                                                    hotel.isActive
                                                                        ? "text-red-600"
                                                                        : "text-green-600"
                                                                }
                                                            >
                                                                {hotel.isActive ? (
                                                                    <PowerOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Power className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-red-600"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Delete
                                                                            Hotel
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are
                                                                            you
                                                                            sure
                                                                            you
                                                                            want
                                                                            to
                                                                            delete
                                                                            "
                                                                            {
                                                                                hotel.name
                                                                            }
                                                                            "?
                                                                            This
                                                                            action
                                                                            cannot
                                                                            be
                                                                            undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDeleteHotel(
                                                                                    hotel
                                                                                )
                                                                            }
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </motion.div>
                                                    </TableCell>
                                                </motion.tr>
                                            )
                                        )}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </motion.div>

                        {/* Empty State */}
                        {filteredHotels.length === 0 && (
                            <motion.div
                                className="text-center py-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <HotelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No hotels found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {hotels.length === 0
                                        ? "Get started by adding your first hotel."
                                        : "Try adjusting your search or filters."}
                                </p>
                                {hotels.length === 0 && (
                                    <Link href="/host/dashboard/add-hotel">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Your First Hotel
                                        </Button>
                                    </Link>
                                )}
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {totalHotels > 20 && (
                            <motion.div
                                className="flex items-center justify-between px-4 py-3 bg-background border-t"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                            >
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {(currentPage - 1) * 20 + 1} to{" "}
                                        {Math.min(
                                            currentPage * 20,
                                            totalHotels
                                        )}{" "}
                                        of {totalHotels} hotels
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="px-3 py-1 text-sm">
                                        Page {currentPage} of{" "}
                                        {Math.ceil(totalHotels / 20)}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(currentPage + 1)
                                        }
                                        disabled={
                                            currentPage >=
                                            Math.ceil(totalHotels / 20)
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </SidebarInset>
            </SidebarProvider>
        </motion.div>
    );
}
