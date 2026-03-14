import { Suspense } from "react";
import CheckoutPage from "@/components/checkout/checkout-page";
import CenterLoader from "@/components/loaders/center-loader";

export const metadata = {
    title: "Checkout | TripNest",
    description:
        "Complete your hotel booking securely. Review your reservation details and payment information.",
};

export default function Checkout() {
    return (
        <Suspense fallback={<CenterLoader />}>
            <CheckoutPage />
        </Suspense>
    );
}
