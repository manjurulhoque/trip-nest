"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { SearchFilters } from "@/components/search-filters";
import { SearchResults } from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { Map, List } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const [isMounted, setIsMounted] = useState(false);
    const urlSearchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState<{
        city?: string;
        stars?: number;
        min_rating?: number;
        price_min?: number;
        price_max?: number;
        facilities?: string[];
        q?: string;
        page?: number;
    }>(() => {
        const city = urlSearchParams.get("city") || undefined;
        const starsParam = urlSearchParams.get("stars");
        const minRatingParam = urlSearchParams.get("min_rating");
        const priceMinParam = urlSearchParams.get("price_min");
        const priceMaxParam = urlSearchParams.get("price_max");
        const facilitiesParam = urlSearchParams.get("facilities");
        const q = urlSearchParams.get("q") || undefined;
        const pageParam = urlSearchParams.get("page");

        return {
            city,
            stars: starsParam ? parseInt(starsParam, 10) : undefined,
            min_rating: minRatingParam ? parseInt(minRatingParam, 10) : undefined,
            price_min: priceMinParam ? parseInt(priceMinParam, 10) : undefined,
            price_max: priceMaxParam ? parseInt(priceMaxParam, 10) : undefined,
            facilities: facilitiesParam
                ? facilitiesParam.split(",").filter(Boolean)
                : undefined,
            q,
            page: pageParam ? parseInt(pageParam, 10) : undefined,
        };
    });
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleFiltersChange = (filters: {
        price_min?: number;
        price_max?: number;
        hotel_types?: string[];
        rating?: number;
        facilities?: string[];
    }) => {
        // setSearchParams((prev) => ({
        //     ...prev,
        //     price_min: filters.price_min,
        //     price_max: filters.price_max,
        //     min_rating: filters.rating,
        //     facilities: filters.facilities,
        // }));
    };

    if (!isMounted) {
        return <CenterLoader />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <aside className="w-80 flex-shrink-0">
                        <SearchFilters onFiltersChange={handleFiltersChange} />
                    </aside>
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">
                                Search Results
                            </h1>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <List className="h-4 w-4 mr-2" />
                                    List
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Map className="h-4 w-4 mr-2" />
                                    Map
                                </Button>
                            </div>
                        </div>
                        <SearchResults searchParams={searchParams} />
                    </main>
                </div>
            </div>
        </div>
    );
}
