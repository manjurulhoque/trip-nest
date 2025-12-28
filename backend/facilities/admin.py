from django.contrib import admin
from core.admin import SoftDeleteModelAdmin
from .models import Facility, Category


@admin.register(Category)
class CategoryAdmin(SoftDeleteModelAdmin):
    list_display = ["name", "facility_count", "is_active", "deleted_status", "created_at"]
    list_filter = ["is_active", "is_deleted"]
    search_fields = ["name", "description"]
    ordering = ["name"]
    list_editable = ["is_active"]

    fieldsets = (
        (None, {"fields": ("name", "description")}),
        ("Display", {"fields": ("icon",)}),
        ("Status", {"fields": ("is_active",)}),
    )

    def facility_count(self, obj):
        """Display count of facilities in this category"""
        return obj.facility_set.filter(is_active=True).count()
    facility_count.short_description = "Active Facilities"


@admin.register(Facility)
class FacilityAdmin(SoftDeleteModelAdmin):
    list_display = ["name", "category", "is_active", "deleted_status", "created_at"]
    list_filter = ["category", "is_active", "is_deleted"]
    search_fields = ["name", "description"]
    ordering = ["name"]
    list_editable = ["is_active"]

    fieldsets = (
        (None, {"fields": ("name", "description")}),
        ("Categorization", {"fields": ("category", "icon")}),
        ("Status", {"fields": ("is_active",)}),
    )
