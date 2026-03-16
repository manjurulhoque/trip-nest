from rest_framework import serializers
from .models import Hotel, HotelImage, HotelChain, HotelType
from facilities.models import Facility
from core.models import City, Country
from users.serializers import UserSerializer
from facilities.serializers import CategorySerializer
from core.serializers import CountrySerializer


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

    category = CategorySerializer(read_only=True)

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


class BaseHotelSerializer(serializers.ModelSerializer):
    """Base hotel serializer with shared nested fields and decimal fields."""

    owner = UserSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    chain = HotelChainSerializer(read_only=True)
    hotel_type = HotelTypeSerializer(read_only=True)
    facilities = FacilitySerializer(many=True, read_only=True)
    images = HotelImageSerializer(many=True, read_only=True)
    rating = serializers.DecimalField(
        max_digits=3,
        decimal_places=1,
        allow_null=True,
        required=False,
        coerce_to_string=False,
    )
    starting_price = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "description",
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
            "facilities",
            "images",
            "is_active",
            "owner",
            "starting_price",
        ]

    def get_starting_price(self, obj):
        """Minimum active room price; 0 when no priced rooms."""
        from django.db.models import Min

        result = obj.rooms.filter(is_active=True, price__isnull=False).aggregate(
            min_price=Min("price")
        )
        min_price = result["min_price"]
        if min_price is None:
            return 0
        return float(min_price)


class HotelListSerializer(BaseHotelSerializer):
    """Hotel list serializer for browsing"""

    main_image = serializers.SerializerMethodField()
    room_count = serializers.SerializerMethodField()

    class Meta(BaseHotelSerializer.Meta):
        fields = BaseHotelSerializer.Meta.fields + [
            "main_image",
            "room_count",
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


class HotelDetailSerializer(BaseHotelSerializer):
    """Hotel detail serializer"""

    rooms = serializers.SerializerMethodField()

    class Meta(BaseHotelSerializer.Meta):
        fields = BaseHotelSerializer.Meta.fields + [
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
            "description",
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
class AdminHotelSerializer(BaseHotelSerializer):
    """Admin hotel serializer with all fields"""

    rooms = serializers.SerializerMethodField()

    class Meta(BaseHotelSerializer.Meta):
        fields = "__all__"

    def get_rooms(self, obj):
        from rooms.serializers import AdminRoomSerializer

        return AdminRoomSerializer(
            obj.rooms.all(), many=True, context=self.context
        ).data


class HotelChainSerializer(serializers.ModelSerializer):
    """Basic hotel chain serializer"""

    class Meta:
        model = HotelChain
        fields = [
            "id",
            "name",
            "description",
            "logo",
            "website",
            "is_active",
        ]
        read_only_fields = ["id"]


class HotelChainCreateUpdateSerializer(serializers.ModelSerializer):
    """Hotel chain create/update serializer for admins"""

    headquarters_country_id = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(),
        required=False,
        allow_null=True,
        source="headquarters_country",
    )

    class Meta:
        model = HotelChain
        fields = [
            "name",
            "description",
            "logo",
            "website",
            "headquarters_country_id",
            "is_active",
        ]


class AdminHotelChainSerializer(serializers.ModelSerializer):
    """Admin hotel chain serializer with all fields"""

    hotel_count = serializers.SerializerMethodField()
    headquarters_country = serializers.SerializerMethodField()

    class Meta:
        model = HotelChain
        fields = "__all__"

    def get_hotel_count(self, obj):
        """Get count of hotels in this chain"""
        return obj.hotels.filter(is_active=True).count()

    def get_headquarters_country(self, obj):
        return CountrySerializer(obj.headquarters_country).data


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
