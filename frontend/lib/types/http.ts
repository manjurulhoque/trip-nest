// API Error Response
export interface ApiError {
    message?: string;
    detail?: string;
    nonFieldErrors?: string[];
    [key: string]: any;
}

// Generic API Response
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    errors?: ApiError;
}

export interface PaginatedApiResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
