"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetFormDataQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface SearchFiltersProps {
    onFiltersChange: (filters: {
        priceMin?: number;
        priceMax?: number;
        hotelTypes?: string[];
        rating?: number;
        facilities?: string[];
    }) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
    const searchParams = useSearchParams();
    const { data: response, isLoading, error } = useGetFormDataQuery();

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Initialize filters from URL params
        const priceMin = searchParams.get("price_min");
        const priceMax = searchParams.get("price_max");
        const types = searchParams.get("hotel_types")?.split(",");
        const rating = searchParams.get("min_rating");
        const facilities = searchParams.get("facilities")?.split(",");

        if (priceMin && priceMax) {
            setPriceRange([parseInt(priceMin), parseInt(priceMax)]);
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
    }, [searchParams.toString()]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const urlPriceMin = searchParams.get("price_min");
        const urlPriceMax = searchParams.get("price_max");
        const urlRating = searchParams.get("min_rating");
        const urlFacilities = searchParams.get("facilities")?.split(",").filter(Boolean);
        const urlTypes = searchParams.get("hotel_types")?.split(",").filter(Boolean);
        const matchesUrl =
            String(priceRange[0]) === (urlPriceMin ?? "") &&
            String(priceRange[1]) === (urlPriceMax ?? "") &&
            (selectedRating === null ? !urlRating : String(selectedRating) === (urlRating ?? "")) &&
            (selectedFacilities.length === 0
                ? !urlFacilities?.length
                : selectedFacilities.join(",") === (urlFacilities ?? []).join(",")) &&
            (selectedTypes.length === 0
                ? !urlTypes?.length
                : selectedTypes.join(",") === (urlTypes ?? []).join(","));
        if (matchesUrl) return;
        onFiltersChange({
            priceMin: priceRange[0],
            priceMax: priceRange[1],
            hotelTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
            rating: selectedRating || undefined,
            facilities: selectedFacilities.length > 0 ? selectedFacilities : undefined,
        });
    }, [
        priceRange,
        selectedTypes,
        selectedRating,
        selectedFacilities,
        onFiltersChange,
        searchParams,
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
    const { types: hotelTypes, facilities } = filters;

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
                        {hotelTypes.map(
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
                                priceMin: priceRange[0],
                                priceMax: priceRange[1],
                                hotelTypes:
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
