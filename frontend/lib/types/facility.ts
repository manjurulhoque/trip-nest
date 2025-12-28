export interface Facility {
    id: number;
    facility_id: number;
    name: string;
    description: string | null;
    icon: string | null;
    category: Category | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    hotel_count?: number;
}

export interface FacilityFormData {
    facility_id: number;
    name: string;
    description?: string;
    icon?: string;
    category_id?: string;
    is_active?: boolean;
}

export interface FacilityStats {
    total_facilities: number;
    active_facilities: number;
    inactive_facilities: number;
    deleted_facilities: number;
    facilities_by_category: Record<string, number>;
    popular_facilities: Array<{ name: string; hotel_count: number }>;
    recent_facilities: Facility[];
}

// Category types
export interface Category {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    facility_count?: number;
}

export interface CategoryFormData {
    name: string;
    description?: string;
    icon?: string;
    is_active?: boolean;
}

export interface CategoryStats {
    total_categories: number;
    active_categories: number;
    inactive_categories: number;
    deleted_categories: number;
    categories_with_facilities: Array<{
        id: string;
        name: string;
        facility_count: number;
        is_active: boolean;
    }>;
    recent_categories: Category[];
}
