from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    landlord_name = serializers.SerializerMethodField()
    landlord_email = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'address', 'area', 'city',
            'latitude', 'longitude', 'location_accuracy',
            'price_per_month', 'bedrooms', 'bathrooms', 'size_sqft',
            'property_type', 'safety_score', 'noise_level', 'commute_rating',
            'lifestyle_tags', 'area_insight', 'listing_status',
            'has_parking', 'has_security', 'has_gym', 'has_pool',
            'has_ac', 'pet_friendly', 'created_at', 'verified_at',
            'landlord_name', 'landlord_email', 'image_url'
        ]

    def get_landlord_name(self, obj):
        if obj.landlord:
            return obj.landlord.get_full_name() or obj.landlord.email
        return None

    def get_landlord_email(self, obj):
        if obj.landlord:
            return obj.landlord.email
        return None

    def get_image_url(self, obj):
        # Return the image_url field if it exists
        if hasattr(obj, 'image_url') and obj.image_url:
            return obj.image_url
        return None
