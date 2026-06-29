from django.contrib import admin
from .models import Property

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'area', 'price_per_month', 'listing_status', 'created_at']
    list_filter = ['listing_status', 'area', 'noise_level']
    search_fields = ['title', 'address', 'area']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Info', {'fields': ('title', 'description', 'property_type')}),
        ('Location', {'fields': ('address', 'area', 'city', 'latitude', 'longitude', 'location_accuracy')}),
        ('Pricing & Specs', {'fields': ('price_per_month', 'bedrooms', 'bathrooms', 'size_sqft')}),
        ('Decision Data', {'fields': ('safety_score', 'noise_level', 'commute_rating', 'lifestyle_tags', 'area_insight')}),
        ('Amenities', {'fields': ('has_parking', 'has_security', 'has_gym', 'has_pool', 'has_ac', 'pet_friendly')}),
        ('Status', {'fields': ('listing_status', 'verified_at')}),
    )
