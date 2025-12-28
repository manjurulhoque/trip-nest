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
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function CitiesAdmin() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Mock data - replace with actual API call
    const cities = [
        {
            id: 1,
            name: "Paris",
            country: "France",
            region: "Île-de-France",
            totalProperties: 3500,
            isPopular: true,
            coordinates: "48.8566° N, 2.3522° E",
        },
        {
            id: 2,
            name: "Barcelona",
            country: "Spain",
            region: "Catalonia",
            totalProperties: 2800,
            isPopular: true,
            coordinates: "41.3851° N, 2.1734° E",
        },
        {
            id: 3,
            name: "Amsterdam",
            country: "Netherlands",
            region: "North Holland",
            totalProperties: 2100,
            isPopular: true,
            coordinates: "52.3676° N, 4.9041° E",
        },
        // Add more mock data as needed
    ];

    const countries = [
        "France",
        "Spain",
        "Netherlands",
        "Italy",
        "Germany",
        "United Kingdom",
        // Add more countries as needed
    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <CenterLoader />;
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <SidebarProvider>
                <AdminSidebar />
                <SidebarInset className="p-6">
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold">Cities</h1>
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={setIsAddDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add City
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New City</DialogTitle>
                                        <DialogDescription>
                                            Enter the details for the new city.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name">
                                                City Name
                                            </label>
                                            <Input
                                                id="name"
                                                placeholder="Enter city name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="country">
                                                Country
                                            </label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries.map(
                                                        (country) => (
                                                            <SelectItem
                                                                key={country}
                                                                value={country.toLowerCase()}
                                                            >
                                                                {country}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="region">
                                                Region/State
                                            </label>
                                            <Input
                                                id="region"
                                                placeholder="Enter region or state"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="latitude">
                                                    Latitude
                                                </label>
                                                <Input
                                                    id="latitude"
                                                    placeholder="e.g., 48.8566"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="longitude">
                                                    Longitude
                                                </label>
                                                <Input
                                                    id="longitude"
                                                    placeholder="e.g., 2.3522"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setIsAddDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">Save City</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="Search cities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-sm"
                            />
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Countries
                                    </SelectItem>
                                    {countries.map((country) => (
                                        <SelectItem
                                            key={country}
                                            value={country.toLowerCase()}
                                        >
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>City Name</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Region</TableHead>
                                        <TableHead className="text-right">
                                            Properties
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Popular
                                        </TableHead>
                                        <TableHead>Coordinates</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cities.map((city) => (
                                        <TableRow key={city.id}>
                                            <TableCell className="font-medium">
                                                {city.name}
                                            </TableCell>
                                            <TableCell>
                                                {city.country}
                                            </TableCell>
                                            <TableCell>{city.region}</TableCell>
                                            <TableCell className="text-right">
                                                {city.totalProperties}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {city.isPopular ? "✓" : "-"}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                                    {city.coordinates}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
