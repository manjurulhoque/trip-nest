from django.contrib import admin
from core.admin import SoftDeleteModelAdmin
from .models import Review


@admin.register(Review)
class ReviewAdmin(SoftDeleteModelAdmin):
    list_display = ['hotel', 'reviewer_name', 'rating', 'is_verified', 'is_active', 'deleted_status', 'created_at']
    list_filter = ['rating', 'is_verified', 'is_active', 'reviewer_country', 'hotel', 'is_deleted']
    search_fields = ['hotel__name', 'reviewer_name', 'title', 'content']
    ordering = ['-created_at']
    list_editable = ['is_active', 'is_verified']
    raw_id_fields = ['hotel', 'user']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {
            'fields': ('hotel', 'user', 'title', 'content', 'rating')
        }),
        ('Reviewer Info', {
            'fields': ('reviewer_name', 'reviewer_country', 'review_date')
        }),
        ('Status', {
            'fields': ('is_active', 'is_verified')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('hotel', 'user')
