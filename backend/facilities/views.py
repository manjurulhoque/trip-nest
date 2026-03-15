from django.shortcuts import render
from django.db import models
from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Facility, Category
from .serializers import (
    FacilitySerializer,
    FacilityCreateUpdateSerializer,
    AdminFacilitySerializer,
    CategorySerializer,
    AdminCategorySerializer,
    CategoryCreateUpdateSerializer,
)
from users.permissions import IsSuperAdmin
from utils.response import api_response


@extend_schema_view(
    list=extend_schema(
        summary="List Categories", description="List all facility categories"
    ),
    create=extend_schema(
        summary="Create Category",
        description="Create a new facility category (admin only)",
    ),
    retrieve=extend_schema(
        summary="Get Category Details", description="Get category details"
    ),
    update=extend_schema(
        summary="Update Category", description="Update category (admin only)"
    ),
    partial_update=extend_schema(
        summary="Partially Update Category",
        description="Partially update category (admin only)",
    ),
    destroy=extend_schema(
        summary="Delete Category", description="Soft delete category (admin only)"
    ),
)
class CategoryViewSet(ModelViewSet):
    """Category management viewset"""

    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
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
            return Category.objects.all()
        else:
            return Category.objects.filter(is_active=True)

    def get_serializer_class(self):
        """Return appropriate serializer based on user role"""
        if self.request.user.is_authenticated and self.request.user.is_superuser:
            if self.action in ["create", "update", "partial_update"]:
                return CategoryCreateUpdateSerializer
            else:
                return AdminCategorySerializer
        return CategorySerializer

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
        category = serializer.save()

        return api_response(
            success=True,
            data={
                "category": AdminCategorySerializer(
                    category, context={"request": request}
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
        category = serializer.save()

        return api_response(
            success=True,
            data={
                "category": AdminCategorySerializer(
                    category, context={"request": request}
                ).data
            },
        )

    def destroy(self, request, *args, **kwargs):
        """Override destroy to use soft delete and api_response format"""
        instance = self.get_object()

        # Check if category has facilities
        facility_count = instance.facility_set.filter(is_active=True).count()
        if facility_count > 0:
            return api_response(
                success=False,
                errors={
                    "error": f"Cannot delete category. It has {facility_count} active facilities."
                },
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        instance.delete()  # This will use soft delete from SoftDeleteModel
        return api_response(
            success=True, data={}, status_code=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=["get"], permission_classes=[IsSuperAdmin])
    def stats(self, request):
        """Get category statistics for admin dashboard"""
        stats = {
            "total_categories": Category.objects.count(),
            "active_categories": Category.objects.filter(is_active=True).count(),
            "inactive_categories": Category.objects.filter(is_active=False).count(),
            "deleted_categories": Category.all_objects.filter(is_deleted=True).count(),
            "categories_with_facilities": [],
            "recent_categories": [],
        }

        # Categories with facility counts
        categories_with_counts = Category.objects.annotate(
            facility_count=Count("facility", filter=models.Q(facility__is_active=True))
        ).order_by("-facility_count")[:10]

        stats["categories_with_facilities"] = [
            {
                "id": str(cat.id),
                "name": cat.name,
                "facility_count": cat.facility_count,
                "is_active": cat.is_active,
            }
            for cat in categories_with_counts
        ]

        # Recent categories
        recent_categories = Category.objects.order_by("-created_at")[:5]
        stats["recent_categories"] = AdminCategorySerializer(
            recent_categories, many=True, context={"request": request}
        ).data

        return api_response(success=True, data=stats)

    @action(detail=True, methods=["post"], permission_classes=[IsSuperAdmin])
    def restore(self, request, pk=None):
        """Restore a soft-deleted category"""
        try:
            category = Category.all_objects.get(pk=pk, is_deleted=True)
            category.restore()
            return api_response(
                success=True,
                data={
                    "category": AdminCategorySerializer(
                        category, context={"request": request}
                    ).data
                },
            )
        except Category.DoesNotExist:
            return api_response(
                success=False,
                errors={"error": "Category not found or not deleted"},
                status_code=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["delete"], permission_classes=[IsSuperAdmin])
    def hard_delete(self, request, pk=None):
        """Permanently delete a category"""
        category = self.get_object()

        # Check if category has facilities
        facility_count = category.facility_set.filter(is_active=True).count()
        if facility_count > 0:
            return api_response(
                success=False,
                errors={
                    "error": f"Cannot delete category. It has {facility_count} active facilities."
                },
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        category.hard_delete()
        return api_response(
            success=True, data={}, status_code=status.HTTP_204_NO_CONTENT
        )


@extend_schema_view(
    list=extend_schema(
        summary="List Facilities", description="List all available facilities/amenities"
    ),
    create=extend_schema(
        summary="Create Facility", description="Create a new facility (admin only)"
    ),
    retrieve=extend_schema(
        summary="Get Facility Details", description="Get facility details"
    ),
    update=extend_schema(
        summary="Update Facility", description="Update facility (admin only)"
    ),
    partial_update=extend_schema(
        summary="Partially Update Facility",
        description="Partially update facility (admin only)",
    ),
    destroy=extend_schema(
        summary="Delete Facility", description="Soft delete facility (admin only)"
    ),
)
class FacilityViewSet(ModelViewSet):
    """Facility management viewset"""

    queryset = Facility.objects.filter(is_active=True)
    serializer_class = FacilitySerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category_id", "is_active"]
    search_fields = ["name", "description", "category_id"]
    ordering_fields = ["name", "category_id", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        """Get queryset based on user permissions"""
        if self.request.user.is_superuser:
            return Facility.objects.all()
        else:
            return Facility.objects.filter(is_active=True)

    def get_serializer_class(self):
        """Return appropriate serializer based on user role"""
        if self.request.user.is_superuser:
            if self.action in ["create", "update", "partial_update"]:
                return FacilityCreateUpdateSerializer
            else:
                return AdminFacilitySerializer
        return FacilitySerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsSuperAdmin]

        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def categories(self, request):
        """Get all facility categories"""
        categories = (
            Facility.objects.filter(is_active=True)
            .values_list("category", flat=True)
            .distinct()
            .order_by("category")
        )

        return api_response(success=True, data=list(categories))

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def popular(self, request):
        """Get most popular facilities"""
        popular_facilities = (
            Facility.objects.filter(is_active=True)
            .annotate(hotel_count=Count("hotels"))
            .order_by("-hotel_count")[:20]
        )

        serializer = FacilitySerializer(popular_facilities, many=True)
        return api_response(success=True, data=serializer.data)


# Admin-specific views
@extend_schema_view(
    list=extend_schema(
        summary="Admin - List All Facilities",
        description="Admin view to list all facilities with full details",
    ),
    create=extend_schema(
        summary="Admin - Create Facility",
        description="Admin create facility with full permissions",
    ),
    retrieve=extend_schema(
        summary="Admin - Get Facility Details",
        description="Admin view facility with full details",
    ),
    update=extend_schema(
        summary="Admin - Update Facility",
        description="Admin update facility with full permissions",
    ),
    partial_update=extend_schema(
        summary="Admin - Partially Update Facility",
        description="Admin partially update facility with full permissions",
    ),
    destroy=extend_schema(
        summary="Admin - Delete Facility",
        description="Admin delete facility permanently",
    ),
)
class AdminFacilityViewSet(ModelViewSet):
    """Admin facility management viewset"""

    queryset = Facility.objects.all()
    serializer_class = AdminFacilitySerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category_id", "is_active", "is_deleted"]
    search_fields = ["name", "description", "category_id"]
    ordering_fields = ["name", "category_id", "created_at"]
    ordering = ["-created_at"]

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Get facility statistics for admin dashboard"""
        stats = {
            "total_facilities": Facility.objects.count(),
            "active_facilities": Facility.objects.filter(is_active=True).count(),
            "inactive_facilities": Facility.objects.filter(is_active=False).count(),
            "deleted_facilities": Facility.all_objects.filter(is_deleted=True).count(),
            "facilities_by_category": {},
            "popular_facilities": [],
            "recent_facilities": [],
        }

        # Facilities by category
        categories = (
            Facility.objects.values("category_id")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        for category in categories:
            key = (
                str(category["category_id"])
                if category["category_id"] is not None
                else "uncategorized"
            )
            stats["facilities_by_category"][key] = category["count"]

        # Popular facilities (by hotel usage)
        stats["popular_facilities"] = list(
            Facility.objects.filter(is_active=True)
            .annotate(hotel_count=Count("hotels"))
            .order_by("-hotel_count")[:10]
            .values("name", "hotel_count")
        )

        # Recent facilities
        recent_facilities = Facility.objects.order_by("-created_at")[:5]
        stats["recent_facilities"] = AdminFacilitySerializer(
            recent_facilities, many=True, context={"request": request}
        ).data

        return api_response(success=True, data=stats)

    @action(detail=True, methods=["post"])
    def restore(self, request, pk=None):
        """Restore a soft-deleted facility"""
        try:
            facility = Facility.all_objects.get(pk=pk, is_deleted=True)
            facility.restore()
            return api_response(
                success=True,
                data={
                    "facility": AdminFacilitySerializer(
                        facility, context={"request": request}
                    ).data
                },
            )
        except Facility.DoesNotExist:
            return api_response(
                success=False,
                errors={"error": "Facility not found or not deleted"},
                status_code=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["delete"])
    def hard_delete(self, request, pk=None):
        """Permanently delete a facility"""
        facility = self.get_object()
        facility.hard_delete()
        return api_response(
            success=True, data={}, status_code=status.HTTP_204_NO_CONTENT
        )
