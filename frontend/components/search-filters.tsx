"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetFormDataQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchFiltersProps {
    onFiltersChange: (filters: {
        price_min?: number;
        price_max?: number;
        hotel_types?: string[];
        rating?: number;
        facilities?: string[];
    }) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: response, isLoading, error } = useGetFormDataQuery();

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

    useEffect(() => {
        // Initialize filters from URL params
        const price_min = searchParams.get("price_min");
        const price_max = searchParams.get("price_max");
        const types = searchParams.get("hotel_types")?.split(",");
        const rating = searchParams.get("rating");
        const facilities = searchParams.get("facilities")?.split(",");

        if (price_min && price_max) {
            setPriceRange([parseInt(price_min), parseInt(price_max)]);
        }
        if (types) {
            setSelectedTypes(types);
        }
        if (rating) {
            setSelectedRating(parseInt(rating));
        }
        if (facilities) {
            setSelectedFacilities(facilities);
        }
    }, [searchParams]);

    useEffect(() => {
        onFiltersChange({
            price_min: priceRange[0],
            price_max: priceRange[1],
            hotel_types: selectedTypes.length > 0 ? selectedTypes : undefined,
            rating: selectedRating || undefined,
            facilities:
                selectedFacilities.length > 0 ? selectedFacilities : undefined,
        });
    }, [
        priceRange,
        selectedTypes,
        selectedRating,
        selectedFacilities,
        onFiltersChange,
    ]);

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !response.data) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {response?.errors?.detail || "Failed to load filters"}
                </AlertDescription>
            </Alert>
        );
    }

    const filters = response.data;
    const { hotel_types, facilities } = filters;

    const handleClearAll = () => {
        setPriceRange([0, 1000]);
        setSelectedTypes([]);
        setSelectedRating(null);
        setSelectedFacilities([]);
    };

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Price Range */}
                <div>
                    <h3 className="font-semibold mb-3">Price per night</h3>
                    <Slider
                        value={priceRange}
                        onValueChange={(value) =>
                            setPriceRange(value as [number, number])
                        }
                        max={1000}
                        min={0}
                        step={10}
                        className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}+</span>
                    </div>
                </div>

                <Separator />

                {/* Property Type */}
                <div>
                    <h3 className="font-semibold mb-3">Property Type</h3>
                    <div className="space-y-2">
                        {hotel_types.map(
                            (type: { id: string; name: string }) => (
                                <div
                                    key={type.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={type.id}
                                            checked={selectedTypes.includes(
                                                type.id
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedTypes([
                                                        ...selectedTypes,
                                                        type.id,
                                                    ]);
                                                } else {
                                                    setSelectedTypes(
                                                        selectedTypes.filter(
                                                            (id) =>
                                                                id !== type.id
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={type.id}
                                            className="text-sm"
                                        >
                                            {type.name}
                                        </label>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <Separator />

                {/* Rating */}
                <div>
                    <h3 className="font-semibold mb-3">Guest Rating</h3>
                    <div className="space-y-2">
                        {[9, 8, 7, 6].map((rating) => (
                            <div
                                key={rating}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`rating-${rating}`}
                                    checked={selectedRating === rating}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedRating(rating);
                                        } else {
                                            setSelectedRating(null);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={`rating-${rating}`}
                                    className="text-sm"
                                >
                                    {rating}+ Excellent
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Amenities */}
                <div>
                    <h3 className="font-semibold mb-3">Amenities</h3>
                    <div className="space-y-2">
                        {facilities.map(
                            (facility: { id: string; name: string }) => (
                                <div
                                    key={facility.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={facility.id}
                                            checked={selectedFacilities.includes(
                                                facility.id
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedFacilities([
                                                        ...selectedFacilities,
                                                        facility.id,
                                                    ]);
                                                } else {
                                                    setSelectedFacilities(
                                                        selectedFacilities.filter(
                                                            (id) =>
                                                                id !==
                                                                facility.id
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={facility.id}
                                            className="text-sm"
                                        >
                                            {facility.name}
                                        </label>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleClearAll}
                    >
                        Clear All
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() =>
                            onFiltersChange({
                                price_min: priceRange[0],
                                price_max: priceRange[1],
                                hotel_types:
                                    selectedTypes.length > 0
                                        ? selectedTypes
                                        : undefined,
                                rating: selectedRating || undefined,
                                facilities:
                                    selectedFacilities.length > 0
                                        ? selectedFacilities
                                        : undefined,
                            })
                        }
                    >
                        Apply Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
