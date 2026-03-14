"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { Button } from "@/components/ui/button";
import { Map, List } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { HotelSearchParams } from "@/lib/types/hotel";

const SearchResultsMap = dynamic(
    () =>
        import("@/components/search/search-results-map").then((mod) => mod.SearchResultsMap),
    { ssr: false }
);

type ViewMode = "list" | "map";

function searchParamsToQueryString(params: HotelSearchParams): string {
    const q = new URLSearchParams();
    if (params.city) q.set("city", params.city);
    if (params.stars != null) q.set("stars", String(params.stars));
    if (params.minRating != null) q.set("min_rating", String(params.minRating));
    if (params.priceMin != null) q.set("price_min", String(params.priceMin));
    if (params.priceMax != null) q.set("price_max", String(params.priceMax));
    if (params.facilities?.length)
        q.set("facilities", params.facilities.join(","));
    if (params.q) q.set("q", params.q);
    if (params.page != null && params.page > 1) q.set("page", String(params.page));
    return q.toString();
}

export default function SearchPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const router = useRouter();
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState<HotelSearchParams>(() => {
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
            minRating: minRatingParam ? parseInt(minRatingParam, 10) : undefined,
            priceMin: priceMinParam ? parseInt(priceMinParam, 10) : undefined,
            priceMax: priceMaxParam ? parseInt(priceMaxParam, 10) : undefined,
            facilities: facilitiesParam
                ? facilitiesParam.split(",").filter(Boolean)
                : undefined,
            q,
            page: pageParam ? parseInt(pageParam, 10) : 1,
        };
    });

    const handlePageChange = useCallback((page: number) => {
        setSearchParams((prev) => ({ ...prev, page }));
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const query = searchParamsToQueryString(searchParams);
        const currentSearch =
            typeof window !== "undefined"
                ? (window.location.search && window.location.search.slice(1)) || ""
                : "";
        if (query !== currentSearch) {
            const url = query ? `${pathname}?${query}` : pathname;
            router.replace(url, { scroll: false });
        }
    }, [isMounted, pathname, router, searchParams]);

    const handleFiltersChange = useCallback(
        (filters: {
            priceMin?: number;
            priceMax?: number;
            hotelTypes?: string[];
            rating?: number;
            facilities?: string[];
        }) => {
            setSearchParams((prev) => ({
                ...prev,
                priceMin: filters.priceMin,
                priceMax: filters.priceMax,
                minRating: filters.rating,
                facilities: filters.facilities,
                page: 1,
            }));
        },
        []
    );

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
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4 mr-2" />
                                    List
                                </Button>
                                <Button
                                    variant={viewMode === "map" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("map")}
                                >
                                    <Map className="h-4 w-4 mr-2" />
                                    Map
                                </Button>
                            </div>
                        </div>
                        {viewMode === "list" ? (
                            <SearchResults
                                searchParams={searchParams}
                                onPageChange={handlePageChange}
                            />
                        ) : (
                            <SearchResultsMap searchParams={searchParams} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
