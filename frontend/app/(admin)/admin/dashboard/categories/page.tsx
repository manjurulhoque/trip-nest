import CategoriesAdmin from "@/components/admin/categories/categories-admin";

export const metadata = {
    title: "Categories | Admin Dashboard | TripNest",
    description:
        "Manage facility categories and their organization across the TripNest platform.",
};

export default function CategoriesPage() {
    return <CategoriesAdmin />;
}
