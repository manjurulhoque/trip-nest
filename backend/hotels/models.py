import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from facilities.models import Facility
from core.models import City, HotelChain, HotelType, SoftDeleteModel, BaseModel


class Hotel(SoftDeleteModel):
    """Main hotel model"""

    name = models.CharField(max_length=255)
    main_photo = models.URLField(max_length=500, blank=True, null=True)
    thumbnail = models.URLField(max_length=500, blank=True, null=True)

    # Owner information
    owner = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="owned_hotels",
        limit_choices_to={"role": "host"},
        help_text="Host who owns this hotel",
    )

    # Location details
    latitude = models.DecimalField(
        max_digits=10, decimal_places=8, blank=True, null=True
    )
    longitude = models.DecimalField(
        max_digits=11, decimal_places=8, blank=True, null=True
    )
    address = models.TextField()
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="hotels")
    address_suburb = models.CharField(max_length=100, blank=True, null=True)

    # Hotel details
    stars = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Hotel star rating (1-5)",
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        blank=True,
        null=True,
        help_text="Hotel rating (0-10)",
    )
    ranking = models.IntegerField(default=0)
    reviews_count = models.IntegerField(default=0)
    best_seller = models.BooleanField(default=False)

    # Business details
    chain = models.ForeignKey(
        HotelChain,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="hotels",
    )
    hotel_type = models.ForeignKey(
        HotelType,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="hotels",
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    # Relations
    facilities = models.ManyToManyField(Facility, blank=True, related_name="hotels")

    # Status
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-rating", "name"]
        verbose_name = "Hotel"
        verbose_name_plural = "Hotels"

    def __str__(self):
        return f"{self.name} ({self.stars}★)"


class HotelImage(BaseModel):
    """Hotel images model"""

    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="images")
    url = models.URLField(max_length=500)
    url_hd = models.URLField(max_length=500, blank=True, null=True)
    thumbnail_url = models.URLField(max_length=500, blank=True, null=True)
    caption = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=1)
    default_image = models.BooleanField(default=False)

    class Meta:
        ordering = ["order", "created_at"]
        verbose_name = "Hotel Image"
        verbose_name_plural = "Hotel Images"

    def __str__(self):
        return f"{self.hotel.name} - {self.caption or 'Image'}"
