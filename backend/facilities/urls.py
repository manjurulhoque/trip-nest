from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'facilities', views.FacilityViewSet, basename='facility')
router.register(r'categories', views.CategoryViewSet, basename='category')

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'admin/facilities', views.AdminFacilityViewSet, basename='admin-facility')
admin_router.register(r'admin/categories', views.CategoryViewSet, basename='admin-category')

app_name = 'facilities'

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    path('', include(admin_router.urls)),
] 