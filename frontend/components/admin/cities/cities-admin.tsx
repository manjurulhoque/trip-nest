"use client";

import { useEffect, useState, useMemo } from "react";
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
import { useGetCitiesQuery, useGetCountriesQuery } from "@/store/api/coreApi";
import type { CoreCity } from "@/store/api/coreApi";

const PAGE_SIZE = 20;

export default function CitiesAdmin() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [countryFilter, setCountryFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    const { data: citiesResponse, isLoading: citiesLoading } = useGetCitiesQuery(
        {
            page: currentPage,
            page_size: PAGE_SIZE,
            search: searchQuery.trim() || undefined,
        }
    );
    const { data: countriesResponse } = useGetCountriesQuery({
        page_size: 20,
    });

    const rawCities = citiesResponse?.data?.results ?? [];
    const cities: CoreCity[] = Array.isArray(rawCities) ? rawCities : [];
    const totalCount = citiesResponse?.data?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const rawCountries = countriesResponse?.data?.results ?? [];
    const countriesList = Array.isArray(rawCountries) ? rawCountries : [];

    const filteredCities = useMemo(() => {
        return cities.filter((city) => {
            const matchesCountry =
                countryFilter === "all" ||
                (city.countryName ?? "").toLowerCase() ===
                    countryFilter.toLowerCase();
            return matchesCountry;
        });
    }, [cities, countryFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, countryFilter]);

    const countries = useMemo(
        () => [...new Set(countriesList.map((c: { name: string }) => c.name))],
        [countriesList]
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || citiesLoading) {
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
                                                                value={country}
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
                                        <TableHead className="text-center">
                                            Popular
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Coordinates</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCities.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center text-muted-foreground py-8"
                                            >
                                                No cities found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCities.map((city) => (
                                            <TableRow key={city.id}>
                                                <TableCell className="font-medium text-foreground">
                                                    {city.name}
                                                </TableCell>
                                                <TableCell className="text-foreground">
                                                    {city.countryName ?? city.country ?? "—"}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {city.isPopular ? "✓" : "—"}
                                                </TableCell>
                                                <TableCell>
                                                    {city.isActive ? (
                                                        <span className="text-green-600">Active</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">Inactive</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm text-foreground">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" aria-hidden />
                                                        {city.latitude != null && city.longitude != null
                                                            ? `${Number(city.latitude).toFixed(4)}°, ${Number(city.longitude).toFixed(4)}°`
                                                            : "—"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Edit ${city.name}`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-600"
                                                            aria-label={`Delete ${city.name}`}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            {totalCount > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30 rounded-b-lg">
                                <p className="text-sm text-muted-foreground">
                                    Showing{" "}
                                    {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                                    {Math.min(
                                        currentPage * PAGE_SIZE,
                                        totalCount
                                    )}{" "}
                                    of {totalCount} cities
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={currentPage <= 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="px-3 py-1 text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
                                        disabled={currentPage >= totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
