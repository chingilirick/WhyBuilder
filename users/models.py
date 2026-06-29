from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ACCOUNT_TYPES = [
        ('renter', 'Renter'),
        ('landlord', 'Landlord'),
        ('administrator', 'Administrator'),
    ]
    
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES, default='renter')
    trust_score = models.IntegerField(default=50)
    phone_number = models.CharField(max_length=15, blank=True)
    business_name = models.CharField(max_length=100, blank=True)
    response_rate = models.IntegerField(default=0)
    total_listings = models.IntegerField(default=0)
    verified_listings_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email
