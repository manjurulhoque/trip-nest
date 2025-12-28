import UsersAdmin from "@/components/admin/users/users-admin";

export const metadata = {
    title: "Users | Admin Dashboard | TripNest",
    description:
        "Manage user accounts, roles, and permissions across the TripNest platform.",
};

export default function UsersPage() {
    return <UsersAdmin />;
}
