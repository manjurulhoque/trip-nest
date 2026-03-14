import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_ENDPOINTS } from "@/lib/api";
import {
    RegisterRequest,
    RegisterResponse,
} from "@/lib/types/auth";
import { ApiResponse } from "@/lib/types/http";

export async function POST(req: NextRequest) {
    try {
        const data: RegisterRequest = await req.json();

        const response = await fetch(
            `${process.env.BACKEND_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
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
                    error: "Registration failed",
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
