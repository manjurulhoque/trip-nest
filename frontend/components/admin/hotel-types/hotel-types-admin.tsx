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
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
    useGetAdminHotelTypesQuery,
    useCreateHotelTypeMutation,
    useUpdateHotelTypeMutation,
    useDeleteHotelTypeMutation,
} from "@/store/api/hotelTypeApi";
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
import { HotelType, HotelTypeFormData } from "@/lib/types/hotel";

// Animation variants (same as facilities-admin)
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

const dialogVariants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: {
            duration: 0.2,
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

export default function HotelTypesAdmin() {
    const { isSuperuser } = useAuth();
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingType, setEditingType] = useState<HotelType | null>(null);
    const [formData, setFormData] = useState<Partial<HotelTypeFormData>>({
        type_id: 0,
        name: "",
        description: "",
        icon: "",
        is_active: true,
    });

    // Queries and Mutations
    const { data: hotelTypesResponse, isLoading: isLoadingTypes } =
        useGetAdminHotelTypesQuery(undefined, {
            skip: !isSuperuser(),
        });
    const [createHotelType] = useCreateHotelTypeMutation();
    const [updateHotelType] = useUpdateHotelTypeMutation();
    const [deleteHotelType] = useDeleteHotelTypeMutation();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingType) {
                await updateHotelType({
                    id: editingType.id,
                    data: formData,
                }).unwrap();
                toast({
                    title: "Success",
                    description: "Hotel type updated successfully",
                });
            } else {
                await createHotelType(formData as HotelTypeFormData).unwrap();
                toast({
                    title: "Success",
                    description: "Hotel type created successfully",
                });
            }
            setIsAddDialogOpen(false);
            setEditingType(null);
            setFormData({
                type_id: 0,
                name: "",
                description: "",
                icon: "",
                is_active: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save hotel type. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (type: HotelType) => {
        setEditingType(type);
        setFormData({
            type_id: type.type_id || 0,
            name: type.name,
            description: type.description || "",
            icon: type.icon || "",
            is_active: type.is_active ?? true,
        });
        setIsAddDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteHotelType(id).unwrap();
            toast({
                title: "Success",
                description: "Hotel type deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete hotel type. Please try again.",
                variant: "destructive",
            });
        }
    };

    const filteredTypes = hotelTypesResponse?.data.results?.filter(
        (type: HotelType) => {
            const matchesSearch =
                type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                type.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                selectedStatus === "all" ||
                (selectedStatus === "active" && type.is_active) ||
                (selectedStatus === "inactive" && !type.is_active);

            return matchesSearch && matchesStatus;
        }
    );

    if (!isMounted) {
        return <CenterLoader />;
    }

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
                                Hotel Types
                            </h1>
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={(open) => {
                                    setIsAddDialogOpen(open);
                                    if (!open) {
                                        setEditingType(null);
                                        setFormData({
                                            type_id: 0,
                                            name: "",
                                            description: "",
                                            icon: "",
                                            is_active: true,
                                        });
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Hotel Type
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <motion.div
                                        variants={dialogVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <DialogHeader>
                                            <DialogTitle>
                                                {editingType
                                                    ? "Edit"
                                                    : "Add New"}{" "}
                                                Hotel Type
                                            </DialogTitle>
                                            <DialogDescription>
                                                Enter the details for the{" "}
                                                {editingType
                                                    ? "existing"
                                                    : "new"}{" "}
                                                hotel type.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="type_id">
                                                            Type ID
                                                        </label>
                                                        <Input
                                                            id="type_id"
                                                            type="number"
                                                            value={
                                                                formData.type_id ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    type_id:
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0,
                                                                })
                                                            }
                                                            placeholder="Enter type ID"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="name">
                                                            Type Name
                                                        </label>
                                                        <Input
                                                            id="name"
                                                            value={
                                                                formData.name
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    name: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            placeholder="Enter type name"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="description">
                                                        Description
                                                    </label>
                                                    <Textarea
                                                        id="description"
                                                        value={
                                                            formData.description
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                description:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        placeholder="Enter type description"
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="icon">
                                                        Icon
                                                    </label>
                                                    <Input
                                                        id="icon"
                                                        value={formData.icon}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                icon: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder="Enter icon name or class"
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Use Lucide React icon
                                                        names (e.g., Building2,
                                                        Hotel, etc.)
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="is_active"
                                                        checked={
                                                            formData.is_active
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                is_active:
                                                                    e.target
                                                                        .checked,
                                                            })
                                                        }
                                                        className="form-checkbox h-4 w-4"
                                                    />
                                                    <label htmlFor="is_active">
                                                        Active
                                                    </label>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    onClick={() =>
                                                        setIsAddDialogOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit">
                                                    {editingType
                                                        ? "Update"
                                                        : "Save"}{" "}
                                                    Hotel Type
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </motion.div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <motion.div
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <Input
                                placeholder="Search hotel types..."
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

                        {isLoadingTypes ? (
                            <CenterLoader />
                        ) : (
                            <motion.div
                                className="border rounded-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Icon</TableHead>
                                            <TableHead className="text-right">
                                                Hotel Count
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Active
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence mode="popLayout">
                                            {filteredTypes?.map(
                                                (type, index) => (
                                                    <motion.tr
                                                        key={type.id}
                                                        variants={
                                                            tableRowVariants
                                                        }
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
                                                            <div className="flex items-center gap-2">
                                                                {type.icon ? (
                                                                    <Building2
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-muted-foreground"
                                                                    />
                                                                ) : (
                                                                    <Building2
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-muted-foreground"
                                                                    />
                                                                )}
                                                                {type.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-md truncate">
                                                            {type.description ||
                                                                "No description"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {type.icon ? (
                                                                <span className="text-sm bg-muted px-2 py-1 rounded">
                                                                    {type.icon}
                                                                </span>
                                                            ) : (
                                                                "No icon"
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {type.hotel_count ||
                                                                0}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {type.is_active
                                                                ? "✓"
                                                                : "-"}
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
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            type
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="h-4 w-4" />
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
                                                                                Type
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Are
                                                                                you
                                                                                sure
                                                                                you
                                                                                want
                                                                                to
                                                                                delete
                                                                                this
                                                                                hotel
                                                                                type?
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
                                                                                    handleDelete(
                                                                                        type.id
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
                        )}
                    </motion.div>
                </SidebarInset>
            </SidebarProvider>
        </motion.div>
    );
}
