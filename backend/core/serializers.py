from rest_framework import serializers
from .models import HotelChain, HotelType, Country, City


class HotelChainSerializer(serializers.ModelSerializer):
    """Basic hotel chain serializer"""
    
    class Meta:
        model = HotelChain
        fields = ["id", "chain_id", "name", "description", "logo", "website", "is_active"]
        read_only_fields = ["id"]


class HotelChainCreateUpdateSerializer(serializers.ModelSerializer):
    """Hotel chain create/update serializer for admins"""
    
    class Meta:
        model = HotelChain
        fields = ["chain_id", "name", "description", "logo", "website", "headquarters_country", "is_active"]
    
    def validate_chain_id(self, value):
        """Validate that chain_id is unique"""
        if self.instance and self.instance.chain_id == value:
            return value
        if HotelChain.objects.filter(chain_id=value).exists():
            raise serializers.ValidationError("Chain ID already exists.")
        return value


class AdminHotelChainSerializer(serializers.ModelSerializer):
    """Admin hotel chain serializer with all fields"""
    
    hotel_count = serializers.SerializerMethodField()
    headquarters_country_name = serializers.CharField(source="headquarters_country.name", read_only=True)
    
    class Meta:
        model = HotelChain
        fields = "__all__"
    
    def get_hotel_count(self, obj):
        """Get count of hotels in this chain"""
        return obj.hotels.filter(is_active=True).count()


class HotelTypeSerializer(serializers.ModelSerializer):
    """Basic hotel type serializer"""
    
    class Meta:
        model = HotelType
        fields = ["id", "type_id", "name", "description", "icon", "is_active"]
        read_only_fields = ["id"]


class HotelTypeCreateUpdateSerializer(serializers.ModelSerializer):
    """Hotel type create/update serializer for admins"""
    
    class Meta:
        model = HotelType
        fields = ["type_id", "name", "description", "icon", "is_active"]
    
    def validate_type_id(self, value):
        """Validate that type_id is unique"""
        if self.instance and self.instance.type_id == value:
            return value
        if HotelType.objects.filter(type_id=value).exists():
            raise serializers.ValidationError("Type ID already exists.")
        return value


class AdminHotelTypeSerializer(serializers.ModelSerializer):
    """Admin hotel type serializer with all fields"""
    
    hotel_count = serializers.SerializerMethodField()
    
    class Meta:
        model = HotelType
        fields = "__all__"
    
    def get_hotel_count(self, obj):
        """Get count of hotels of this type"""
        return obj.hotels.filter(is_active=True).count()


class CountrySerializer(serializers.ModelSerializer):
    """Country serializer"""
    
    class Meta:
        model = Country
        fields = ["id", "name", "code", "currency", "phone_code", "is_active"]
        read_only_fields = ["id"]


class CitySerializer(serializers.ModelSerializer):
    """City serializer"""
    
    country_name = serializers.CharField(source="country.name", read_only=True)
    
    class Meta:
        model = City
        fields = ["id", "name", "country", "country_name", "latitude", "longitude", "timezone", "is_popular", "is_active"]
        read_only_fields = ["id"] 