import { Category } from "./category";

export interface Facility {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    category: Category | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    hotelCount?: number;
}

export interface FacilityFormData {
    name: string;
    description?: string;
    icon?: string;
    categoryId?: string;
    isActive?: boolean;
}

export interface FacilityStats {
    totalFacilities: number;
    activeFacilities: number;
    inactiveFacilities: number;
    deletedFacilities: number;
    facilitiesByCategory: Record<string, number>;
    popularFacilities: Array<{ name: string; hotelCount: number }>;
    recentFacilities: Facility[];
}

// Re-export Category from category.ts for backwards compatibility
export type { Category } from "./category";

export interface CategoryFormData {
    name: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
}

export interface CategoryStats {
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    deletedCategories: number;
    categoriesWithFacilities: Array<{
        id: string;
        name: string;
        facilityCount: number;
        isActive: boolean;
    }>;
    recentCategories: Category[];
}
