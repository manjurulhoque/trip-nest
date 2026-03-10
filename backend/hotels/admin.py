from django.contrib import admin
from core.admin import SoftDeleteModelAdmin, BaseModelAdmin
from .models import Hotel, HotelImage, HotelChain, HotelType


class HotelImageInline(admin.TabularInline):
    model = HotelImage
    extra = 1
    fields = ["url", "caption", "order", "default_image"]
    ordering = ["order"]


@admin.register(Hotel)
class HotelAdmin(SoftDeleteModelAdmin):
    list_display = [
        "name",
        "city",
        "stars",
        "rating",
        "reviews_count",
        "best_seller",
        "is_active",
        "deleted_status",
    ]
    list_filter = [
        "stars",
        "city__country",
        "city",
        "chain",
        "hotel_type",
        "best_seller",
        "is_active",
        "is_deleted",
    ]
    search_fields = ["name", "hotel_id", "address", "city__name"]
    ordering = ["-rating", "name"]
    list_editable = ["is_active", "best_seller"]
    raw_id_fields = ["city", "chain", "hotel_type"]
    filter_horizontal = ["facilities"]
    inlines = [HotelImageInline]

    fieldsets = (
        (None, {"fields": ("hotel_id", "name", "main_photo", "thumbnail")}),
        (
            "Location",
            {"fields": ("city", "address", "address_suburb", "latitude", "longitude")},
        ),
        (
            "Hotel Details",
            {"fields": ("stars", "rating", "ranking", "reviews_count", "price")},
        ),
        ("Business Info", {"fields": ("chain", "hotel_type", "best_seller")}),
        ("Facilities", {"fields": ("facilities",)}),
        ("Status", {"fields": ("is_active",)}),
    )


@admin.register(HotelImage)
class HotelImageAdmin(BaseModelAdmin):
    list_display = ["hotel", "caption", "order", "default_image", "created_at"]
    list_filter = ["default_image", "hotel"]
    search_fields = ["hotel__name", "caption"]
    ordering = ["hotel__name", "order"]
    raw_id_fields = ["hotel"]


@admin.register(HotelChain)
class HotelChainAdmin(SoftDeleteModelAdmin):
    list_display = [
        "name",
        "chain_id",
        "headquarters_country",
        "is_active",
        "deleted_status",
        "created_at",
    ]
    list_filter = ["headquarters_country", "is_active", "is_deleted"]
    search_fields = ["name", "chain_id"]
    ordering = ["name"]
    raw_id_fields = ["headquarters_country"]

    fieldsets = (
        (None, {"fields": ("chain_id", "name", "description")}),
        ("Details", {"fields": ("logo", "website", "headquarters_country")}),
        ("Status", {"fields": ("is_active",)}),
    )


@admin.register(HotelType)
class HotelTypeAdmin(SoftDeleteModelAdmin):
    list_display = ["name", "type_id", "is_active", "deleted_status", "created_at"]
    list_filter = ["is_active", "is_deleted"]
    search_fields = ["name", "type_id"]
    ordering = ["name"]

    fieldsets = (
        (None, {"fields": ("type_id", "name", "description", "icon")}),
        ("Status", {"fields": ("is_active",)}),
    )
