// Checkout URL params (from room selection or search)
export interface CheckoutParams {
    hotelId: string;
    roomId: string;
    checkIn: string;  // YYYY-MM-DD
    checkOut: string; // YYYY-MM-DD
    adults: number;
    children: number;
}

export function getDefaultCheckoutDates(): { checkIn: string; checkOut: string } {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    return {
        checkIn: tomorrow.toISOString().slice(0, 10),
        checkOut: dayAfter.toISOString().slice(0, 10),
    };
}

export function parseCheckoutParams(searchParams: URLSearchParams): Partial<CheckoutParams> & { hotelId?: string; roomId?: string } {
    const defaults = getDefaultCheckoutDates();
    const hotelId = searchParams.get("hotelId") ?? undefined;
    const roomId = searchParams.get("roomId") ?? undefined;
    const checkIn = searchParams.get("checkIn") ?? defaults.checkIn;
    const checkOut = searchParams.get("checkOut") ?? defaults.checkOut;
    const adults = Math.max(1, parseInt(searchParams.get("adults") ?? "1", 10) || 1);
    const children = Math.max(0, parseInt(searchParams.get("children") ?? "0", 10) || 0);
    return { hotelId, roomId, checkIn, checkOut, adults, children };
}
