from rest_framework import serializers
from .models import Facility, Category


class FacilitySerializer(serializers.ModelSerializer):
    """Basic facility serializer"""

    class Meta:
        model = Facility
        fields = ["id", "name", "description", "icon", "category", "is_active"]
        read_only_fields = ["id"]


class FacilityCreateUpdateSerializer(serializers.ModelSerializer):
    """Facility create/update serializer for admins"""

    class Meta:
        model = Facility
        fields = ["name", "description", "icon", "category", "is_active"]


class AdminFacilitySerializer(serializers.ModelSerializer):
    """Admin facility serializer with all fields"""

    hotel_count = serializers.SerializerMethodField()

    class Meta:
        model = Facility
        fields = "__all__"

    def get_hotel_count(self, obj):
        """Get count of hotels using this facility"""
        return obj.hotels.filter(is_active=True).count()


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer"""

    class Meta:
        model = Category
        fields = ["id", "name", "description", "icon", "is_active"]
        read_only_fields = ["id"]


class AdminCategorySerializer(serializers.ModelSerializer):
    """Admin category serializer with all fields and facility count"""

    facility_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = "__all__"

    def get_facility_count(self, obj):
        """Get count of facilities in this category"""
        return obj.facility_set.filter(is_active=True).count()


class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    """Category create/update serializer for admins"""

    class Meta:
        model = Category
        fields = ["name", "description", "icon", "is_active"]
