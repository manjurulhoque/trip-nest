import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { API_ENDPOINTS } from "@/lib/api";
import { LoginResponse, UserDetail } from "@/lib/types/auth";
import { ApiResponse } from "@/lib/types";

// Function to refresh access token
async function refreshAccessToken(token: JWT) {
    try {
        const response = await fetch(
            `${process.env.BACKEND_URL}users/auth/token/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: token.refreshToken,
                }),
            }
        );

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access,
            refreshToken: refreshedTokens.refresh ?? token.refreshToken,
            accessTokenExpires: Date.now() + 60 * 60 * 1000, // 60 minutes to match backend
            error: undefined,
        };
    } catch (error) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(
                        `${process.env.BACKEND_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
                        {
                            method: "POST",
                            body: JSON.stringify(credentials),
                            headers: { "Content-Type": "application/json" },
                        }
                    );

                    const response: ApiResponse<LoginResponse> = await res.json();
                    console.log(response);

                    if (!response.success) {
                        throw new Error("Invalid credentials");
                    }

                    const { user, access, refresh } = response.data;

                    return {
                        ...user,
                        accessToken: access,
                        refreshToken: refresh,
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Invalid credentials");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update" && session) {
                return { ...token, ...session };
            }

            if (user) {
                token.accessToken = (user as any).accessToken;
                token.refreshToken = (user as any).refreshToken;
                token.user = user as UserDetail;
                // Set token expiry time to match backend: 60 minutes
                token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user = token.user;
            session.error = token.error;

            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/login",
        error: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days to match refresh token lifetime
    },
    secret: "SECRET1234567890",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
