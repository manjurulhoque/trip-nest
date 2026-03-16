"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
    useGetAdminFacilitiesQuery,
    useCreateFacilityMutation,
    useUpdateFacilityMutation,
    useDeleteFacilityMutation,
} from "@/store/api/facilityApi";
import * as categoryApiHooks from "@/store/api/categoryApi";
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
import { Facility, FacilityFormData, Category } from "@/lib/types/facility";

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

export default function FacilitiesAdmin() {
    const { isSuperuser } = useAuth();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(
        null
    );
    const [formData, setFormData] = useState<Partial<FacilityFormData>>({
        name: "",
        description: "",
        categoryId: "",
        isActive: true,
    });

    // Queries and Mutations
    const { data: facilitiesResponse, isLoading: isLoadingFacilities } = useGetAdminFacilitiesQuery({ page_size: 2000 }, {
        skip: !isSuperuser(),
    });
    const { data: categoryResponse } = categoryApiHooks.useGetAdminCategoriesQuery({ page_size: 2000 });
    const [createFacility] = useCreateFacilityMutation();
    const [updateFacility] = useUpdateFacilityMutation();
    const [deleteFacility] = useDeleteFacilityMutation();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Helper function to get category name by category object or ID
    const getCategoryNameById = (
        category: Category | null | string
    ): string => {
        if (!category) return "Uncategorized";
        // If it's already a Category object, return its name
        if (
            typeof category === "object" &&
            "name" in category &&
            category.name
        ) {
            return category.name;
        }
        // If it's a string ID, find the category by ID
        if (typeof category === "string" && categoryResponse?.data?.results) {
            const foundCategory = categoryResponse.data.results.find(
                (cat) => cat.id === category
            );
            return foundCategory?.name || "Uncategorized";
        }
        return "Uncategorized";
    };

    // Helper function to get category ID from category object
    const getCategoryId = (category: Category | null | string): string => {
        if (!category) return "none";
        if (typeof category === "object" && "id" in category && category.id) {
            return category.id;
        }
        if (typeof category === "string") {
            return category;
        }
        return "none";
    };

    if (!isMounted) {
        return <CenterLoader />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const categoryId = formData.categoryId === "none" ? "" : formData.categoryId;

            if (editingFacility) {
                await updateFacility({
                    id: editingFacility.id,
                    data: {
                        ...formData,
                        categoryId: categoryId || "",
                    },
                }).unwrap();
                toast.success("Facility updated successfully");
            } else {
                await createFacility({
                    name: formData.name!,
                    description: formData.description,
                    categoryId: categoryId || undefined,
                    isActive: formData.isActive,
                }).unwrap();
                toast.success("Facility created successfully");
            }
            setIsAddDialogOpen(false);
            setEditingFacility(null);
            setFormData({
                name: "",
                description: "",
                categoryId: "none",
                isActive: true,
            });
        } catch (error) {
            toast.error("Failed to save facility. Please try again.");
        }
    };

    const handleEdit = (facility: Facility) => {
        setEditingFacility(facility);
        setFormData({
            name: facility.name,
            description: facility.description || "",
            categoryId: getCategoryId(facility.category),
            isActive: facility.isActive,
        });
        setIsAddDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteFacility(id).unwrap();
            toast.success("Facility deleted successfully");
        } catch (error) {
            toast.error("Failed to delete facility. Please try again.");
        }
    };

    const filteredFacilities = facilitiesResponse?.data.results?.filter(
        (facility: Facility) => {
            const categoryName = getCategoryNameById(facility.category);

            const matchesSearch =
                facility.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                facility.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                categoryName.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === "all" ||
                getCategoryId(facility.category) === selectedCategory;

            return matchesSearch && matchesCategory;
        }
    );

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
                                Facilities
                            </h1>
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={(open) => {
                                    setIsAddDialogOpen(open);
                                    if (!open) {
                                        setEditingFacility(null);
                                        setFormData({
                                            name: "",
                                            description: "",
                                            categoryId: "none",
                                            isActive: true,
                                        });
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Facility
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
                                                {editingFacility
                                                    ? "Edit"
                                                    : "Add New"}{" "}
                                                Facility
                                            </DialogTitle>
                                            <DialogDescription>
                                                Enter the details for the{" "}
                                                {editingFacility
                                                    ? "existing"
                                                    : "new"}{" "}
                                                facility.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <label htmlFor="name">
                                                        Facility Name
                                                    </label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder="Enter facility name"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="category">
                                                        Category
                                                    </label>
                                                    <Select
                                                        value={
                                                            formData.categoryId
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            setFormData({
                                                                ...formData,
                                                                categoryId:
                                                                    value,
                                                            })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                No Category
                                                            </SelectItem>
                                                            {categoryResponse?.data?.results?.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        key={
                                                                            category.id
                                                                        }
                                                                        value={
                                                                            category.id
                                                                        }
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
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
                                                        placeholder="Enter facility description"
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <label htmlFor="isActive">
                                                        Active
                                                    </label>
                                                    <input
                                                        type="checkbox"
                                                        id="isActive"
                                                        checked={
                                                            formData.isActive
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                isActive:
                                                                    e.target
                                                                        .checked,
                                                            })
                                                        }
                                                        className="form-checkbox h-4 w-4"
                                                    />
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
                                                    {editingFacility
                                                        ? "Update"
                                                        : "Save"}{" "}
                                                    Facility
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
                                placeholder="Search facilities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-sm"
                            />
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {categoryResponse?.data?.results?.map(
                                        (category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </motion.div>

                        {isLoadingFacilities ? (
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
                                            <TableHead>Facility Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">
                                                Usage Count
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
                                            {filteredFacilities?.map(
                                                (facility, index) => (
                                                    <motion.tr
                                                        key={facility.id}
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
                                                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                                    >
                                                        <TableCell className="font-medium">
                                                            {facility.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {getCategoryNameById(
                                                                facility.category
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="max-w-md truncate">
                                                            {
                                                                facility.description
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {facility.hotelCount || 0}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {facility.isActive
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
                                                                            facility
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
                                                                                Facility
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
                                                                                facility?
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
                                                                                        facility.id
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
