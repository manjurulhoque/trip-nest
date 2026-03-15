import type { HotelSearchParams } from "@/lib/types/hotel";

export function hotelUrlWithTripParams(
    hotelId: string,
    params: HotelSearchParams
): string {
    const base = `/hotel/${hotelId}`;
    if (
        !params.checkIn &&
        !params.checkOut &&
        params.adults == null &&
        params.children == null
    ) {
        return base;
    }
    const q = new URLSearchParams();
    if (params.checkIn) q.set("checkIn", params.checkIn);
    if (params.checkOut) q.set("checkOut", params.checkOut);
    if (params.adults != null) q.set("adults", String(params.adults));
    if (params.children != null) q.set("children", String(params.children));
    const query = q.toString();
    return query ? `${base}?${query}` : base;
}
