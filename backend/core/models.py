import uuid
from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    """Abstract base model with UUID primary key and timestamp fields"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteManager(models.Manager):
    """Manager that filters out soft-deleted objects by default"""

    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

    def with_deleted(self):
        """Return queryset including soft-deleted objects"""
        return super().get_queryset()

    def deleted_only(self):
        """Return only soft-deleted objects"""
        return super().get_queryset().filter(is_deleted=True)


class SoftDeleteModel(BaseModel):
    """Abstract base model with soft delete functionality"""

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # Manager that includes deleted objects

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        """Soft delete the object"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(using=using)

    def hard_delete(self, using=None, keep_parents=False):
        """Permanently delete the object"""
        super().delete(using=using, keep_parents=keep_parents)

    def restore(self):
        """Restore a soft-deleted object"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()


class TimeStampedModel(models.Model):
    """Abstract base model with timestamp fields (deprecated - use BaseModel instead)"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Country(SoftDeleteModel):
    """Country model"""

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3, unique=True, help_text="ISO country code")
    currency = models.CharField(max_length=3, help_text="Currency code")
    phone_code = models.CharField(max_length=10, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name


class City(SoftDeleteModel):
    """City model"""

    name = models.CharField(max_length=100)
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, related_name="cities"
    )
    latitude = models.DecimalField(
        max_digits=10, decimal_places=8, blank=True, null=True
    )
    longitude = models.DecimalField(
        max_digits=11, decimal_places=8, blank=True, null=True
    )
    timezone = models.CharField(max_length=50, blank=True, null=True)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "City"
        verbose_name_plural = "Cities"
        unique_together = ["name", "country"]

    def __str__(self):
        return f"{self.name}, {self.country.name}"


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
