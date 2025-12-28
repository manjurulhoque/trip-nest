import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserDetail } from "./lib/types/auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: UserDetail;
        accessToken: string;
        error?: string;
    }

    interface User extends DefaultUser, UserDetail {
        accessToken: string;
        refreshToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        user: UserDetail;
        error?: string;
        accessTokenExpires: number;
    }
}
