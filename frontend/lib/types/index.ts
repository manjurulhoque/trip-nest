// Central exports for all types
export * from "./user";
export * from "./hotel";
export * from "./booking";
export * from "./checkout";
export * from "./http";
export * from "./wishlist";

// Common utility types
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface FilterOption extends SelectOption {
    count?: number;
}

// Form validation types
export interface ValidationError {
    field: string;
    message: string;
}

export interface FormState<T> {
    data: T;
    errors: Record<keyof T, string>;
    isSubmitting: boolean;
    isDirty: boolean;
}

// Search and filter types
export interface SearchFilters {
    query?: string;
    page?: number;
    pageSize?: number;
    ordering?: string;
    [key: string]: any;
}

export interface SortOption {
    value: string;
    label: string;
    direction: "asc" | "desc";
}

// UI state types
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export interface ModalState {
    isOpen: boolean;
    data?: any;
}

// Date and time types
export interface DateRange {
    start: Date;
    end: Date;
}

export interface TimeSlot {
    start: string;
    end: string;
    available: boolean;
}

// Location types
export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Address {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates?: Coordinates;
}

// File upload types
export interface FileUpload {
    file: File;
    preview?: string;
    progress?: number;
    error?: string;
}

export interface UploadedFile {
    id: string;
    url: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
}
