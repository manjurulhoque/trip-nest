from rest_framework import status, permissions, filters
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count, Sum
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Hotel, HotelImage
from .serializers import (
    HotelListSerializer,
    HotelDetailSerializer,
    HotelCreateUpdateSerializer,
    HotelStatsSerializer,
    AdminHotelSerializer,
    HotelImageSerializer,
)
from users.permissions import IsHostOrReadOnly, IsSuperAdmin, IsVerifiedHost
from facilities.models import Facility
from core.models import City, HotelChain, HotelType
from utils.response import api_response


@extend_schema_view(
    list=extend_schema(
        summary="List Hotels",
        description="List all active hotels with filtering and search capabilities",
    ),
    create=extend_schema(
        summary="Create Hotel", description="Create a new hotel (verified hosts only)"
    ),
    retrieve=extend_schema(
        summary="Get Hotel Details",
        description="Get detailed information about a specific hotel",
    ),
    update=extend_schema(
        summary="Update Hotel",
        description="Update hotel information (owner or admin only)",
    ),
    partial_update=extend_schema(
        summary="Partially Update Hotel",
        description="Partially update hotel information (owner or admin only)",
    ),
    destroy=extend_schema(
        summary="Delete Hotel", description="Soft delete hotel (owner or admin only)"
    ),
)
class HotelViewSet(ModelViewSet):
    """Hotel management viewset"""

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "city",
        "stars",
        "hotel_type",
        "chain",
        "best_seller",
        "is_active",
        "owner",
        "facilities",
    ]
    search_fields = ["name", "address", "city__name"]
    ordering_fields = ["name", "rating", "price", "created_at", "stars"]
    ordering = ["-rating", "name"]

    def get_queryset(self):
        """Get queryset based on user permissions and action"""
        if self.action == "list":
            # Public listing - only active hotels
            return Hotel.objects.filter(is_active=True)
        elif self.request.user.is_superuser:
            # Admins can see all hotels
            return Hotel.objects.all()
        elif self.request.user.is_authenticated and self.request.user.is_host():
            # Hosts can see their own hotels + active hotels
            if self.action in ["update", "partial_update", "destroy"]:
                return Hotel.objects.filter(owner=self.request.user)
            else:
                return Hotel.objects.filter(
                    Q(is_active=True) | Q(owner=self.request.user)
                )
        else:
            # Guests can only see active hotels
            return Hotel.objects.filter(is_active=True)

    def get_serializer_class(self):
        """Return appropriate serializer based on user role and action"""
        if self.request.user.is_superuser:
            if self.action == "list":
                return HotelListSerializer
            elif self.action in ["create", "update", "partial_update"]:
                return AdminHotelSerializer
            else:
                return AdminHotelSerializer
        elif self.action == "list":
            return HotelListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return HotelCreateUpdateSerializer
        else:
            return HotelDetailSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == "list":
            permission_classes = [permissions.AllowAny]
        elif self.action == "retrieve":
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [IsVerifiedHost]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsHostOrReadOnly]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """Set owner when creating hotel"""
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def search(self, request):
        """Advanced hotel search with filters"""
        queryset = self.get_queryset()

        # Apply filters
        city = request.query_params.get("city")
        if city:
            queryset = queryset.filter(city__name__icontains=city)

        stars = request.query_params.get("stars")
        if stars:
            queryset = queryset.filter(stars__gte=stars)

        rating = request.query_params.get("min_rating")
        if rating:
            queryset = queryset.filter(rating__gte=rating)

        price_min = request.query_params.get("price_min")
        if price_min:
            queryset = queryset.filter(price__gte=price_min)

        price_max = request.query_params.get("price_max")
        if price_max:
            queryset = queryset.filter(price__lte=price_max)

        facilities = request.query_params.getlist("facilities[]")
        if facilities:
            queryset = queryset.filter(facilities__id__in=facilities).distinct()

        # Apply search
        query = request.query_params.get("q")
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(address__icontains=query)
                | Q(city__name__icontains=query)
            )

        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = HotelListSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)

        serializer = HotelListSerializer(
            queryset, many=True, context={"request": request}
        )
        return api_response(success=True, data=serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def featured(self, request):
        """Get featured hotels"""
        queryset = self.get_queryset().filter(best_seller=True, rating__gte=8.0)[:10]

        serializer = HotelListSerializer(
            queryset, many=True, context={"request": request}
        )
        return api_response(success=True, data=serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def popular_destinations(self, request):
        """Get popular hotel destinations"""
        destinations = (
            Hotel.objects.filter(is_active=True)
            .values("city__name", "city__country__name", "city__id")
            .annotate(hotel_count=Count("id"), avg_rating=Avg("rating"))
            .order_by("-hotel_count")[:20]
        )

        return api_response(success=True, data=destinations)

    @action(detail=True, methods=["get"], permission_classes=[permissions.AllowAny])
    def rooms(self, request, pk=None):
        """Get hotel rooms"""
        hotel = self.get_object()
        from rooms.serializers import RoomListSerializer

        rooms = hotel.rooms.filter(is_active=True)

        serializer = RoomListSerializer(rooms, many=True, context={"request": request})
        return api_response(success=True, data=serializer.data)

    @action(detail=True, methods=["get"], permission_classes=[permissions.AllowAny])
    def facilities(self, request, pk=None):
        """Get hotel facilities"""
        hotel = self.get_object()
        from facilities.serializers import FacilitySerializer

        facilities = hotel.facilities.filter(is_active=True)

        serializer = FacilitySerializer(facilities, many=True)
        return api_response(success=True, data=serializer.data)

    @action(detail=True, methods=["get"], permission_classes=[IsHostOrReadOnly])
    def stats(self, request, pk=None):
        """Get hotel statistics"""
        hotel = self.get_object()
        serializer = HotelStatsSerializer(hotel)
        return api_response(success=True, data=serializer.data)

    @action(
        detail=False,
        url_path="my-hotels",
        methods=["get"],
        permission_classes=[IsVerifiedHost],
    )
    def my_hotels(self, request):
        """Get current user's hotels"""
        hotels = Hotel.objects.filter(owner=request.user)
        serializer = HotelListSerializer(
            hotels, many=True, context={"request": request}
        )
        return api_response(success=True, data=serializer.data)

    @action(
        detail=False,
        url_path="dashboard-stats",
        methods=["get"],
        permission_classes=[IsVerifiedHost],
    )
    def dashboard_stats(self, request):
        """Get host dashboard statistics"""
        hotels = Hotel.objects.filter(owner=request.user)

        # Calculate total rooms by summing room counts across all hotels
        total_rooms = 0
        for hotel in hotels:
            total_rooms += hotel.rooms.filter(is_active=True).count()

        stats = {
            "total_hotels": hotels.count(),
            "active_hotels": hotels.filter(is_active=True).count(),
            "total_rooms": total_rooms,
            "avg_rating": hotels.aggregate(avg=Avg("rating"))["avg"],
            "recent_hotels": HotelListSerializer(
                hotels.order_by("-created_at")[:5],
                many=True,
                context={"request": request},
            ).data,
        }

        return api_response(success=True, data=stats)

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def form_data(self, request):
        """Get data needed for hotel forms"""
        data = {
            "cities": City.objects.values("id", "name", "country__name"),
            "chains": HotelChain.objects.values("id", "name"),
            "types": HotelType.objects.values("id", "name"),
            "facilities": Facility.objects.values("id", "name", "category"),
        }
        return api_response(success=True, data=data)

    @action(detail=True, methods=["post"], permission_classes=[IsHostOrReadOnly])
    def toggle_active(self, request, pk=None):
        """Toggle hotel active status"""
        hotel = self.get_object()
        hotel.is_active = not hotel.is_active
        hotel.save()

        return api_response(
            success=True,
            data={
                "hotel": HotelDetailSerializer(
                    hotel, context={"request": request}
                ).data,
            },
        )


@extend_schema_view(
    list=extend_schema(summary="List Hotel Images", description="List hotel images"),
    create=extend_schema(
        summary="Create Hotel Image", description="Upload hotel image (owner only)"
    ),
    retrieve=extend_schema(
        summary="Get Hotel Image", description="Get hotel image details"
    ),
    update=extend_schema(
        summary="Update Hotel Image", description="Update hotel image (owner only)"
    ),
    partial_update=extend_schema(
        summary="Partially Update Hotel Image",
        description="Partially update hotel image (owner only)",
    ),
    destroy=extend_schema(
        summary="Delete Hotel Image", description="Delete hotel image (owner only)"
    ),
)
class HotelImageViewSet(ModelViewSet):
    """Hotel image management viewset"""

    serializer_class = HotelImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter images based on user permissions"""
        if self.request.user.is_superuser:
            return HotelImage.objects.all()
        elif self.request.user.is_host():
            return HotelImage.objects.filter(hotel__owner=self.request.user)
        else:
            return HotelImage.objects.none()

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsHostOrReadOnly]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """Set hotel when creating image"""
        hotel_id = self.kwargs.get("hotel_pk")
        hotel = Hotel.objects.get(pk=hotel_id)

        if not (hotel.owner == self.request.user or self.request.user.is_superuser):
            return api_response(
                success=False,
                errors={"error": "Permission denied"},
                status_code=status.HTTP_403_FORBIDDEN,
            )

        serializer.save(hotel=hotel)


# Admin-specific views
@extend_schema_view(
    list=extend_schema(
        summary="Admin - List All Hotels",
        description="Admin view to list all hotels with full details",
    ),
    create=extend_schema(
        summary="Admin - Create Hotel",
        description="Admin create hotel with full permissions",
    ),
    retrieve=extend_schema(
        summary="Admin - Get Hotel Details",
        description="Admin view hotel with full details",
    ),
    update=extend_schema(
        summary="Admin - Update Hotel",
        description="Admin update hotel with full permissions",
    ),
    partial_update=extend_schema(
        summary="Admin - Partially Update Hotel",
        description="Admin partially update hotel with full permissions",
    ),
    destroy=extend_schema(
        summary="Admin - Delete Hotel", description="Admin delete hotel permanently"
    ),
)
class AdminHotelViewSet(ModelViewSet):
    """Admin hotel management viewset"""

    queryset = Hotel.objects.all()
    serializer_class = AdminHotelSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "city",
        "stars",
        "hotel_type",
        "chain",
        "is_active",
        "is_deleted",
    ]
    search_fields = ["name", "address", "city__name", "owner__email"]
    ordering_fields = ["name", "rating", "created_at", "stars"]
    ordering = ["-created_at"]

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Get hotel statistics for admin dashboard"""
        stats = {
            "total_hotels": Hotel.objects.count(),
            "active_hotels": Hotel.objects.filter(is_active=True).count(),
            "inactive_hotels": Hotel.objects.filter(is_active=False).count(),
            "deleted_hotels": Hotel.all_objects.filter(is_deleted=True).count(),
            "hotels_by_city": {},
            "hotels_by_type": {},
            "popular_hotels": [],
            "recent_hotels": [],
        }

        # Hotels by city
        cities = (
            Hotel.objects.values("city__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        for city in cities:
            stats["hotels_by_city"][city["city__name"] or "uncategorized"] = city[
                "count"
            ]

        # Hotels by type
        types = (
            Hotel.objects.values("hotel_type__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        for hotel_type in types:
            stats["hotels_by_type"][
                hotel_type["hotel_type__name"] or "uncategorized"
            ] = hotel_type["count"]

        # Popular hotels (by rating and reviews)
        stats["popular_hotels"] = list(
            Hotel.objects.filter(is_active=True)
            .annotate(review_count=Count("reviews"))
            .order_by("-rating", "-review_count")[:10]
            .values("name", "rating", "review_count")
        )

        # Recent hotels
        recent_hotels = Hotel.objects.order_by("-created_at")[:5]
        stats["recent_hotels"] = AdminHotelSerializer(
            recent_hotels, many=True, context={"request": request}
        ).data

        return api_response(success=True, data=stats)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        """Restore a soft-deleted hotel"""
        try:
            hotel = Hotel.all_objects.get(pk=pk, is_deleted=True)
            hotel.restore()
            return api_response(
                success=True,
                data={
                    "hotel": AdminHotelSerializer(
                        hotel, context={"request": request}
                    ).data,
                },
            )
        except Hotel.DoesNotExist:
            return api_response(
                success=False,
                errors={"error": "Hotel not found or not deleted"},
                status_code=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["delete"])
    def hard_delete(self, request, pk=None):
        """Permanently delete a hotel"""
        hotel = self.get_object()
        hotel.hard_delete()
        return api_response(
            success=True,
            data={},
            status_code=status.HTTP_204_NO_CONTENT,
        )
