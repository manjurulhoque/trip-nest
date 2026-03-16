from rest_framework import status, permissions, filters
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count, F, Case, When, Value, IntegerField
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from .models import Hotel, HotelImage, HotelChain, HotelType
from .serializers import (
    HotelListSerializer,
    HotelDetailSerializer,
    HotelCreateUpdateSerializer,
    HotelStatsSerializer,
    AdminHotelSerializer,
    HotelImageSerializer,
    HotelChainSerializer,
    HotelChainCreateUpdateSerializer,
    AdminHotelChainSerializer,
    HotelTypeSerializer,
    HotelTypeCreateUpdateSerializer,
    AdminHotelTypeSerializer,
)
from users.permissions import IsHostOrReadOnly, IsSuperAdmin, IsVerifiedHost
from facilities.models import Facility
from core.models import City
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
        public_actions = [
            "list",
            "retrieve",
            "search",
            "featured",
            "popular_destinations",
            "rooms",
            "facilities",
            "similar",
            "form_data",
        ]
        if self.action in public_actions:
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

    def retrieve(self, request, *args, **kwargs):
        """Return single hotel in api_response format."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, data=serializer.data)

    def list(self, request, *args, **kwargs):
        """Return paginated list in api_response format."""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated = self.get_paginated_response(serializer.data)
            return api_response(success=True, data=paginated.data)
        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, data=serializer.data)

    def create(self, request, *args, **kwargs):
        """Create hotel and return in api_response format."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return api_response(
            success=True, data=serializer.data, status_code=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """Update hotel and return in api_response format."""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(success=True, data=serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """Partial update hotel and return in api_response format."""
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Soft delete hotel and return in api_response format."""
        instance = self.get_object()
        instance.delete()
        return api_response(
            success=True, data=None, status_code=status.HTTP_204_NO_CONTENT
        )

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
        price_max = request.query_params.get("price_max")
        if price_min or price_max:
            room_filter = {"rooms__is_active": True}
            if price_min:
                room_filter["rooms__price__gte"] = price_min
            if price_max:
                room_filter["rooms__price__lte"] = price_max
            queryset = queryset.filter(**room_filter).distinct()

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

        queryset = queryset.distinct()

        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = HotelListSerializer(
                page, many=True, context={"request": request}
            )
            paginated = self.get_paginated_response(serializer.data)
            return api_response(success=True, data=paginated.data)

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

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.AllowAny],
        url_path="popular-destinations",
    )
    def popular_destinations(self, request):
        """Get popular hotel destinations. Returns snake_case keys for renderer."""
        destinations_qs = (
            Hotel.objects.filter(is_active=True)
            .values("city__name", "city__country__name", "city__id")
            .annotate(
                hotel_count=Count("id"),
                avg_rating=Avg("rating"),
            )
            .order_by("-hotel_count")[:20]
        )
        destinations = [
            {
                "city_id": str(row["city__id"]),
                "city_name": row["city__name"] or "",
                "city_country_name": row["city__country__name"] or "",
                "hotel_count": row["hotel_count"],
                "avg_rating": (
                    float(row["avg_rating"]) if row["avg_rating"] is not None else None
                ),
            }
            for row in destinations_qs
        ]
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

    @extend_schema(
        summary="Similar hotels nearby",
        description="Get similar hotels in the same city (same type preferred), ordered by rating. Optional query: limit (default 6, max 12).",
        parameters=[
            OpenApiParameter(
                name="limit",
                type=int,
                location=OpenApiParameter.QUERY,
                description="Max number of hotels to return (default 6, max 12)",
            ),
        ],
    )
    @action(
        detail=True,
        methods=["get"],
        permission_classes=[permissions.AllowAny],
        url_path="similar",
    )
    def similar(self, request, pk=None):
        """Get similar hotels nearby (same city, optionally same type, ordered by rating)."""
        hotel = self.get_object()
        limit = min(int(request.query_params.get("limit", 6)), 12)
        base_qs = Hotel.objects.filter(is_active=True, city=hotel.city).exclude(
            pk=hotel.pk
        )
        same_type_id = hotel.hotel_type_id
        if same_type_id:
            ordering = [
                Case(
                    When(hotel_type_id=same_type_id, then=Value(0)),
                    default=Value(1),
                    output_field=IntegerField(),
                ),
                "-rating",
                "name",
            ]
        else:
            ordering = ["-rating", "name"]
        similar_qs = base_qs.order_by(*ordering)[:limit]
        serializer = HotelListSerializer(
            similar_qs, many=True, context={"request": request}
        )
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
        """Get current user's hotels (paginated shape for frontend)."""
        hotels = Hotel.objects.filter(owner=request.user)
        serializer = HotelListSerializer(
            hotels, many=True, context={"request": request}
        )
        return api_response(
            success=True,
            data={
                "results": serializer.data,
                "count": hotels.count(),
                "next": None,
                "previous": None,
            },
        )

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

        avg_rating = hotels.aggregate(avg=Avg("rating"))["avg"]
        stats = {
            "total_hotels": hotels.count(),
            "active_hotels": hotels.filter(is_active=True).count(),
            "total_rooms": total_rooms,
            "avg_rating": float(avg_rating) if avg_rating is not None else None,
            "recent_hotels": HotelListSerializer(
                hotels.order_by("-created_at")[:5],
                many=True,
                context={"request": request},
            ).data,
        }

        return api_response(success=True, data=stats)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.AllowAny],
        url_path="form-data",
    )
    def form_data(self, request):
        """Get data needed for hotel forms"""
        data = {
            "cities": City.objects.annotate(country_name=F("country__name")).values(
                "id", "name", "country_name"
            )[:20],
            "chains": HotelChain.objects.values("id", "name"),
            "types": HotelType.objects.values("id", "name"),
            "facilities": Facility.objects.values("id", "name", "category"),
        }
        return api_response(success=True, data=data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsHostOrReadOnly],
        url_path="toggle-active",
    )
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

    def retrieve(self, request, *args, **kwargs):
        """Return single image in api_response format."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, data=serializer.data)

    def list(self, request, *args, **kwargs):
        """Return list in api_response format."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, data=serializer.data)

    def create(self, request, *args, **kwargs):
        """Create image and return in api_response format."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = self.perform_create(serializer)
        if result is not None:
            return result
        return api_response(
            success=True,
            data=serializer.data,
            status_code=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        """Update image and return in api_response format."""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(success=True, data=serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """Partial update image and return in api_response format."""
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete image and return in api_response format."""
        instance = self.get_object()
        instance.delete()
        return api_response(
            success=True, data=None, status_code=status.HTTP_204_NO_CONTENT
        )


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

    def retrieve(self, request, *args, **kwargs):
        """Return single hotel in api_response format."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, data=serializer.data)

    def list(self, request, *args, **kwargs):
        """Return paginated list in api_response format."""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated = self.get_paginated_response(serializer.data)
            return api_response(success=True, data=paginated.data)
        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, data=serializer.data)

    def create(self, request, *args, **kwargs):
        """Create hotel and return in api_response format."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(
            success=True, data=serializer.data, status_code=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """Update hotel and return in api_response format."""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(success=True, data=serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """Partial update hotel and return in api_response format."""
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete hotel and return in api_response format."""
        instance = self.get_object()
        instance.delete()
        return api_response(
            success=True, data=None, status_code=status.HTTP_204_NO_CONTENT
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="toggle-active",
        permission_classes=[IsSuperAdmin],
    )
    def toggle_active(self, request, pk=None):
        """Admin: toggle hotel active status"""
        hotel = self.get_object()
        hotel.is_active = not hotel.is_active
        hotel.save()

        return api_response(
            success=True,
            data={
                "hotel": AdminHotelSerializer(hotel, context={"request": request}).data,
            },
        )

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


@extend_schema_view(
    list=extend_schema(
        summary="List Hotel Chains", description="List all hotel chains"
    ),
    create=extend_schema(
        summary="Create Hotel Chain",
        description="Create a new hotel chain (admin only)",
    ),
    retrieve=extend_schema(
        summary="Get Hotel Chain Details", description="Get hotel chain details"
    ),
    update=extend_schema(
        summary="Update Hotel Chain", description="Update hotel chain (admin only)"
    ),
    partial_update=extend_schema(
        summary="Partially Update Hotel Chain",
        description="Partially update hotel chain (admin only)",
    ),
    destroy=extend_schema(
        summary="Delete Hotel Chain", description="Soft delete hotel chain (admin only)"
    ),
)
class HotelChainViewSet(ModelViewSet):
    """Hotel Chain management viewset"""

    queryset = HotelChain.objects.filter(is_active=True)
    serializer_class = HotelChainSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["is_active"]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        """Get queryset based on user permissions"""
        if self.request.user.is_authenticated and self.request.user.is_superuser:
            return HotelChain.objects.all()
        else:
            return HotelChain.objects.filter(is_active=True)

    def get_serializer_class(self):
        """Return appropriate serializer based on user role"""
        if self.request.user.is_authenticated and self.request.user.is_superuser:
            if self.action in ["create", "update", "partial_update"]:
                return HotelChainCreateUpdateSerializer
            else:
                return AdminHotelChainSerializer
        return HotelChainSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsSuperAdmin]

        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        """Return single hotel chain in api_response format."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(success=True, data=serializer.data)

    def list(self, request, *args, **kwargs):
        """Return paginated list in api_response format."""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated = self.get_paginated_response(serializer.data)
            return api_response(success=True, data=paginated.data)
        serializer = self.get_serializer(queryset, many=True)
        return api_response(success=True, data=serializer.data)

    def create(self, request, *args, **kwargs):
        """Override create to use api_response format"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hotel_chain = serializer.save()

        return api_response(
            success=True,
            data={
                "hotel_chain": AdminHotelChainSerializer(
                    hotel_chain, context={"request": request}
                ).data
            },
            status_code=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        """Override update to use api_response format"""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        hotel_chain = serializer.save()

        return api_response(
            success=True,
            data={
                "hotel_chain": AdminHotelChainSerializer(
                    hotel_chain, context={"request": request}
                ).data
            },
        )

    def destroy(self, request, *args, **kwargs):
        """Override destroy to use soft delete and api_response format"""
        instance = self.get_object()

        # Check if hotel chain has hotels
        hotel_count = instance.hotels.filter(is_active=True).count()
        if hotel_count > 0:
            return api_response(
                success=False,
                errors={
                    "error": f"Cannot delete hotel chain. It has {hotel_count} active hotels."
                },
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        instance.delete()  # This will use soft delete from SoftDeleteModel
        return api_response(
            success=True, data={}, status_code=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=["get"], permission_classes=[IsSuperAdmin])
    def stats(self, request):
        """Get hotel chain statistics for admin dashboard"""
        stats = {
            "total_chains": HotelChain.objects.count(),
            "active_chains": HotelChain.objects.filter(is_active=True).count(),
            "inactive_chains": HotelChain.objects.filter(is_active=False).count(),
            "deleted_chains": HotelChain.all_objects.filter(is_deleted=True).count(),
            "chains_with_hotels": [],
            "recent_chains": [],
        }

        # Chains with hotel counts
        chains_with_counts = HotelChain.objects.annotate(
            hotel_count=Count("hotels", filter=Q(hotels__is_active=True))
        ).order_by("-hotel_count")[:10]

        stats["chains_with_hotels"] = [
            {
                "id": str(chain.id),
                "name": chain.name,
                "hotel_count": chain.hotel_count,
                "is_active": chain.is_active,
            }
            for chain in chains_with_counts
        ]

        # Recent chains
        recent_chains = HotelChain.objects.order_by("-created_at")[:5]
        stats["recent_chains"] = AdminHotelChainSerializer(
            recent_chains, many=True, context={"request": request}
        ).data

        return api_response(success=True, data=stats)


@extend_schema_view(
    list=extend_schema(summary="List Hotel Types", description="List all hotel types"),
    create=extend_schema(
        summary="Create Hotel Type",
        description="Create a new hotel type (admin only)",
    ),
    retrieve=extend_schema(
        summary="Get Hotel Type Details", description="Get hotel type details"
    ),
    update=extend_schema(
        summary="Update Hotel Type", description="Update hotel type (admin only)"
    ),
    partial_update=extend_schema(
        summary="Partially Update Hotel Type",
        description="Partially update hotel type (admin only)",
    ),
    destroy=extend_schema(
        summary="Delete Hotel Type", description="Soft delete hotel type (admin only)"
    ),
)
class HotelTypeViewSet(ModelViewSet):
    """Hotel Type management viewset"""

    queryset = HotelType.objects.filter(is_active=True)
    serializer_class = HotelTypeSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["is_active"]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        """Get queryset based on user permissions"""
        if self.request.user.is_authenticated and self.request.user.is_superuser:
            return HotelType.objects.all()
        else:
            return HotelType.objects.filter(is_active=True)

    def get_serializer_class(self):
        """Return appropriate serializer based on user role"""
        if self.request.user.is_authenticated and self.request.user.is_superuser:
            if self.action in ["create", "update", "partial_update"]:
                return HotelTypeCreateUpdateSerializer
            else:
                return AdminHotelTypeSerializer
        return HotelTypeSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsSuperAdmin]

        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """Override create to use api_response format"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hotel_type = serializer.save()

        return api_response(
            success=True,
            data={
                "hotel_type": AdminHotelTypeSerializer(
                    hotel_type, context={"request": request}
                ).data
            },
            status_code=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        """Override update to use api_response format"""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        hotel_type = serializer.save()

        return api_response(
            success=True,
            data={
                "hotel_type": AdminHotelTypeSerializer(
                    hotel_type, context={"request": request}
                ).data
            },
        )

    def destroy(self, request, *args, **kwargs):
        """Override destroy to use soft delete and api_response format"""
        instance = self.get_object()

        # Check if hotel type has hotels
        hotel_count = instance.hotels.filter(is_active=True).count()
        if hotel_count > 0:
            return api_response(
                success=False,
                errors={
                    "error": f"Cannot delete hotel type. It has {hotel_count} active hotels."
                },
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        instance.delete()  # This will use soft delete from SoftDeleteModel
        return api_response(
            success=True, data={}, status_code=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=["get"], permission_classes=[IsSuperAdmin])
    def stats(self, request):
        """Get hotel type statistics for admin dashboard"""
        stats = {
            "total_types": HotelType.objects.count(),
            "active_types": HotelType.objects.filter(is_active=True).count(),
            "inactive_types": HotelType.objects.filter(is_active=False).count(),
            "deleted_types": HotelType.all_objects.filter(is_deleted=True).count(),
            "types_with_hotels": [],
            "recent_types": [],
        }

        # Types with hotel counts
        types_with_counts = HotelType.objects.annotate(
            hotel_count=Count("hotels", filter=Q(hotels__is_active=True))
        ).order_by("-hotel_count")[:10]

        stats["types_with_hotels"] = [
            {
                "id": str(type_obj.id),
                "name": type_obj.name,
                "hotel_count": type_obj.hotel_count,
                "is_active": type_obj.is_active,
            }
            for type_obj in types_with_counts
        ]

        # Recent types
        recent_types = HotelType.objects.order_by("-created_at")[:5]
        stats["recent_types"] = AdminHotelTypeSerializer(
            recent_types, many=True, context={"request": request}
        ).data

        return api_response(success=True, data=stats)
