from django.shortcuts import render
from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Room, RoomAmenity, BedType, RoomBedType, RoomImage
from .serializers import (
    RoomListSerializer, RoomDetailSerializer, RoomCreateUpdateSerializer,
    RoomStatsSerializer, AdminRoomSerializer, RoomAmenitySerializer,
    BedTypeSerializer, AdminRoomAmenitySerializer, AdminBedTypeSerializer
)
from users.permissions import IsHostOrReadOnly, IsSuperAdmin, IsVerifiedHost
from utils.response import api_response
import structlog

logger = structlog.get_logger(__name__)


@extend_schema_view(
    list=extend_schema(
        summary="List Rooms",
        description="List all active rooms with filtering capabilities"
    ),
    create=extend_schema(
        summary="Create Room",
        description="Create a new room (verified hosts only)"
    ),
    retrieve=extend_schema(
        summary="Get Room Details",
        description="Get detailed information about a specific room"
    ),
    update=extend_schema(
        summary="Update Room",
        description="Update room information (owner or admin only)"
    ),
    partial_update=extend_schema(
        summary="Partially Update Room",
        description="Partially update room information (owner or admin only)"
    ),
    destroy=extend_schema(
        summary="Delete Room",
        description="Soft delete room (owner or admin only)"
    )
)
class RoomViewSet(ModelViewSet):
    """Room management viewset"""
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'hotel', 'adults', 'children', 'occupancy', 'size', 
        'unit', 'amenities', 'is_active'
    ]
    search_fields = ['name', 'description', 'hotel__name']
    ordering_fields = ['name', 'size', 'adults', 'occupancy', 'created_at']
    ordering = ['hotel', 'name']
    
    def get_queryset(self):
        """Get queryset based on user permissions and action"""
        if self.action == 'list':
            # Public listing - only active rooms from active hotels
            return Room.objects.filter(is_active=True, hotel__is_active=True)
        elif self.request.user.is_superuser:
            # Admins can see all rooms
            return Room.objects.all()
        elif self.request.user.is_authenticated and self.request.user.is_host():
            # Hosts can see their own rooms + active rooms
            if self.action in ['update', 'partial_update', 'destroy']:
                return Room.objects.filter(hotel__owner=self.request.user)
            else:
                return Room.objects.filter(
                    Q(is_active=True, hotel__is_active=True) | 
                    Q(hotel__owner=self.request.user)
                )
        else:
            # Guests can only see active rooms from active hotels
            return Room.objects.filter(is_active=True, hotel__is_active=True)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on user role and action"""
        if self.request.user.is_superuser:
            if self.action == 'list':
                return RoomListSerializer
            elif self.action in ['create', 'update', 'partial_update']:
                return AdminRoomSerializer
            else:
                return AdminRoomSerializer
        elif self.action == 'list':
            return RoomListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return RoomCreateUpdateSerializer
        else:
            return RoomDetailSerializer
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == 'list':
            permission_classes = [permissions.AllowAny]
        elif self.action == 'retrieve':
            permission_classes = [permissions.AllowAny]
        elif self.action == 'create':
            permission_classes = [IsVerifiedHost]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsHostOrReadOnly]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        super().perform_create(serializer)
        room = serializer.instance
        logger.info(
            "room_created",
            room_id=str(room.pk),
            hotel_id=str(room.hotel_id),
            actor_id=str(self.request.user.pk),
        )

    def perform_destroy(self, instance):
        room_id = str(instance.pk)
        hotel_id = str(instance.hotel_id)
        super().perform_destroy(instance)
        logger.info(
            "room_soft_deleted",
            room_id=room_id,
            hotel_id=hotel_id,
            actor_id=str(self.request.user.pk),
        )

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def search(self, request):
        """Advanced room search with filters"""
        queryset = self.get_queryset()
        
        # Apply filters
        hotel_id = request.query_params.get('hotel')
        if hotel_id:
            queryset = queryset.filter(hotel__id=hotel_id)
        
        min_adults = request.query_params.get('min_adults')
        if min_adults:
            queryset = queryset.filter(adults__gte=min_adults)
        
        min_children = request.query_params.get('min_children')
        if min_children:
            queryset = queryset.filter(children__gte=min_children)
        
        min_occupancy = request.query_params.get('min_occupancy')
        if min_occupancy:
            queryset = queryset.filter(occupancy__gte=min_occupancy)
        
        min_size = request.query_params.get('min_size')
        if min_size:
            queryset = queryset.filter(size__gte=min_size)
        
        max_size = request.query_params.get('max_size')
        if max_size:
            queryset = queryset.filter(size__lte=max_size)
        
        amenities = request.query_params.getlist('amenities[]')
        if amenities:
            queryset = queryset.filter(amenities__id__in=amenities).distinct()
        
        # Apply search
        query = request.query_params.get('q')
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(hotel__name__icontains=query)
            )
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = RoomListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = RoomListSerializer(queryset, many=True, context={'request': request})
        return api_response(
            success=True,
            data=serializer.data
        )
    
    @action(detail=True, methods=['get'], permission_classes=[IsHostOrReadOnly])
    def stats(self, request, pk=None):
        """Get room statistics"""
        room = self.get_object()
        
        if not (room.hotel.owner == request.user or request.user.is_superuser):
            return api_response(
                success=False,
                errors={'error': 'Permission denied'},
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        serializer = RoomStatsSerializer(room, context={'request': request})
        return api_response(
            success=True,
            data=serializer.data
        )
    
    @action(detail=False, methods=['get'], permission_classes=[IsVerifiedHost])
    def my_rooms(self, request):
        """Get current user's rooms"""
        queryset = Room.objects.filter(hotel__owner=request.user)
        
        # Filter by hotel if specified
        hotel_id = request.query_params.get('hotel')
        if hotel_id:
            queryset = queryset.filter(hotel__id=hotel_id)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = RoomListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = RoomListSerializer(queryset, many=True, context={'request': request})
        return api_response(
            success=True,
            data=serializer.data
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsHostOrReadOnly])
    def toggle_active(self, request, pk=None):
        """Toggle room active status"""
        room = self.get_object()
        
        if not (room.hotel.owner == request.user or request.user.is_superuser):
            return api_response(
                success=False,
                errors={'error': 'Permission denied'},
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        room.is_active = not room.is_active
        room.save()

        logger.info(
            "room_toggle_active",
            room_id=str(room.pk),
            is_active=room.is_active,
            actor_id=str(request.user.pk),
        )

        return api_response(
            success=True,
            data={
                'room': RoomDetailSerializer(room, context={'request': request}).data
            }
        )


@extend_schema_view(
    list=extend_schema(
        summary="List Room Amenities",
        description="List all available room amenities"
    ),
    create=extend_schema(
        summary="Create Room Amenity",
        description="Create a new room amenity (admin only)"
    ),
    retrieve=extend_schema(
        summary="Get Room Amenity",
        description="Get room amenity details"
    ),
    update=extend_schema(
        summary="Update Room Amenity",
        description="Update room amenity (admin only)"
    ),
    partial_update=extend_schema(
        summary="Partially Update Room Amenity",
        description="Partially update room amenity (admin only)"
    ),
    destroy=extend_schema(
        summary="Delete Room Amenity",
        description="Soft delete room amenity (admin only)"
    )
)
class RoomAmenityViewSet(ModelViewSet):
    """Room amenity management viewset"""
    queryset = RoomAmenity.objects.filter(is_active=True)
    serializer_class = RoomAmenitySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['name', 'category', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        """Get queryset based on user permissions"""
        if self.request.user.is_superuser:
            return RoomAmenity.objects.all()
        else:
            return RoomAmenity.objects.filter(is_active=True)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on user role"""
        if self.request.user.is_superuser:
            if self.action in ['create', 'update', 'partial_update']:
                return AdminRoomAmenitySerializer
            else:
                return AdminRoomAmenitySerializer
        return RoomAmenitySerializer
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsSuperAdmin]
        
        return [permission() for permission in permission_classes]


@extend_schema_view(
    list=extend_schema(
        summary="List Bed Types",
        description="List all available bed types"
    ),
    create=extend_schema(
        summary="Create Bed Type",
        description="Create a new bed type (admin only)"
    ),
    retrieve=extend_schema(
        summary="Get Bed Type",
        description="Get bed type details"
    ),
    update=extend_schema(
        summary="Update Bed Type",
        description="Update bed type (admin only)"
    ),
    partial_update=extend_schema(
        summary="Partially Update Bed Type",
        description="Partially update bed type (admin only)"
    ),
    destroy=extend_schema(
        summary="Delete Bed Type",
        description="Soft delete bed type (admin only)"
    )
)
class BedTypeViewSet(ModelViewSet):
    """Bed type management viewset"""
    queryset = BedType.objects.filter(is_deleted=False)
    serializer_class = BedTypeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'size']
    search_fields = ['type', 'size']
    ordering_fields = ['type', 'size', 'created_at']
    ordering = ['type']
    
    def get_queryset(self):
        """Get queryset based on user permissions"""
        if self.request.user.is_superuser:
            return BedType.objects.all()
        else:
            return BedType.objects.filter(is_deleted=False)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on user role"""
        if self.request.user.is_superuser:
            if self.action in ['create', 'update', 'partial_update']:
                return AdminBedTypeSerializer
            else:
                return AdminBedTypeSerializer
        return BedTypeSerializer
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsSuperAdmin]
        
        return [permission() for permission in permission_classes]


# Admin-specific views
@extend_schema_view(
    list=extend_schema(
        summary="Admin - List All Rooms",
        description="Admin view to list all rooms with full details"
    ),
    create=extend_schema(
        summary="Admin - Create Room",
        description="Admin create room with full permissions"
    ),
    retrieve=extend_schema(
        summary="Admin - Get Room Details",
        description="Admin view room with full details"
    ),
    update=extend_schema(
        summary="Admin - Update Room",
        description="Admin update room with full permissions"
    ),
    partial_update=extend_schema(
        summary="Admin - Partially Update Room",
        description="Admin partially update room with full permissions"
    ),
    destroy=extend_schema(
        summary="Admin - Delete Room",
        description="Admin delete room permanently"
    )
)
class AdminRoomViewSet(ModelViewSet):
    """Admin room management viewset"""
    queryset = Room.objects.all()
    serializer_class = AdminRoomSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['hotel', 'is_active', 'is_deleted']
    search_fields = ['name', 'description', 'hotel__name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get room statistics for admin dashboard"""
        stats = {
            'total_rooms': Room.objects.count(),
            'active_rooms': Room.objects.filter(is_active=True).count(),
            'inactive_rooms': Room.objects.filter(is_active=False).count(),
            'deleted_rooms': Room.all_objects.filter(is_deleted=True).count(),
            'rooms_by_hotel': {},
            'popular_rooms': [],
            'recent_rooms': []
        }
        
        # Rooms by hotel
        hotels = Room.objects.values('hotel__name').annotate(
            count=Count('id')
        ).order_by('-count')
        
        for hotel in hotels:
            stats['rooms_by_hotel'][hotel['hotel__name'] or 'uncategorized'] = hotel['count']
        
        # Popular rooms (by bookings)
        stats['popular_rooms'] = list(Room.objects.filter(
            is_active=True
        ).annotate(
            booking_count=Count('bookings')
        ).order_by('-booking_count')[:10].values('name', 'booking_count'))
        
        # Recent rooms
        recent_rooms = Room.objects.order_by('-created_at')[:5]
        stats['recent_rooms'] = AdminRoomSerializer(
            recent_rooms, many=True, context={'request': request}
        ).data
        
        return api_response(
            success=True,
            data=stats
        )
    
    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore a soft-deleted room"""
        try:
            room = Room.all_objects.get(pk=pk, is_deleted=True)
            room.restore()
            logger.info(
                "admin_room_restored",
                room_id=str(room.pk),
                actor_id=str(request.user.pk),
            )
            return api_response(
                success=True,
                data={
                    'room': AdminRoomSerializer(room, context={'request': request}).data
                }
            )
        except Room.DoesNotExist:
            return api_response(
                success=False,
                errors={'error': 'Room not found or not deleted'},
                status_code=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['delete'])
    def hard_delete(self, request, pk=None):
        """Permanently delete a room"""
        room = self.get_object()
        room_id = str(room.pk)
        room.hard_delete()
        logger.warning(
            "admin_room_hard_deleted",
            room_id=room_id,
            actor_id=str(request.user.pk),
        )
        return api_response(
            success=True,
            data={},
            status_code=status.HTTP_204_NO_CONTENT
        )
