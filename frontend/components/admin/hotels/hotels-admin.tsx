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
import { Switch } from "@/components/ui/switch";
import {
    Eye,
    Pencil,
    Search,
    Star,
    MapPin,
    Hotel as HotelIcon,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import Link from "next/link";
import {
    useGetAdminHotelsQuery,
    useToggleAdminHotelActiveMutation,
    useGetFormDataQuery,
    useUpdateAdminHotelMutation,
} from "@/store/api/hotelApi";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { HotelFormData, Hotel as HotelType } from "@/lib/types";

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

const tableRowVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.98,
        transition: {
            duration: 0.2,
        },
    },
};

export default function HotelsAdmin() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<HotelType | null>(null);
    const [editData, setEditData] = useState<Partial<HotelFormData>>({});

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const {
        data: hotelsResponse,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetAdminHotelsQuery({
        page: currentPage,
        search: debouncedSearchQuery,
    });

    const { data: formData } = useGetFormDataQuery();

    const [toggleAdminHotelActive, { isLoading: isToggling }] = useToggleAdminHotelActiveMutation();
    const [updateAdminHotel, { isLoading: isUpdating }] = useUpdateAdminHotelMutation();

    const paginated = hotelsResponse;
    const hotels = paginated?.data?.results ?? [];
    const totalHotels = paginated?.data?.count ?? 0;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, statusFilter]);

    const filteredHotels = statusFilter === "all" ? hotels : hotels.filter((hotel) =>
        statusFilter === "active" ? hotel.isActive : !hotel.isActive
    );

    const getHotelImageUrl = (hotelId: string) => {
        return `https://picsum.photos/seed/hotel-${encodeURIComponent(
            hotelId
        )}/800/480?blur=1`;
    };

    const handleToggleStatus = async (
        hotelId: string,
        isActive: boolean,
        name: string
    ) => {
        try {
            await toggleAdminHotelActive(hotelId).unwrap();
            toast.success(
                `${name} has been ${isActive ? "deactivated" : "activated"
                } successfully.`
            );
            refetch();
        } catch {
            toast.error(
                `Failed to ${isActive ? "deactivate" : "activate"} ${name}. Please try again.`
            );
        }
    };

    const openEditDialog = (hotel: HotelType) => {
        setSelectedHotel(hotel);
        setEditData({
            name: hotel.name,
            address: hotel.address,
            city: hotel.city?.id,
            addressSuburb: hotel.addressSuburb,
            stars: hotel.stars,
            rating: hotel.rating,
            chain: hotel.chain?.id,
            hotelType: hotel.hotelType?.id,
            isActive: hotel.isActive,
        });
        setIsEditOpen(true);
    };

    const handleEditChange = (
        field: keyof HotelFormData,
        value: string | number | boolean
    ) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveHotel = async () => {
        if (!selectedHotel) return;

        try {
            await updateAdminHotel({
                id: selectedHotel.id,
                data: editData,
            }).unwrap();
            toast.success("Hotel updated successfully");
            setIsEditOpen(false);
            setSelectedHotel(null);
            refetch();
        } catch (e: any) {
            const message =
                e?.data?.errors?.error ||
                "Failed to update hotel. Please check the fields and try again.";
            toast.error(message);
        }
    };

    if (!isMounted || isLoading) {
        return <CenterLoader />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-red-600">
                        Error Loading Hotels
                    </h3>
                    <p className="text-sm text-gray-600">
                        Please refresh the page or try again later.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    const pageStart = (currentPage - 1) * pageSize + 1;
    const pageEnd = Math.min(currentPage * pageSize, totalHotels);
    const totalPages = Math.max(1, Math.ceil(totalHotels / pageSize));

    return (
        <motion.div
            className="min-h-screen bg-background"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
        >
            <DashboardHeader />
            <SidebarProvider>
                <AdminSidebar />
                <SidebarInset className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Hotels
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    View and manage all hotel listings on the
                                    platform.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, city or host..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-8"
                                    />
                                </div>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
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
                            </div>
                        </div>

                        <motion.div
                            className="border rounded-lg overflow-hidden bg-card"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hotel</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Host</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Rooms</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence initial={false}>
                                        {isFetching && filteredHotels.length === 0 && (
                                            <>
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <TableRow key={`skeleton-${index}`}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
                                                                <div className="space-y-1">
                                                                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                                                    <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="h-3 w-10 bg-muted rounded animate-pulse" />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                                                                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                                                                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )}
                                        {filteredHotels.map((hotel) => (
                                            <motion.tr
                                                key={hotel.id}
                                                variants={tableRowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                className="border-b last:border-0 hover:bg-muted/40"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getHotelImageUrl(hotel.id)}
                                                            alt={hotel.name}
                                                            className="h-10 w-10 rounded-md object-cover"
                                                        />
                                                        <div>
                                                            <div className="font-medium">
                                                                {hotel.name}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {hotel.hotelType?.name ?? "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        <span>
                                                            {hotel.city?.name},{" "}
                                                            {
                                                                hotel.city
                                                                    ?.countryName
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-sm">
                                                        <span>
                                                            {hotel.owner?.username ?? "N/A"}
                                                        </span>
                                                        {hotel.owner?.email && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {
                                                                    hotel.owner?.email
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Star className="h-3 w-3 text-yellow-400" />
                                                        <span>
                                                            {hotel.rating !=
                                                                null
                                                                ? Number(
                                                                    hotel.rating
                                                                ).toFixed(1)
                                                                : "N/A"}
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
                                                    >
                                                        {hotel.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm">
                                                        {hotel.roomCount ?? 0}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/hotels/${hotel.id}`}
                                                                title="View hotel"
                                                                target="_blank"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    hotel
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            title={
                                                                hotel.isActive
                                                                    ? "Deactivate"
                                                                    : "Activate"
                                                            }
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    hotel.id,
                                                                    hotel.isActive,
                                                                    hotel.name
                                                                )
                                                            }
                                                            disabled={
                                                                isToggling
                                                            }
                                                        >
                                                            {hotel.isActive ? (
                                                                <ToggleRight className="h-4 w-4 text-emerald-500" />
                                                            ) : (
                                                                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>

                            {totalHotels === 0 && (
                                <div className="py-10 text-center text-sm text-muted-foreground">
                                    No hotels found. Try adjusting your search
                                    or filters.
                                </div>
                            )}

                            {totalHotels > pageSize && (
                                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/40">
                                    <div className="text-xs text-muted-foreground">
                                        Showing {pageStart}–{pageEnd} of{" "}
                                        {totalHotels} hotels
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage(
                                                    (prev) =>
                                                        Math.max(1, prev - 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-xs px-2">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        totalPages,
                                                        prev + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage >= totalPages
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        Edit Hotel
                                        {selectedHotel
                                            ? ` – ${selectedHotel.name}`
                                            : ""}
                                    </DialogTitle>
                                </DialogHeader>
                                {selectedHotel && (
                                    <div className="space-y-4 py-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">
                                                    Name
                                                </label>
                                                <Input
                                                    value={editData.name ?? ""}
                                                    onChange={(e) =>
                                                        handleEditChange(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">
                                                    Stars
                                                </label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={5}
                                                    value={
                                                        editData.stars ?? 1
                                                    }
                                                    onChange={(e) =>
                                                        handleEditChange(
                                                            "stars",
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium">
                                                Address
                                            </label>
                                            <Input
                                                value={editData.address ?? ""}
                                                onChange={(e) =>
                                                    handleEditChange(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">
                                                    City
                                                </label>
                                                <Select
                                                    value={
                                                        (editData.city as string) ??
                                                        ""
                                                    }
                                                    onValueChange={(value) =>
                                                        handleEditChange(
                                                            "city",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select city" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {formData?.data?.cities.map(
                                                            (city) => (
                                                                <SelectItem
                                                                    key={
                                                                        city.id
                                                                    }
                                                                    value={
                                                                        city.id
                                                                    }
                                                                >
                                                                    {city.name},{" "}
                                                                    {
                                                                        city.countryName
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">
                                                    Type
                                                </label>
                                                <Select
                                                    value={
                                                        (editData.hotelType as string) ??
                                                        ""
                                                    }
                                                    onValueChange={(value) =>
                                                        handleEditChange(
                                                            "hotelType",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {formData?.data?.types.map(
                                                            (type) => (
                                                                <SelectItem
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    value={
                                                                        type.id
                                                                    }
                                                                >
                                                                    {
                                                                        type.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">
                                                    Rating
                                                </label>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min={0}
                                                    max={10}
                                                    value={
                                                        editData.rating ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        handleEditChange(
                                                            "rating",
                                                            e.target.value
                                                                ? Number(e.target.value)
                                                                : 0
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium">
                                                    Active
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={
                                                            editData.isActive ??
                                                            false
                                                        }
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            handleEditChange(
                                                                "isActive",
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <span className="text-sm text-muted-foreground">
                                                        {editData.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveHotel}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating
                                            ? "Saving..."
                                            : "Save changes"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </motion.div>
    );
}

