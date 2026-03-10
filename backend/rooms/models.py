from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator
from core.models import SoftDeleteModel, BaseModel


class RoomAmenity(SoftDeleteModel):
    """Room amenities model"""
    name = models.CharField(max_length=255)
    order = models.IntegerField(default=1)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Room Amenity'
        verbose_name_plural = 'Room Amenities'

    def __str__(self):
        return self.name


class BedType(SoftDeleteModel):
    """Bed types model"""
    type = models.CharField(max_length=255, help_text="e.g., Double bed(s), Extra-large double bed(s)")
    size = models.CharField(max_length=100, help_text="e.g., 131-150 cm wide")

    class Meta:
        ordering = ['type']
        verbose_name = 'Bed Type'
        verbose_name_plural = 'Bed Types'

    def __str__(self):
        return f"{self.type} ({self.size})"


class Room(SoftDeleteModel):
    """Hotel room model"""
    hotel = models.ForeignKey('hotels.Hotel', on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    # Price (per night)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
        blank=True,
        null=True,
        help_text="Price per night for this room",
    )
    # Room specifications
    size = models.IntegerField(validators=[MinValueValidator(1)], help_text="Room size in square meters/feet")
    unit = models.CharField(max_length=10, default='m2', help_text="Unit of measurement (m2, ft2)")
    
    # Occupancy
    adults = models.IntegerField(validators=[MinValueValidator(1)], help_text="Maximum adults")
    children = models.IntegerField(validators=[MinValueValidator(0)], help_text="Maximum children")
    occupancy = models.IntegerField(validators=[MinValueValidator(1)], help_text="Total occupancy")
    
    # Relations
    amenities = models.ManyToManyField(RoomAmenity, blank=True, related_name='rooms')
    
    # Status
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['hotel', 'name']
        verbose_name = 'Room'
        verbose_name_plural = 'Rooms'

    def __str__(self):
        return f"{self.hotel.name} - {self.name}"


class RoomBedType(BaseModel):
    """Many-to-many relationship between rooms and bed types with quantity"""
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bed_types')
    bed_type = models.ForeignKey(BedType, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)], default=1)

    class Meta:
        unique_together = ['room', 'bed_type']
        verbose_name = 'Room Bed Type'
        verbose_name_plural = 'Room Bed Types'

    def __str__(self):
        return f"{self.room.name} - {self.quantity}x {self.bed_type.type}"


class RoomImage(BaseModel):
    """Room images model"""
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='photos')
    url = models.URLField(max_length=500)
    description = models.CharField(max_length=255, blank=True)
    score = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    main_photo = models.BooleanField(default=False)

    class Meta:
        ordering = ['-main_photo', '-score', 'created_at']
        verbose_name = 'Room Image'
        verbose_name_plural = 'Room Images'

    def __str__(self):
        return f"{self.room.name} - {self.description or 'Image'}"
