from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'hotels', views.HotelViewSet, basename='hotel')
router.register(r'hotel-images', views.HotelImageViewSet, basename='hotelimage')

# Admin router
admin_router = DefaultRouter()
admin_router.register(r"admin/hotels", views.AdminHotelViewSet, basename="admin-hotel")

app_name = "hotels"

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    path('', include(admin_router.urls)),
] 