from django.contrib import admin
from core.admin import SoftDeleteModelAdmin, BaseModelAdmin
from .models import Room, RoomImage, RoomAmenity, BedType, RoomBedType


class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1
    fields = ["url", "description", "main_photo", "score"]
    ordering = ["-main_photo", "-score"]


class RoomBedTypeInline(admin.TabularInline):
    model = RoomBedType
    extra = 1
    fields = ["bed_type", "quantity"]


@admin.register(RoomAmenity)
class RoomAmenityAdmin(SoftDeleteModelAdmin):
    list_display = ["name", "order", "is_active", "deleted_status", "created_at"]
    list_filter = ["is_active", "is_deleted"]
    search_fields = ["name", "description"]
    ordering = ["order", "name"]
    list_editable = ["order", "is_active"]


@admin.register(BedType)
class BedTypeAdmin(SoftDeleteModelAdmin):
    list_display = ["type", "size", "deleted_status", "created_at"]
    list_filter = ["is_deleted"]
    search_fields = ["type", "size"]
    ordering = ["type"]


@admin.register(Room)
class RoomAdmin(SoftDeleteModelAdmin):
    list_display = [
        "name",
        "hotel",
        "size",
        "unit",
        "adults",
        "children",
        "occupancy",
        "is_active",
        "deleted_status",
    ]
    list_filter = ["hotel", "unit", "adults", "is_active", "is_deleted"]
    search_fields = ["name", "room_id", "hotel__name", "description"]
    ordering = ["hotel__name", "name"]
    list_editable = ["is_active"]
    raw_id_fields = ["hotel"]
    filter_horizontal = ["amenities"]
    inlines = [RoomImageInline, RoomBedTypeInline]

    fieldsets = (
        (None, {"fields": ("room_id", "hotel", "name", "description")}),
        ("Specifications", {"fields": ("size", "unit")}),
        ("Occupancy", {"fields": ("adults", "children", "occupancy")}),
        ("Amenities", {"fields": ("amenities",)}),
        ("Status", {"fields": ("is_active",)}),
    )


@admin.register(RoomImage)
class RoomImageAdmin(BaseModelAdmin):
    list_display = ["room", "description", "main_photo", "score", "created_at"]
    list_filter = ["main_photo", "room__hotel"]
    search_fields = ["room__name", "room__hotel__name", "description"]
    ordering = ["room__hotel__name", "room__name", "-main_photo", "-score"]
    raw_id_fields = ["room"]


@admin.register(RoomBedType)
class RoomBedTypeAdmin(BaseModelAdmin):
    list_display = ["room", "bed_type", "quantity", "created_at"]
    list_filter = ["bed_type", "room__hotel"]
    search_fields = ["room__name", "room__hotel__name", "bed_type__type"]
    ordering = ["room__hotel__name", "room__name", "bed_type__type"]
    raw_id_fields = ["room"]
