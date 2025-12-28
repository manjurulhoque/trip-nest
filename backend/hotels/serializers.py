from rest_framework import serializers
from .models import Hotel, HotelImage
from facilities.models import Facility
from rooms.models import Room
from core.models import City, HotelChain, HotelType
from users.serializers import UserSerializer


class HotelChainSerializer(serializers.ModelSerializer):
    """Hotel chain serializer"""

    class Meta:
        model = HotelChain
        fields = ["id", "name", "description", "logo", "website"]


class HotelTypeSerializer(serializers.ModelSerializer):
    """Hotel type serializer"""

    class Meta:
        model = HotelType
        fields = ["id", "name", "description", "icon"]


class CitySerializer(serializers.ModelSerializer):
    """City serializer"""

    country_name = serializers.CharField(source="country.name", read_only=True)

    class Meta:
        model = City
        fields = [
            "id",
            "name",
            "country",
            "country_name",
            "latitude",
            "longitude",
            "timezone",
        ]


class FacilitySerializer(serializers.ModelSerializer):
    """Facility serializer"""

    class Meta:
        model = Facility
        fields = ["id", "name", "description", "icon", "category"]


class HotelImageSerializer(serializers.ModelSerializer):
    """Hotel image serializer"""

    class Meta:
        model = HotelImage
        fields = [
            "id",
            "url",
            "url_hd",
            "thumbnail_url",
            "caption",
            "order",
            "default_image",
        ]
        read_only_fields = ["id"]


class HotelListSerializer(serializers.ModelSerializer):
    """Hotel list serializer for browsing"""

    owner = UserSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    chain = HotelChainSerializer(read_only=True)
    hotel_type = HotelTypeSerializer(read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    images = HotelImageSerializer(many=True, read_only=True)
    main_image = serializers.SerializerMethodField()
    room_count = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "main_photo",
            "thumbnail",
            "main_image",
            "latitude",
            "longitude",
            "address",
            "city",
            "address_suburb",
            "stars",
            "rating",
            "ranking",
            "reviews_count",
            "best_seller",
            "chain",
            "hotel_type",
            "price",
            "facilities",
            "images",
            "is_active",
            "owner",
            "room_count",
            "min_price",
            "created_at",
        ]

    def get_main_image(self, obj):
        """Get the main hotel image"""
        main_image = obj.images.filter(default_image=True).first()
        if main_image:
            return HotelImageSerializer(main_image).data
        elif obj.images.exists():
            return HotelImageSerializer(obj.images.first()).data
        return None

    def get_room_count(self, obj):
        """Get the number of rooms"""
        return obj.rooms.filter(is_active=True).count()

    def get_min_price(self, obj):
        """Get minimum room price"""
        # This would typically come from room prices or booking data
        return obj.price  # Placeholder


class HotelDetailSerializer(serializers.ModelSerializer):
    """Hotel detail serializer"""

    owner = UserSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    chain = HotelChainSerializer(read_only=True)
    hotel_type = HotelTypeSerializer(read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    images = HotelImageSerializer(many=True, read_only=True)
    rooms = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "main_photo",
            "thumbnail",
            "latitude",
            "longitude",
            "address",
            "city",
            "address_suburb",
            "stars",
            "rating",
            "ranking",
            "reviews_count",
            "best_seller",
            "chain",
            "hotel_type",
            "price",
            "facilities",
            "images",
            "is_active",
            "owner",
            "rooms",
            "created_at",
            "updated_at",
        ]

    def get_rooms(self, obj):
        """Get hotel rooms"""
        from rooms.serializers import RoomListSerializer

        rooms = obj.rooms.filter(is_active=True)
        return RoomListSerializer(rooms, many=True, context=self.context).data


class HotelCreateUpdateSerializer(serializers.ModelSerializer):
    """Hotel create/update serializer for hosts"""

    images = HotelImageSerializer(many=True, required=False)
    facility_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )

    class Meta:
        model = Hotel
        fields = [
            "name",
            "main_photo",
            "thumbnail",
            "latitude",
            "longitude",
            "address",
            "city",
            "address_suburb",
            "stars",
            "rating",
            "ranking",
            "reviews_count",
            "best_seller",
            "chain",
            "hotel_type",
            "price",
            "facility_ids",
            "images",
            "is_active",
        ]

    def validate_stars(self, value):
        """Validate star rating"""
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Stars must be between 1 and 5")
        return value

    def validate_rating(self, value):
        """Validate rating"""
        if value is not None and not 0 <= value <= 10:
            raise serializers.ValidationError("Rating must be between 0 and 10")
        return value

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        facility_ids = validated_data.pop("facility_ids", [])

        # Set owner to current user
        validated_data["owner"] = self.context["request"].user

        hotel = Hotel.objects.create(**validated_data)

        # Add facilities
        if facility_ids:
            facilities = Facility.objects.filter(id__in=facility_ids, is_active=True)
            hotel.facilities.set(facilities)

        # Create images
        for image_data in images_data:
            HotelImage.objects.create(hotel=hotel, **image_data)

        return hotel

    def update(self, instance, validated_data):
        images_data = validated_data.pop("images", [])
        facility_ids = validated_data.pop("facility_ids", None)

        # Update hotel fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update facilities
        if facility_ids is not None:
            facilities = Facility.objects.filter(id__in=facility_ids, is_active=True)
            instance.facilities.set(facilities)

        # Update images (simple replacement for now)
        if images_data:
            instance.images.all().delete()
            for image_data in images_data:
                HotelImage.objects.create(hotel=instance, **image_data)

        return instance


class HotelStatsSerializer(serializers.ModelSerializer):
    """Hotel statistics serializer for hosts"""

    room_count = serializers.SerializerMethodField()
    booking_count = serializers.SerializerMethodField()
    revenue = serializers.SerializerMethodField()
    occupancy_rate = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "room_count",
            "booking_count",
            "revenue",
            "occupancy_rate",
            "rating",
            "reviews_count",
        ]

    def get_room_count(self, obj):
        return obj.rooms.filter(is_active=True).count()

    def get_booking_count(self, obj):
        # This would come from bookings model
        return 0  # Placeholder

    def get_revenue(self, obj):
        # This would come from bookings/payments
        return 0.00  # Placeholder

    def get_occupancy_rate(self, obj):
        # This would be calculated from bookings
        return 0.0  # Placeholder


# Admin-specific serializers
class AdminHotelSerializer(serializers.ModelSerializer):
    """Admin hotel serializer with all fields"""

    owner = UserSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    chain = HotelChainSerializer(read_only=True)
    hotel_type = HotelTypeSerializer(read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    images = HotelImageSerializer(many=True, read_only=True)
    rooms = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = "__all__"

    def get_rooms(self, obj):
        from rooms.serializers import AdminRoomSerializer

        return AdminRoomSerializer(
            obj.rooms.all(), many=True, context=self.context
        ).data
