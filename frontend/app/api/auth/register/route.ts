import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_ENDPOINTS } from "@/lib/api";
import {
    RegisterRequest,
    ApiResponse,
    RegisterResponse,
} from "@/lib/types/auth";

export async function POST(req: NextRequest) {
    try {
        const data: RegisterRequest = await req.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const result: ApiResponse<RegisterResponse> = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        result.errors?.detail ||
                        result.errors?.message ||
                        result.errors?.non_field_errors?.[0] ||
                        "Registration failed",
                },
                { status: response.status }
            );
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
