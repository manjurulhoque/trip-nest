from rest_framework import serializers
from django.utils import timezone

from .models import Booking, GuestDetail
from users.serializers import UserSerializer
from core.models import City


class BookingHotelSerializer(serializers.Serializer):
    """Minimal hotel info for booking responses."""

    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField(read_only=True)
    main_photo = serializers.URLField(read_only=True, allow_null=True)
    thumbnail = serializers.URLField(read_only=True, allow_null=True)
    address = serializers.CharField(read_only=True)
    stars = serializers.IntegerField(read_only=True)
    city = serializers.SerializerMethodField()

    def get_city(self, obj):
        if not obj.city_id:
            return None
        city = City.objects.filter(id=obj.city_id).values("id", "name").first()
        return city


class BookingRoomSerializer(serializers.Serializer):
    """Minimal room info for booking responses."""

    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField(read_only=True)
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        allow_null=True,
        coerce_to_string=False,
        read_only=True,
    )
    occupancy = serializers.IntegerField(read_only=True)
    adults = serializers.IntegerField(read_only=True)
    children = serializers.IntegerField(read_only=True)


class GuestDetailSerializer(serializers.ModelSerializer):
    """Guest detail serializer for read (nested in booking)."""

    class Meta:
        model = GuestDetail
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "date_of_birth",
            "nationality",
            "passport_number",
            "is_primary",
        ]
        read_only_fields = ["id"]


class GuestDetailCreateSerializer(serializers.ModelSerializer):
    """Guest detail for create/update booking (no id, booking set in view)."""

    class Meta:
        model = GuestDetail
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "date_of_birth",
            "nationality",
            "passport_number",
            "is_primary",
        ]


class BookingListSerializer(serializers.ModelSerializer):
    """Booking list serializer with nested user, hotel, room, guest_details."""

    user = UserSerializer(read_only=True)
    hotel = BookingHotelSerializer(read_only=True)
    room = BookingRoomSerializer(read_only=True)
    guest_details = GuestDetailSerializer(many=True, read_only=True)
    room_rate = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False,
    )
    taxes = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False,
    )
    fees = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False,
    )
    total_amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        coerce_to_string=False,
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_reference",
            "user",
            "hotel",
            "room",
            "check_in_date",
            "check_out_date",
            "guests_count",
            "adults_count",
            "children_count",
            "total_nights",
            "room_rate",
            "taxes",
            "fees",
            "total_amount",
            "currency",
            "status",
            "payment_status",
            "special_requests",
            "guest_details",
            "created_at",
            "updated_at",
            "cancelled_at",
            "cancellation_reason",
        ]
        read_only_fields = ["id", "booking_reference", "created_at", "updated_at"]


class BookingDetailSerializer(BookingListSerializer):
    """Booking detail serializer (same as list; extend if more fields needed)."""

    pass


class BookingUpdateSerializer(serializers.ModelSerializer):
    """Minimal serializer for partial_update (e.g. special_requests, status by host)."""

    class Meta:
        model = Booking
        fields = ["special_requests", "status"]
        extra_kwargs = {"special_requests": {"required": False}, "status": {"required": False}}

    def validate_status(self, value):
        """Only host or admin can change status; guest can only cancel via cancel action."""
        request = self.context.get("request")
        if request and not (
            request.user.is_superuser
            or (hasattr(request.user, "is_host") and request.user.is_host())
        ):
            raise serializers.ValidationError("Only host or admin can change status.")
        return value


class BookingCreateUpdateSerializer(serializers.ModelSerializer):
    """Create/update booking: flat hotel/room IDs and nested guest_details."""

    guest_details = GuestDetailCreateSerializer(many=True, required=False, default=list)
    hotel_id = serializers.UUIDField(write_only=True)
    room_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            "hotel_id",
            "room_id",
            "check_in_date",
            "check_out_date",
            "guests_count",
            "adults_count",
            "children_count",
            "special_requests",
            "guest_details",
        ]

    def validate(self, attrs):
        from hotels.models import Hotel
        from rooms.models import Room

        hotel_id = attrs.get("hotel_id")
        room_id = attrs.get("room_id")
        check_in = attrs.get("check_in_date")
        check_out = attrs.get("check_out_date")
        adults = attrs.get("adults_count", 1)
        children = attrs.get("children_count", 0)
        guests_count = attrs.get("guests_count", 1)

        if check_in and check_out:
            if check_out <= check_in:
                raise serializers.ValidationError(
                    {"check_out_date": "Check-out must be after check-in."}
                )
            if (check_out - check_in).days < 1:
                raise serializers.ValidationError(
                    {"check_out_date": "Stay must be at least one night."}
                )

        if guests_count != adults + children:
            raise serializers.ValidationError(
                {"guests_count": "Must equal adults_count + children_count."}
            )

        try:
            hotel = Hotel.objects.get(id=hotel_id, is_active=True)
        except Hotel.DoesNotExist:
            raise serializers.ValidationError({"hotel_id": "Invalid or inactive hotel."})

        try:
            room = Room.objects.get(id=room_id, hotel=hotel, is_active=True)
        except Room.DoesNotExist:
            raise serializers.ValidationError(
                {"room_id": "Invalid or inactive room for this hotel."}
            )

        if room.occupancy < guests_count:
            raise serializers.ValidationError(
                {"guests_count": f"Room allows maximum {room.occupancy} guests."}
            )

        if room.adults < adults or room.children < children:
            raise serializers.ValidationError(
                {
                    "adults_count": f"Room allows max {room.adults} adults and {room.children} children."
                }
            )

        price = room.price
        if price is None or price <= 0:
            raise serializers.ValidationError(
                {"room_id": "Room has no valid price."}
            )

        total_nights = (check_out - check_in).days
        room_total = price * total_nights
        taxes = attrs.get("taxes") or 0
        fees = attrs.get("fees") or 0
        total = room_total + taxes + fees

        attrs["hotel"] = hotel
        attrs["room"] = room
        attrs["total_nights"] = total_nights
        attrs["room_rate"] = price
        attrs["total_amount"] = total
        attrs["currency"] = "USD"
        return attrs

    def create(self, validated_data):
        guest_details_data = validated_data.pop("guest_details", [])
        validated_data.pop("hotel_id", None)
        validated_data.pop("room_id", None)
        validated_data.setdefault("taxes", 0)
        validated_data.setdefault("fees", 0)
        validated_data["user"] = self.context["request"].user
        booking = Booking.objects.create(**validated_data)
        for i, gd in enumerate(guest_details_data):
            is_primary = gd.get("is_primary", i == 0)
            GuestDetail.objects.create(booking=booking, is_primary=is_primary, **gd)
        return booking
