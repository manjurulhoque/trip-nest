import uuid
from django.db import models
from core.models import SoftDeleteModel


class Category(SoftDeleteModel):
    """Model for categories"""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Facility(SoftDeleteModel):
    """Model for hotel facilities/amenities"""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, blank=True, null=True
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Facility"
        verbose_name_plural = "Facilities"

    def __str__(self):
        return self.name
