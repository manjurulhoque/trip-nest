from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'rooms', views.RoomViewSet, basename='room')
router.register(r'room-amenities', views.RoomAmenityViewSet, basename='roomamenity')
router.register(r'bed-types', views.BedTypeViewSet, basename='bedtype')

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'admin/rooms', views.AdminRoomViewSet, basename='admin-room')

app_name = 'rooms'

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    path('', include(admin_router.urls)),
] 