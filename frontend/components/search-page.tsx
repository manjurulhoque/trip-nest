"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { SearchFilters } from "@/components/search-filters";
import { SearchResults } from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { Map, List } from "lucide-react";
import CenterLoader from "@/components/loaders/center-loader";

export default function SearchPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <CenterLoader />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <aside className="w-80 flex-shrink-0">
                        <SearchFilters />
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
                        <SearchResults />
                    </main>
                </div>
            </div>
        </div>
    );
}
