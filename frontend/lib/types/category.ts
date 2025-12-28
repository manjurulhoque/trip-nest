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
