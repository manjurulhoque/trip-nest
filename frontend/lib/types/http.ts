// // API Error Response
// export interface ApiError {
//     message?: string;
//     detail?: string;
//     nonFieldErrors?: string[];
//     [key: string]: any;
// }

// // Generic API Response
// export interface ApiResponse<T> {
//     success: boolean;
//     data: T;
//     errors?: ApiError;
// }

// export interface PaginatedApiResponse<T> {
//     count: number;
//     next: string | null;
//     previous: string | null;
//     results: T[];
// }

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    errors?: Record<string, any>;
}

export interface PaginatedApiResponse<T>
    extends ApiResponse<{
        results: T[];
        count: number;
        next: string | null;
        previous: string | null;
    }> { }

export interface ApiError {
    success: false;
    errors: {
        detail?: string;
        message?: string;
        [key: string]: any;
    };
    data: null;
}
