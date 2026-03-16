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
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import AsyncSelect from "react-select/async";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
    useGetAdminHotelChainsQuery,
    useCreateHotelChainMutation,
    useUpdateHotelChainMutation,
    useDeleteHotelChainMutation,
} from "@/store/api/hotelChainApi";
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
import { HotelChain, HotelChainFormData } from "@/lib/types/hotel";
import type { Country } from "@/lib/types/country";
import { coreApi } from "@/store/api/coreApi";

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

export default function HotelChainsAdmin() {
    const { isSuperuser } = useAuth();
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingChain, setEditingChain] = useState<HotelChain | null>(null);
    const [formData, setFormData] = useState<Partial<HotelChainFormData>>({
        name: "",
        description: "",
        logo: "",
        website: "",
        headquartersCountryId: "",
        isActive: true,
    });
    const [selectedHeadquartersCountry, setSelectedHeadquartersCountry] =
        useState<{ value: string; label: string } | null>(null);
    const [triggerAdminCountries] =
        coreApi.useLazyGetAdminCountriesQuery();
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Queries and Mutations
    const { data: hotelChainsResponse, isLoading: isLoadingChains } =
        useGetAdminHotelChainsQuery({ page: currentPage, page_size: pageSize }, {
            skip: !isSuperuser(),
        });
    const [createHotelChain] = useCreateHotelChainMutation();
    const [updateHotelChain] = useUpdateHotelChainMutation();
    const [deleteHotelChain] = useDeleteHotelChainMutation();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (editingChain?.headquartersCountry) {
            setSelectedHeadquartersCountry({
                value: editingChain.headquartersCountry.id,
                label: editingChain.headquartersCountry.name,
            });
        } else {
            setSelectedHeadquartersCountry(null);
        }
    }, [editingChain]);

    const loadCountryOptions = async (inputValue: string) => {
        const search = inputValue.trim() || undefined;
        const result = await triggerAdminCountries({
            page: 1,
            page_size: 20,
            search,
        }).unwrap();

        const countries = (result?.data?.results as Country[] | undefined) ?? [];

        return countries.map((country) => ({
            value: country.id,
            label: `${country.name} (${country.code})`,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingChain) {
                await updateHotelChain({
                    id: editingChain.id,
                    data: formData,
                }).unwrap();
                toast({
                    title: "Success",
                    description: "Hotel chain updated successfully",
                });
            } else {
                await createHotelChain(formData as HotelChainFormData).unwrap();
                toast({
                    title: "Success",
                    description: "Hotel chain created successfully",
                });
            }
            setIsAddDialogOpen(false);
            setEditingChain(null);
            setFormData({
                name: "",
                description: "",
                logo: "",
                website: "",
                headquartersCountryId: "",
                isActive: true,
            });
            setSelectedHeadquartersCountry(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save hotel chain. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (chain: HotelChain) => {
        setEditingChain(chain);
        setFormData({
            name: chain.name,
            description: chain.description || "",
            logo: chain.logo || "",
            website: chain.website || "",
            headquartersCountryId: chain.headquartersCountry?.id || "",
            isActive: chain.isActive ?? true,
        });
        setIsAddDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteHotelChain(id).unwrap();
            toast({
                title: "Success",
                description: "Hotel chain deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete hotel chain. Please try again.",
                variant: "destructive",
            });
        }
    };

    const filteredChains = hotelChainsResponse?.data.results?.filter(
        (chain: HotelChain) => {
            const matchesSearch =
                chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chain.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                selectedStatus === "all" ||
                (selectedStatus === "active" && chain.isActive) ||
                (selectedStatus === "inactive" && !chain.isActive);

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
                                Hotel Chains
                            </h1>
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={(open) => {
                                    setIsAddDialogOpen(open);
                                    if (!open) {
                                        setEditingChain(null);
                                        setFormData({
                                            name: "",
                                            description: "",
                                            logo: "",
                                            website: "",
                                            headquartersCountryId: "",
                                            isActive: true,
                                        });
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Hotel Chain
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
                                                {editingChain
                                                    ? "Edit"
                                                    : "Add New"}{" "}
                                                Hotel Chain
                                            </DialogTitle>
                                            <DialogDescription>
                                                Enter the details for the{" "}
                                                {editingChain
                                                    ? "existing"
                                                    : "new"}{" "}
                                                hotel chain.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="name">
                                                            Chain Name
                                                        </label>
                                                        <Input
                                                            id="name"
                                                            value={
                                                                formData.name
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    name: e.target.value,
                                                                })
                                                            }
                                                            placeholder="Enter chain name"
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
                                                                description: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Enter chain description"
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="logo">
                                                            Logo URL
                                                        </label>
                                                        <Input
                                                            id="logo"
                                                            value={
                                                                formData.logo
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    logo: e.target.value,
                                                                })
                                                            }
                                                            placeholder="Enter logo URL"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="website">
                                                            Website
                                                        </label>
                                                        <Input
                                                            id="website"
                                                            value={
                                                                formData.website
                                                            }
                                                            onChange={(e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    website: e.target.value,
                                                                })
                                                            }
                                                            placeholder="Enter website URL"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="headquartersCountry">
                                                        Headquarters Country
                                                    </label>
                                                    <AsyncSelect
                                                        cacheOptions
                                                        defaultOptions
                                                        loadOptions={loadCountryOptions}
                                                        value={
                                                            selectedHeadquartersCountry
                                                        }
                                                        onChange={(
                                                            option: any
                                                        ) => {
                                                            const nextOption =
                                                                option
                                                                    ? {
                                                                          value: option.value,
                                                                          label: option.label,
                                                                      }
                                                                    : null;
                                                            setSelectedHeadquartersCountry(
                                                                nextOption
                                                            );
                                                            setFormData({
                                                                ...formData,
                                                                headquartersCountryId:
                                                                    nextOption?.value ??
                                                                    "",
                                                            });
                                                        }}
                                                        placeholder="Search and select a country..."
                                                        inputId="headquartersCountry"
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2">
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
                                                    <label htmlFor="isActive">
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
                                                    {editingChain
                                                        ? "Update"
                                                        : "Save"}{" "}
                                                    Hotel Chain
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
                                placeholder="Search hotel chains..."
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

                        {isLoadingChains ? (
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
                                            <TableHead>Chain Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Website</TableHead>
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
                                            {filteredChains?.map(
                                                (chain, index) => (
                                                    <motion.tr
                                                        key={chain.id}
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
                                                            {chain.name}
                                                        </TableCell>
                                                        <TableCell className="max-w-md truncate">
                                                            {chain.description || "No description"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {chain.website ? (
                                                                <a
                                                                    href={
                                                                        chain.website
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                                                >
                                                                    <ExternalLink
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    Website
                                                                </a>
                                                            ) : (
                                                                "No website"
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {chain.hotelCount || 0}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {chain.isActive
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
                                                                            chain
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
                                                                                Delete Hotel Chain
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Are you sure you want to delete this hotel chain?
                                                                                This action cannot be undone.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        chain.id
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
