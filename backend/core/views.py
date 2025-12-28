from django.shortcuts import render
from django.db import models
from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import HotelChain, HotelType, Country, City
from .serializers import (
    HotelChainSerializer,
    HotelChainCreateUpdateSerializer,
    AdminHotelChainSerializer,
    HotelTypeSerializer,
    HotelTypeCreateUpdateSerializer,
    AdminHotelTypeSerializer,
    CountrySerializer,
    CitySerializer,
)
from users.permissions import IsSuperAdmin
from utils.response import api_response


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
            hotel_count=Count("hotels", filter=models.Q(hotels__is_active=True))
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
    list=extend_schema(
        summary="List Hotel Types", description="List all hotel types"
    ),
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
            hotel_count=Count("hotels", filter=models.Q(hotels__is_active=True))
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


@extend_schema_view(
    list=extend_schema(
        summary="List Countries", description="List all countries"
    ),
)
class CountryViewSet(ModelViewSet):
    """Country viewset"""
    queryset = Country.objects.filter(is_active=True)
    serializer_class = CountrySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code"]
    ordering_fields = ["name"]
    ordering = ["name"]


@extend_schema_view(
    list=extend_schema(
        summary="List Cities", description="List all cities"
    ),
)
class CityViewSet(ModelViewSet):
    """City viewset"""
    queryset = City.objects.filter(is_active=True)
    serializer_class = CitySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["country", "is_popular"]
    search_fields = ["name", "country__name"]
    ordering_fields = ["name"]
    ordering = ["name"]
