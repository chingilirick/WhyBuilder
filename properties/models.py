from django.db import models
from django.conf import settings

class Property(models.Model):
    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    address = models.CharField(max_length=255)
    area = models.CharField(max_length=100)
    city = models.CharField(max_length=100, default='Nairobi')
    
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    location_accuracy = models.CharField(
        max_length=20,
        choices=[('gps', 'GPS exact'), ('address', 'Address based'), ('manual', 'Manually placed'), ('unknown', 'Unknown')],
        default='unknown'
    )
    
    price_per_month = models.IntegerField()
    bedrooms = models.IntegerField()
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1)
    size_sqft = models.IntegerField(null=True, blank=True)
    property_type = models.CharField(max_length=50)
    
    safety_score = models.IntegerField(help_text="0-100")
    noise_level = models.CharField(
        max_length=20,
        choices=[('quiet', 'Quiet'), ('moderate', 'Moderate'), ('lively', 'Lively')],
        default='moderate'
    )
    commute_rating = models.IntegerField(help_text="0-100")
    lifestyle_tags = models.JSONField(default=list)
    area_insight = models.TextField(blank=True)
    
    has_parking = models.BooleanField(default=False)
    has_security = models.BooleanField(default=False)
    has_gym = models.BooleanField(default=False)
    has_pool = models.BooleanField(default=False)
    has_ac = models.BooleanField(default=False)
    pet_friendly = models.BooleanField(default=False)
    
    listing_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('verified', 'Verified'), ('rejected', 'Rejected')],
        default='pending'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def full_address(self):
        return f"{self.address}, {self.area}, {self.city}"

    @property
    def has_coordinates(self):
        return self.latitude is not None and self.longitude is not None

    def __str__(self):
        return self.title
