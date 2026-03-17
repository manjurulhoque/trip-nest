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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useToast } from "@/components/ui/use-toast";
import {
    useGetBookingsQuery,
    useCancelBookingMutation,
    useCompletePaymentMutation,
} from "@/store/api/bookingApi";
import { BookingDetailsDialog } from "@/components/admin/bookings/booking-details-dialog";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types/booking";

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

const statusFilterOptions: { value: BookingStatus | "all"; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "checked_in", label: "Checked-in" },
    { value: "checked_out", label: "Checked-out" },
    { value: "cancelled", label: "Cancelled" },
    { value: "no_show", label: "No-show" },
];

export default function BookingsAdmin() {
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
        "all"
    );
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
    const [detailsBookingId, setDetailsBookingId] = useState<string | null>(
        null
    );
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {
        data: bookingsResponse,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetBookingsQuery({
        page: currentPage,
        status: statusFilter === "all" ? undefined : statusFilter,
    });

    const [cancelBooking, { isLoading: isCancelling }] =
        useCancelBookingMutation();
    const [completePayment, { isLoading: isCompletingPayment }] =
        useCompletePaymentMutation();

    const paginated = bookingsResponse;
    const bookings = paginated?.data?.results ?? [];
    const totalBookings = paginated?.data?.count ?? 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    if (!isMounted || isLoading) {
        return <CenterLoader />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-red-600">
                        Error Loading Bookings
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
    const pageEnd = Math.min(currentPage * pageSize, totalBookings);
    const totalPages = Math.max(1, Math.ceil(totalBookings / pageSize));

    const handleCancelBooking = async (booking: Booking) => {
        try {
            await cancelBooking({ id: booking.id }).unwrap();
            toast({
                title: "Booking cancelled",
                description: `Booking ${booking.bookingReference} has been cancelled.`,
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to cancel booking. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleCompletePayment = async (booking: Booking) => {
        try {
            await completePayment({ id: booking.id }).unwrap();
            toast({
                title: "Payment completed",
                description: `Payment for booking ${booking.bookingReference} has been marked as paid.`,
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to complete payment. Please try again.",
                variant: "destructive",
            });
        }
    };

    const canCancel = (b: Booking) => b.status !== "cancelled";
    const canCompletePayment = (b: Booking) =>
        b.status !== "cancelled" && b.paymentStatus !== "paid";

    const openDetails = (booking: Booking) => {
        setDetailsBookingId(booking.id);
        setIsDetailsOpen(true);
    };

    const closeDetails = () => {
        setIsDetailsOpen(false);
        setDetailsBookingId(null);
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
                <AdminSidebar />
                <SidebarInset className="p-6">
                    <motion.div
                        className="p-6 space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold">
                                Booking Management
                            </h1>
                        </div>

                        <motion.div
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <Select
                                value={statusFilter}
                                onValueChange={(val) =>
                                    setStatusFilter(val as BookingStatus | "all")
                                }
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusFilterOptions.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </motion.div>

                        <motion.div
                            className="border rounded-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Guest</TableHead>
                                        <TableHead>Hotel</TableHead>
                                        <TableHead>Room</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {bookings.map((booking) => (
                                            <motion.tr
                                                key={booking.id}
                                                variants={tableRowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    {booking.bookingReference}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {booking.user.firstName}{" "}
                                                            {booking.user.lastName}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {booking.user.email}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {booking.hotel.name}
                                                </TableCell>
                                                <TableCell>
                                                    {booking.room.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs">
                                                        <span>
                                                            {new Date(
                                                                booking.checkInDate
                                                            ).toLocaleDateString()}{" "}
                                                            –{" "}
                                                            {new Date(
                                                                booking.checkOutDate
                                                            ).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            {booking.totalNights}{" "}
                                                            nights
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {booking.totalAmount.toLocaleString(
                                                        undefined,
                                                        {
                                                            style: "currency",
                                                            currency:
                                                                booking.currency,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            booking.status ===
                                                                "confirmed" ||
                                                            booking.status ===
                                                                "checked_in"
                                                                ? "default"
                                                                : booking.status ===
                                                                      "cancelled" ||
                                                                  booking.status ===
                                                                      "no_show"
                                                                ? "destructive"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {booking.status.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            booking.paymentStatus ===
                                                            "paid"
                                                                ? "default"
                                                                : booking.paymentStatus ===
                                                                      "failed"
                                                                ? "destructive"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {booking.paymentStatus.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openDetails(
                                                                        booking
                                                                    )
                                                                }
                                                            >
                                                                View details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    !canCancel(
                                                                        booking
                                                                    ) ||
                                                                    isCancelling
                                                                }
                                                                onClick={() =>
                                                                    handleCancelBooking(
                                                                        booking
                                                                    )
                                                                }
                                                            >
                                                                Cancel booking
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    !canCompletePayment(
                                                                        booking
                                                                    ) ||
                                                                    isCompletingPayment
                                                                }
                                                                onClick={() =>
                                                                    handleCompletePayment(
                                                                        booking
                                                                    )
                                                                }
                                                            >
                                                                Mark as paid
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </motion.div>

                        {totalBookings > pageSize && (
                            <motion.div
                                className="flex items-center justify-between px-4 py-3 bg-background border-t"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                            >
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {pageStart} to{" "}
                                        {Math.min(pageEnd, totalBookings)} of{" "}
                                        {totalBookings} bookings
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(1, prev - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="px-3 py-1 text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(totalPages, prev + 1)
                                            )
                                        }
                                        disabled={currentPage >= totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        <BookingDetailsDialog
                            bookingId={detailsBookingId}
                            open={isDetailsOpen}
                            onOpenChange={(open) =>
                                open ? setIsDetailsOpen(true) : closeDetails()
                            }
                        />
                    </motion.div>
                </SidebarInset>
            </SidebarProvider>
        </motion.div>
    );
}

