from django.db import models
from django.conf import settings

class LandlordProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    trust_score = models.IntegerField(default=50)
    response_rate = models.IntegerField(default=0)
    total_listings = models.IntegerField(default=0)
    verified_listings_count = models.IntegerField(default=0)
    member_since = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
