from rest_framework import serializers
from .models import Property, PropertyImage

class PropertySerializer(serializers.ModelSerializer):
    landlord_name = serializers.SerializerMethodField()
    landlord_email = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

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
            'landlord_name', 'landlord_email', 'image_url', 'images'
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
        request = self.context.get('request')
        if obj.image and obj.image.name:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        if obj.image_url:
            return obj.image_url
        return None

    def get_images(self, obj):
        request = self.context.get('request')
        result = []
        for img in obj.images.all():
            url = img.image.url
            if request:
                url = request.build_absolute_uri(url)
            result.append({
                'id': img.id,
                'image_url': url,
                'display_order': img.display_order,
            })
        return result
