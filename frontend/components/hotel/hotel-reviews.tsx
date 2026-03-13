"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp } from "lucide-react";
import { useGetHotelQuery } from "@/store/api/hotelApi";
import CenterLoader from "@/components/loaders/center-loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { HotelReview } from "@/lib/types/hotel";

interface HotelReviewsProps {
    hotelId: string;
}

interface RatingBreakdown {
    stars: number;
    count: number;
    percentage: number;
}

interface CategoryRating {
    category: string;
    rating: number;
}

export function HotelReviews({ hotelId }: HotelReviewsProps) {
    const { data: response, isLoading, error } = useGetHotelQuery(hotelId);

    if (isLoading) {
        return <CenterLoader />;
    }

    if (error || !response?.success || !response.data) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {response?.errors?.detail || "Failed to load hotel reviews"}
                </AlertDescription>
            </Alert>
        );
    }

    const hotel = response.data;
    const reviews: HotelReview[] = hotel.reviews || [];
    const ratingBreakdown: RatingBreakdown[] = hotel.ratingBreakdown || [];
    const categoryRatings: CategoryRating[] = hotel.categoryRatings || [];

    if (reviews.length === 0) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Guest Reviews</h2>
                    <p className="text-gray-600">No reviews available yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Guest Reviews</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <Star
                                className="h-6 w-6 fill-yellow-400 text-yellow-400 mr-2"
                                aria-hidden="true"
                            />
                            <span className="text-2xl font-bold">
                                {(hotel.averageRating ?? hotel.rating)?.toFixed(1)}
                            </span>
                            <span className="text-gray-600 ml-2">
                                ({hotel.totalReviews ?? hotel.reviewsCount} reviews)
                            </span>
                        </div>
                        <Badge className="bg-primary">
                            {(hotel.averageRating ?? hotel.rating ?? 0) >= 4.5
                                ? "Excellent"
                                : (hotel.averageRating ?? hotel.rating ?? 0) >= 4
                                    ? "Very Good"
                                    : "Good"}
                        </Badge>
                    </div>
                </div>
                <Button variant="outline">Write a Review</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">
                                Rating Breakdown
                            </h3>
                            <div className="space-y-3">
                                {ratingBreakdown.map((item) => (
                                    <div
                                        key={item.stars}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-sm w-6">
                                            {item.stars}
                                        </span>
                                        <Star
                                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                            aria-hidden="true"
                                        />
                                        <Progress
                                            value={item.percentage}
                                            className="flex-1"
                                        />
                                        <span className="text-sm text-gray-600 w-12">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">
                                Category Ratings
                            </h3>
                            <div className="space-y-3">
                                {categoryRatings.map((item) => (
                                    <div
                                        key={item.category}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm">
                                            {item.category}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-medium">
                                                {item.rating.toFixed(1)}
                                            </span>
                                            <Star
                                                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    {reviews.map((review) => (
                        <Card key={review.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={
                                                review.userAvatar ||
                                                "/placeholder.svg"
                                            }
                                        />
                                        <AvatarFallback>
                                            {review.userName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold">
                                                    {review.userName}
                                                </h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span>
                                                        {new Date(
                                                            review.createdAt
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "long",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                    {review.roomType && (
                                                        <>
                                                            <span>•</span>
                                                            <span>
                                                                {
                                                                    review.roomType
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                    {review.stayType && (
                                                        <>
                                                            <span>•</span>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    review.stayType
                                                                }
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {[
                                                    ...Array(
                                                        Math.round(
                                                            review.rating
                                                        )
                                                    ),
                                                ].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {review.title && (
                                            <h5 className="font-medium mb-2">
                                                {review.title}
                                            </h5>
                                        )}
                                        <p className="text-gray-700 mb-3">
                                            {review.comment}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="p-0 h-auto text-gray-600"
                                        >
                                            <ThumbsUp
                                                className="h-3 w-3 mr-1"
                                                aria-hidden="true"
                                            />
                                            Helpful ({review.helpfulCount})
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="text-center">
                        <Button variant="outline">Load More Reviews</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
