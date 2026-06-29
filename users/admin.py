from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'account_type', 'trust_score', 'is_staff']
    list_filter = ['account_type', 'is_staff', 'is_active']
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    
    fieldsets = UserAdmin.fieldsets + (
        ('WhyBuilder Fields', {
            'fields': ('account_type', 'trust_score', 'phone_number', 'business_name', 
                      'response_rate', 'total_listings', 'verified_listings_count')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('WhyBuilder Fields', {
            'fields': ('account_type', 'trust_score', 'phone_number', 'business_name')
        }),
    )
