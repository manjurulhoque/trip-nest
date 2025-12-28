from rest_framework import serializers
from .models import Room, RoomAmenity, BedType, RoomBedType, RoomImage
from hotels.models import Hotel


class RoomAmenitySerializer(serializers.ModelSerializer):
    """Room amenity serializer"""

    class Meta:
        model = RoomAmenity
        fields = ["id", "name", "description", "icon", "order"]


class BedTypeSerializer(serializers.ModelSerializer):
    """Bed type serializer"""

    class Meta:
        model = BedType
        fields = ["id", "type", "size"]


class RoomBedTypeSerializer(serializers.ModelSerializer):
    """Room bed type serializer"""

    bed_type = BedTypeSerializer(read_only=True)
    bed_type_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = RoomBedType
        fields = ["id", "bed_type", "bed_type_id", "quantity"]
        read_only_fields = ["id"]


class RoomImageSerializer(serializers.ModelSerializer):
    """Room image serializer"""

    class Meta:
        model = RoomImage
        fields = ["id", "url", "description", "score", "main_photo"]
        read_only_fields = ["id"]


class RoomListSerializer(serializers.ModelSerializer):
    """Room list serializer"""

    hotel_name = serializers.CharField(source="hotel.name", read_only=True)
    amenities = RoomAmenitySerializer(many=True, read_only=True)
    bed_types = RoomBedTypeSerializer(many=True, read_only=True)
    photos = RoomImageSerializer(many=True, read_only=True)
    main_photo = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            "id",
            "hotel_name",
            "name",
            "description",
            "size",
            "unit",
            "adults",
            "children",
            "occupancy",
            "amenities",
            "bed_types",
            "photos",
            "main_photo",
            "is_active",
            "created_at",
        ]

    def get_main_photo(self, obj):
        """Get the main room photo"""
        main_photo = obj.photos.filter(main_photo=True).first()
        if main_photo:
            return RoomImageSerializer(main_photo).data
        elif obj.photos.exists():
            return RoomImageSerializer(obj.photos.first()).data
        return None


class RoomDetailSerializer(serializers.ModelSerializer):
    """Room detail serializer"""

    hotel = serializers.SerializerMethodField()
    amenities = RoomAmenitySerializer(many=True, read_only=True)
    bed_types = RoomBedTypeSerializer(many=True, read_only=True)
    photos = RoomImageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            "id",
            "hotel",
            "name",
            "description",
            "size",
            "unit",
            "adults",
            "children",
            "occupancy",
            "amenities",
            "bed_types",
            "photos",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def get_hotel(self, obj):
        """Get basic hotel information"""
        from hotels.serializers import HotelListSerializer

        return HotelListSerializer(obj.hotel, context=self.context).data


class RoomCreateUpdateSerializer(serializers.ModelSerializer):
    """Room create/update serializer for hosts"""

    amenity_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )
    bed_types_data = RoomBedTypeSerializer(many=True, required=False, write_only=True)
    photos = RoomImageSerializer(many=True, required=False)

    class Meta:
        model = Room
        fields = [
            "hotel",
            "name",
            "description",
            "size",
            "unit",
            "adults",
            "children",
            "occupancy",
            "amenity_ids",
            "bed_types_data",
            "photos",
            "is_active",
        ]

    def validate_hotel(self, value):
        """Validate that the user owns the hotel"""
        request = self.context.get("request")
        if request and request.user:
            if not (value.owner == request.user or request.user.is_superuser):
                raise serializers.ValidationError(
                    "You can only add rooms to your own hotels"
                )
        return value

    def validate_adults(self, value):
        """Validate adults count"""
        if value < 1:
            raise serializers.ValidationError("Room must accommodate at least 1 adult")
        return value

    def validate_children(self, value):
        """Validate children count"""
        if value < 0:
            raise serializers.ValidationError("Children count cannot be negative")
        return value

    def validate_occupancy(self, value):
        """Validate total occupancy"""
        if value < 1:
            raise serializers.ValidationError("Room occupancy must be at least 1")
        return value

    def validate(self, attrs):
        """Validate that occupancy matches adults + children"""
        adults = attrs.get("adults", 0)
        children = attrs.get("children", 0)
        occupancy = attrs.get("occupancy", 0)

        if occupancy < adults + children:
            raise serializers.ValidationError(
                "Occupancy must be at least the sum of adults and children"
            )

        return attrs

    def create(self, validated_data):
        amenity_ids = validated_data.pop("amenity_ids", [])
        bed_types_data = validated_data.pop("bed_types_data", [])
        photos_data = validated_data.pop("photos", [])

        room = Room.objects.create(**validated_data)

        # Add amenities
        if amenity_ids:
            amenities = RoomAmenity.objects.filter(id__in=amenity_ids, is_active=True)
            room.amenities.set(amenities)

        # Create bed types
        for bed_type_data in bed_types_data:
            bed_type_id = bed_type_data.get("bed_type_id")
            quantity = bed_type_data.get("quantity", 1)

            if bed_type_id:
                bed_type = BedType.objects.get(id=bed_type_id)
                RoomBedType.objects.create(
                    room=room, bed_type=bed_type, quantity=quantity
                )

        # Create photos
        for photo_data in photos_data:
            RoomImage.objects.create(room=room, **photo_data)

        return room

    def update(self, instance, validated_data):
        amenity_ids = validated_data.pop("amenity_ids", None)
        bed_types_data = validated_data.pop("bed_types_data", None)
        photos_data = validated_data.pop("photos", None)

        # Update room fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update amenities
        if amenity_ids is not None:
            amenities = RoomAmenity.objects.filter(id__in=amenity_ids, is_active=True)
            instance.amenities.set(amenities)

        # Update bed types
        if bed_types_data is not None:
            instance.bed_types.all().delete()
            for bed_type_data in bed_types_data:
                bed_type_id = bed_type_data.get("bed_type_id")
                quantity = bed_type_data.get("quantity", 1)

                if bed_type_id:
                    bed_type = BedType.objects.get(id=bed_type_id)
                    RoomBedType.objects.create(
                        room=instance, bed_type=bed_type, quantity=quantity
                    )

        # Update photos
        if photos_data is not None:
            instance.photos.all().delete()
            for photo_data in photos_data:
                RoomImage.objects.create(room=instance, **photo_data)

        return instance


class RoomStatsSerializer(serializers.ModelSerializer):
    """Room statistics for hosts"""

    booking_count = serializers.SerializerMethodField()
    revenue = serializers.SerializerMethodField()
    occupancy_rate = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ["id", "name", "booking_count", "revenue", "occupancy_rate"]

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
class AdminRoomSerializer(serializers.ModelSerializer):
    """Admin room serializer with all fields"""

    hotel = serializers.SerializerMethodField()
    amenities = RoomAmenitySerializer(many=True, read_only=True)
    bed_types = RoomBedTypeSerializer(many=True, read_only=True)
    photos = RoomImageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = "__all__"

    def get_hotel(self, obj):
        from hotels.serializers import HotelListSerializer

        return HotelListSerializer(obj.hotel, context=self.context).data


class AdminRoomAmenitySerializer(serializers.ModelSerializer):
    """Admin room amenity serializer"""

    class Meta:
        model = RoomAmenity
        fields = "__all__"


class AdminBedTypeSerializer(serializers.ModelSerializer):
    """Admin bed type serializer"""

    class Meta:
        model = BedType
        fields = "__all__"
