"use client";

import { useEffect, useState } from "react";
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
import { Plus, Pencil, Trash2, Settings2, Search } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
    useGetAdminCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from "@/store/api/categoryApi";
import { Category, CategoryFormData } from "@/lib/types/facility";

export default function CategoriesAdmin() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        description: "",
        icon: "",
        isActive: true,
    });

    const { user } = useAuth();
    const { toast } = useToast();

    // API hooks
    const {
        data: categoriesResponse,
        isLoading: isCategoriesLoading,
        error: categoriesError,
        refetch: refetchCategories,
    } = useGetAdminCategoriesQuery({ page_size: 2000 });

    const [createCategory, { isLoading: isCreating }] =
        useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] =
        useDeleteCategoryMutation();

    const categories = categoriesResponse?.data?.results || [];

    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (category.description?.toLowerCase() || "").includes(
                searchQuery.toLowerCase()
            )
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Check if user is superuser
        if (user && !user.is_superuser) {
            toast({
                title: "Access Denied",
                description: "You don't have permission to access this page.",
                variant: "destructive",
            });
        }
    }, [user, toast]);

    useEffect(() => {
        if (categoriesError) {
            toast({
                title: "Error",
                description: "Failed to load categories. Please try again.",
                variant: "destructive",
            });
        }
    }, [categoriesError, toast]);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            icon: "",
            isActive: true,
        });
        setEditingCategory(null);
    };

    const handleAddCategory = async () => {
        try {
            const result = await createCategory(formData).unwrap();

            if (result.success) {
                setIsAddDialogOpen(false);
                resetForm();
                refetchCategories();

                toast({
                    title: "Success",
                    description: "Category created successfully.",
                });
            } else {
                throw new Error("Failed to create category");
            }
        } catch (error: any) {
            console.error("Create category error:", error);
            toast({
                title: "Error",
                description:
                    error?.data?.errors?.detail ||
                    "Failed to create category. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditCategory = async () => {
        if (!editingCategory) return;

        try {
            const result = await updateCategory({
                id: editingCategory.id,
                data: formData,
            }).unwrap();

            if (result.success) {
                setIsEditDialogOpen(false);
                resetForm();
                refetchCategories();

                toast({
                    title: "Success",
                    description: "Category updated successfully.",
                });
            } else {
                throw new Error("Failed to update category");
            }
        } catch (error: any) {
            console.error("Update category error:", error);
            toast({
                title: "Error",
                description:
                    error?.data?.errors?.detail ||
                    "Failed to update category. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            const result = await deleteCategory(categoryId).unwrap();

            if (result.success) {
                refetchCategories();
                toast({
                    title: "Success",
                    description: "Category deleted successfully.",
                });
            } else {
                throw new Error("Failed to delete category");
            }
        } catch (error: any) {
            console.error("Delete category error:", error);
            toast({
                title: "Error",
                description:
                    error?.data?.errors?.error ||
                    "Failed to delete category. Please try again.",
                variant: "destructive",
            });
        }
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            icon: category.icon || "",
            isActive: category.isActive,
        });
        setIsEditDialogOpen(true);
    };

    if (!isMounted) {
        return <CenterLoader />;
    }

    if (user && !user.is_superuser) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">
                        Access Denied
                    </h1>
                    <p className="text-muted-foreground">
                        You don't have permission to access this page.
                    </p>
                </div>
            </div>
        );
    }

    if (isCategoriesLoading) {
        return <CenterLoader />;
    }

    const isLoading = isCreating || isUpdating || isDeleting;

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <SidebarProvider>
                <AdminSidebar />
                <SidebarInset className="p-6">
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Categories
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage facility categories and their
                                    organization
                                </p>
                            </div>
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={setIsAddDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button onClick={resetForm}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Add New Category
                                        </DialogTitle>
                                        <DialogDescription>
                                            Create a new facility category to
                                            organize your amenities.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="name"
                                                className="text-sm font-medium"
                                            >
                                                Category Name *
                                            </label>
                                            <Input
                                                id="name"
                                                placeholder="Enter category name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="description"
                                                className="text-sm font-medium"
                                            >
                                                Description
                                            </label>
                                            <Textarea
                                                id="description"
                                                placeholder="Enter category description"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="icon"
                                                className="text-sm font-medium"
                                            >
                                                Icon (Emoji or Icon Name)
                                            </label>
                                            <Input
                                                id="icon"
                                                placeholder="🎯 or icon-name"
                                                value={formData.icon}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        icon: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={formData.isActive}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        isActive:
                                                            e.target.checked,
                                                    })
                                                }
                                                className="rounded"
                                            />
                                            <label
                                                htmlFor="isActive"
                                                className="text-sm font-medium"
                                            >
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsAddDialogOpen(false);
                                                resetForm();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddCategory}
                                            disabled={
                                                !formData.name.trim() ||
                                                isCreating
                                            }
                                        >
                                            {isCreating
                                                ? "Creating..."
                                                : "Create Category"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Search */}
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-8"
                                />
                            </div>
                            <Badge variant="secondary">
                                {filteredCategories.length} categories
                            </Badge>
                        </div>

                        {/* Categories Table */}
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-center">
                                            Icon
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Facilities
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center py-8"
                                            >
                                                <div className="flex flex-col items-center space-y-2">
                                                    <Settings2 className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">
                                                        {searchQuery
                                                            ? "No categories found matching your search."
                                                            : "No categories available."}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">
                                                    {category.name}
                                                </TableCell>
                                                <TableCell className="max-w-md">
                                                    <p
                                                        className="truncate"
                                                        title={
                                                            category.description ||
                                                            ""
                                                        }
                                                    >
                                                        {category.description ||
                                                            "No description"}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="text-lg">
                                                        {category.icon || "📋"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="outline">
                                                        {category.facility_count ||
                                                            0}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant={
                                                            category.isActive
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {category.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    category
                                                                )
                                                            }
                                                            disabled={isLoading}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-destructive hover:text-destructive"
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Delete
                                                                        Category
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        delete "
                                                                        {
                                                                            category.name
                                                                        }
                                                                        "? This
                                                                        action
                                                                        cannot
                                                                        be
                                                                        undone
                                                                        and will
                                                                        affect{" "}
                                                                        {
                                                                            category.facility_count
                                                                        }{" "}
                                                                        facilities.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDeleteCategory(
                                                                                category.id
                                                                            )
                                                                        }
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                        disabled={
                                                                            isDeleting
                                                                        }
                                                                    >
                                                                        {isDeleting
                                                                            ? "Deleting..."
                                                                            : "Delete"}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Edit Dialog */}
                        <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                        >
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Category</DialogTitle>
                                    <DialogDescription>
                                        Update the category information.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="edit-name"
                                            className="text-sm font-medium"
                                        >
                                            Category Name *
                                        </label>
                                        <Input
                                            id="edit-name"
                                            placeholder="Enter category name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="edit-description"
                                            className="text-sm font-medium"
                                        >
                                            Description
                                        </label>
                                        <Textarea
                                            id="edit-description"
                                            placeholder="Enter category description"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    description: e.target.value,
                                                })
                                            }
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="edit-icon"
                                            className="text-sm font-medium"
                                        >
                                            Icon (Emoji or Icon Name)
                                        </label>
                                        <Input
                                            id="edit-icon"
                                            placeholder="🎯 or icon-name"
                                            value={formData.icon}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    icon: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="edit-isActive"
                                            checked={formData.isActive}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isActive: e.target.checked,
                                                })
                                            }
                                            className="rounded"
                                        />
                                        <label
                                            htmlFor="edit-isActive"
                                            className="text-sm font-medium"
                                        >
                                            Active
                                        </label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditDialogOpen(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleEditCategory}
                                        disabled={
                                            !formData.name.trim() || isUpdating
                                        }
                                    >
                                        {isUpdating
                                            ? "Updating..."
                                            : "Update Category"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
