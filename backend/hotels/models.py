import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from facilities.models import Facility
from core.models import City, Country, SoftDeleteModel, BaseModel


class HotelChain(SoftDeleteModel):
    """
    Hotel chain model
    This model is used to store information group hotels that are owned by the same company.
    For example, Hilton, Marriott, etc. Display brand name in the UI.
    """

    chain_id = models.IntegerField(unique=True, help_text="External chain ID")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    logo = models.URLField(max_length=500, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    headquarters_country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, blank=True, null=True
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Hotel Chain"
        verbose_name_plural = "Hotel Chains"

    def __str__(self):
        return self.name


class HotelType(SoftDeleteModel):
    """Hotel type model (e.g., Resort, Business Hotel, etc.)"""

    type_id = models.IntegerField(unique=True, help_text="External type ID")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Hotel Type"
        verbose_name_plural = "Hotel Types"

    def __str__(self):
        return self.name


class Hotel(SoftDeleteModel):
    """Main hotel model"""

    name = models.CharField(max_length=255)
    main_photo = models.URLField(max_length=500, blank=True, null=True)
    thumbnail = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

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
