from django.contrib import admin
from .models import LandlordProfile

@admin.register(LandlordProfile)
class LandlordProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'business_name', 'phone_number', 'trust_score']
    search_fields = ['user__email', 'business_name', 'phone_number']
