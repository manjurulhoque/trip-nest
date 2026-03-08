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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Pencil,
    Trash2,
    Shield,
    ShieldCheck,
    UserCheck,
    UserX,
    Eye,
} from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/hooks/useAuth";
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
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/types/user";
import {
    useGetAdminUsersQuery,
    useToggleUserStatusMutation,
    useApproveHostMutation,
} from "@/store/api/authApi";

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

export default function UsersAdmin() {
    const { isSuperuser } = useAuth();
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("all");
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
        data: usersResponse,
        isLoading,
        error,
    } = useGetAdminUsersQuery({
        search: debouncedSearchQuery,
        role:
            selectedRole === "all"
                ? undefined
                : (selectedRole as "guest" | "host"),
        status:
            selectedStatus === "all"
                ? undefined
                : (selectedStatus as
                      | "active"
                      | "inactive"
                      | "verified"
                      | "unverified"),
        page: currentPage,
        page_size: 20,
    });

    const [toggleUserStatus] = useToggleUserStatusMutation();
    const [approveHost] = useApproveHostMutation();

    const users = usersResponse?.data?.results || [];
    const totalUsers = usersResponse?.data?.count || 0;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getStatusBadge = (user: User) => {
        if (!user.isActive) {
            return <Badge variant="destructive">Inactive</Badge>;
        }
        if (user.role === "host") {
            if (user.host_approval_status === "approved") {
                return (
                    <Badge variant="default" className="bg-green-500">
                        Approved Host
                    </Badge>
                );
            } else if (user.host_approval_status === "pending") {
                return <Badge variant="secondary">Pending Host</Badge>;
            } else if (user.host_approval_status === "rejected") {
                return <Badge variant="destructive">Rejected Host</Badge>;
            }
        }
        return <Badge variant="outline">Active {user.role}</Badge>;
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, selectedRole, selectedStatus]);

    if (!isMounted || isLoading) {
        return <CenterLoader />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-red-600 mb-2">
                        Error Loading Users
                    </h3>
                    <p className="text-gray-600">Please try again later.</p>
                </div>
            </div>
        );
    }

    const handleEdit = (user: User) => {
        toast({
            title: "Edit User",
            description: `Edit functionality for ${user.firstName} ${user.lastName} - Coming soon!`,
        });
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await toggleUserStatus(user.id).unwrap();
            toast({
                title: "Success",
                description: `${user.firstName} ${user.lastName} has been ${
                    user.isActive ? "deactivated" : "activated"
                }.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user status. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleApproveHost = async (user: User) => {
        try {
            await approveHost({ id: user.id, approved: true }).unwrap();
            toast({
                title: "Success",
                description: `${user.firstName} ${user.lastName} has been approved as a host.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve host. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleViewDetails = (user: User) => {
        toast({
            title: "View Details",
            description: `Viewing details for ${user.firstName} ${user.lastName} - Coming soon!`,
        });
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
                                User Management
                            </h1>
                        </div>

                        <motion.div
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-sm"
                            />
                            <Select
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Roles
                                    </SelectItem>
                                    <SelectItem value="guest">
                                        Guests
                                    </SelectItem>
                                    <SelectItem value="host">Hosts</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger className="w-[150px]">
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
                                    <SelectItem value="verified">
                                        Verified
                                    </SelectItem>
                                    <SelectItem value="unverified">
                                        Unverified
                                    </SelectItem>
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
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {users.map((user, index) => (
                                            <motion.tr
                                                key={user.id}
                                                variants={tableRowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                transition={{
                                                    delay: index * 0.05,
                                                    layout: { duration: 0.3 },
                                                }}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {user.firstName}{" "}
                                                            {user.lastName}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            @{user.username}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {user.email}
                                                        {user.emailVerified && (
                                                            <ShieldCheck
                                                                size={14}
                                                                className="text-green-500"
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {user.role}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(user)}
                                                </TableCell>
                                                <TableCell>
                                                    {user.city && user.country
                                                        ? `${user.city}, ${user.country}`
                                                        : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        user.dateJoined
                                                    ).toLocaleDateString()}
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
                                                                index * 0.05 +
                                                                0.2,
                                                        }}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleEdit(user)
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        {user.role === "host" &&
                                                            user.host_approval_status ===
                                                                "pending" && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleApproveHost(
                                                                            user
                                                                        )
                                                                    }
                                                                    className="text-green-600"
                                                                >
                                                                    <UserCheck className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleToggleStatus(
                                                                    user
                                                                )
                                                            }
                                                            className={
                                                                user.isActive
                                                                    ? "text-red-600"
                                                                    : "text-green-600"
                                                            }
                                                        >
                                                            {user.isActive ? (
                                                                <UserX className="h-4 w-4" />
                                                            ) : (
                                                                <UserCheck className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </motion.div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </motion.div>

                        {/* Pagination */}
                        {totalUsers > 20 && (
                            <motion.div
                                className="flex items-center justify-between px-4 py-3 bg-background border-t"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                            >
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {(currentPage - 1) * 20 + 1} to{" "}
                                        {Math.min(currentPage * 20, totalUsers)}{" "}
                                        of {totalUsers} users
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
                                        {Math.ceil(totalUsers / 20)}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(currentPage + 1)
                                        }
                                        disabled={
                                            currentPage >=
                                            Math.ceil(totalUsers / 20)
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
