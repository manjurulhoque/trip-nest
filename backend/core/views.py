from rest_framework import permissions, filters
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Country, City
from .serializers import (
    CountrySerializer,
    CitySerializer,
)

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
