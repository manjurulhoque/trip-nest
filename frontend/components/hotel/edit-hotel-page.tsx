"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Star, MapPin, ArrowLeft } from "lucide-react";
import {
    useGetHotelQuery,
    useUpdateHotelMutation,
    useGetFormDataQuery,
} from "@/store/api/hotelApi";
import { toast } from "sonner";
import Link from "next/link";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { HostSidebar } from "../host/host-sidebar";
import DashboardHeader from "../dashboard/dashboard-header";
import CenterLoader from "../loaders/center-loader";

interface HotelFormData {
    name: string;
    address: string;
    city: string;
    address_suburb?: string;
    stars: number;
    latitude?: number;
    longitude?: number;
    rating?: number;
    chain?: string;
    hotel_type?: string;
    price?: number;
    facility_ids: string[];
    main_photo?: string;
    thumbnail?: string;
    is_active: boolean;
}

interface EditHotelPageProps {
    hotelId: string;
}

export default function EditHotelPage({ hotelId }: EditHotelPageProps) {
    const router = useRouter();
    const {
        data: hotelResponse,
        isLoading: hotelLoading,
        error: hotelError,
    } = useGetHotelQuery(hotelId);
    const { data: formData, isLoading: formDataLoading } =
        useGetFormDataQuery();
    const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();

    const [isMounted, setIsMounted] = useState(false);
    const [formValues, setFormValues] = useState<HotelFormData>({
        name: "",
        address: "",
        city: "",
        address_suburb: "",
        stars: 1,
        latitude: undefined,
        longitude: undefined,
        rating: undefined,
        chain: "none",
        hotel_type: "none",
        price: undefined,
        facility_ids: [],
        main_photo: "",
        thumbnail: "",
        is_active: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Pre-fill form with hotel data
    useEffect(() => {
        if (hotelResponse?.data) {
            const hotel = hotelResponse.data;
            setFormValues({
                name: hotel.name || "",
                address: hotel.address || "",
                city: hotel.city?.id || "",
                address_suburb: hotel.address_suburb || "",
                stars: hotel.stars || 1,
                latitude: hotel.latitude || undefined,
                longitude: hotel.longitude || undefined,
                rating: hotel.rating || undefined,
                chain: hotel.chain?.id || "none",
                hotel_type: hotel.hotel_type?.id || "none",
                price: hotel.price || undefined,
                facility_ids: hotel.facilities?.map((f) => f.id) || [],
                main_photo: hotel.main_photo || "",
                thumbnail: hotel.thumbnail || "",
                is_active: hotel.is_active,
            });
        }
    }, [hotelResponse]);

    const handleInputChange = (field: keyof HotelFormData, value: any) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleFacilityToggle = (facilityId: string) => {
        setFormValues((prev) => ({
            ...prev,
            facility_ids: prev.facility_ids.includes(facilityId)
                ? prev.facility_ids.filter((id) => id !== facilityId)
                : [...prev.facility_ids, facilityId],
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formValues.name.trim()) {
            newErrors.name = "Hotel name is required";
        }
        if (!formValues.address.trim()) {
            newErrors.address = "Address is required";
        }
        if (!formValues.city) {
            newErrors.city = "City is required";
        }
        if (formValues.stars < 1 || formValues.stars > 5) {
            newErrors.stars = "Stars must be between 1 and 5";
        }
        if (
            formValues.rating &&
            (formValues.rating < 0 || formValues.rating > 10)
        ) {
            newErrors.rating = "Rating must be between 0 and 10";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            const submitData = {
                ...formValues,
                chain:
                    formValues.chain && formValues.chain !== "none"
                        ? formValues.chain
                        : undefined,
                hotel_type:
                    formValues.hotel_type && formValues.hotel_type !== "none"
                        ? formValues.hotel_type
                        : undefined,
                price: formValues.price || undefined,
                latitude: formValues.latitude || undefined,
                longitude: formValues.longitude || undefined,
                rating: formValues.rating || undefined,
                main_photo: formValues.main_photo || undefined,
                thumbnail: formValues.thumbnail || undefined,
            };

            await updateHotel({ id: hotelId, data: submitData }).unwrap();
            toast.success("Hotel updated successfully!");
            router.push("/host/dashboard/hotels");
        } catch (error: any) {
            console.error("Error updating hotel:", error);
            toast.error("Failed to update hotel. Please try again.");
        }
    };

    if (!isMounted || hotelLoading || formDataLoading) {
        return <CenterLoader />;
    }

    if (hotelError) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardHeader />
                <SidebarProvider>
                    <HostSidebar />
                    <SidebarInset className="p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-red-600 mb-2">
                                    Error Loading Hotel
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Hotel not found or you don't have permission
                                    to edit it.
                                </p>
                                <Link href="/host/dashboard/hotels">
                                    <Button>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Hotels
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        );
    }

    const hotel = hotelResponse?.data;

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <SidebarProvider>
                <HostSidebar />
                <SidebarInset className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <Link href="/host/dashboard/hotels">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Hotel</h1>
                            <p className="text-gray-600">
                                Update {hotel?.name} details
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>Basic Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Hotel Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formValues.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter hotel name"
                                            className={
                                                errors.name
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">
                                            Address *
                                        </Label>
                                        <Textarea
                                            id="address"
                                            value={formValues.address}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter full address"
                                            rows={3}
                                            className={
                                                errors.address
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-500">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City *</Label>
                                            <Select
                                                value={formValues.city}
                                                onValueChange={(value) =>
                                                    handleInputChange(
                                                        "city",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        errors.city
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                >
                                                    <SelectValue placeholder="Select city" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formData?.data?.cities?.map(
                                                        (city) => (
                                                            <SelectItem
                                                                key={city.id}
                                                                value={city.id}
                                                            >
                                                                {city.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.city && (
                                                <p className="text-sm text-red-500">
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address_suburb">
                                                Suburb
                                            </Label>
                                            <Input
                                                id="address_suburb"
                                                value={
                                                    formValues.address_suburb
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "address_suburb",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter suburb"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="latitude">
                                                Latitude
                                            </Label>
                                            <Input
                                                id="latitude"
                                                type="number"
                                                step="any"
                                                value={
                                                    formValues.latitude || ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "latitude",
                                                        parseFloat(
                                                            e.target.value
                                                        ) || undefined
                                                    )
                                                }
                                                placeholder="Enter latitude"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="longitude">
                                                Longitude
                                            </Label>
                                            <Input
                                                id="longitude"
                                                type="number"
                                                step="any"
                                                value={
                                                    formValues.longitude || ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "longitude",
                                                        parseFloat(
                                                            e.target.value
                                                        ) || undefined
                                                    )
                                                }
                                                placeholder="Enter longitude"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Hotel Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Star className="h-5 w-5" />
                                        <span>Hotel Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stars">Stars *</Label>
                                        <Select
                                            value={formValues.stars.toString()}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "stars",
                                                    parseInt(value)
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.stars
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <SelectItem
                                                        key={star}
                                                        value={star.toString()}
                                                    >
                                                        {star} Star
                                                        {star > 1 ? "s" : ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.stars && (
                                            <p className="text-sm text-red-500">
                                                {errors.stars}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rating">
                                            Rating (0-10)
                                        </Label>
                                        <Input
                                            id="rating"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={formValues.rating || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "rating",
                                                    parseFloat(
                                                        e.target.value
                                                    ) || undefined
                                                )
                                            }
                                            placeholder="Enter rating"
                                            className={
                                                errors.rating
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.rating && (
                                            <p className="text-sm text-red-500">
                                                {errors.rating}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="chain">
                                            Hotel Chain
                                        </Label>
                                        <Select
                                            value={formValues.chain}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "chain",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select chain" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    No Chain
                                                </SelectItem>
                                                {formData?.data?.chains?.map(
                                                    (chain) => (
                                                        <SelectItem
                                                            key={chain.id}
                                                            value={chain.id}
                                                        >
                                                            {chain.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hotel_type">
                                            Hotel Type
                                        </Label>
                                        <Select
                                            value={formValues.hotel_type}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "hotel_type",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    No Type
                                                </SelectItem>
                                                {formData?.data?.hotel_types?.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type.id}
                                                            value={type.id}
                                                        >
                                                            {type.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price">
                                            Price per Night
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formValues.price || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "price",
                                                    parseFloat(
                                                        e.target.value
                                                    ) || undefined
                                                )
                                            }
                                            placeholder="Enter price"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_active"
                                                checked={formValues.is_active}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange(
                                                        "is_active",
                                                        checked
                                                    )
                                                }
                                            />
                                            <Label htmlFor="is_active">
                                                Hotel is active
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Images */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Upload className="h-5 w-5" />
                                        <span>Images</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="main_photo">
                                            Main Photo URL
                                        </Label>
                                        <Input
                                            id="main_photo"
                                            value={formValues.main_photo}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "main_photo",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter main photo URL"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="thumbnail">
                                            Thumbnail URL
                                        </Label>
                                        <Input
                                            id="thumbnail"
                                            value={formValues.thumbnail}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "thumbnail",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter thumbnail URL"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Facilities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Facilities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                        {formData?.data?.facilities?.map(
                                            (facility) => (
                                                <div
                                                    key={facility.id}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={facility.id}
                                                        checked={formValues.facility_ids.includes(
                                                            facility.id
                                                        )}
                                                        onCheckedChange={() =>
                                                            handleFacilityToggle(
                                                                facility.id
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={facility.id}
                                                        className="text-sm"
                                                    >
                                                        {facility.name}
                                                    </Label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <Link href="/host/dashboard/hotels">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Updating..." : "Update Hotel"}
                            </Button>
                        </div>
                    </form>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
