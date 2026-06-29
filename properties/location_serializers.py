from rest_framework import serializers
from .models import Property

class LocationCaptureSerializer(serializers.Serializer):
    latitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    address = serializers.CharField(required=False, allow_blank=True)
    location_accuracy = serializers.ChoiceField(
        choices=['gps', 'address', 'manual'],
        default='gps'
    )
    
    def validate(self, data):
        lat = data.get('latitude')
        lon = data.get('longitude')
        
        # Validate coordinates are in Kenya
        from .geocoding import GeocodingService
        if not GeocodingService.validate_coordinates(lat, lon):
            raise serializers.ValidationError(
                "Coordinates must be within Nairobi area"
            )
        
        return data

class PropertyLocationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['latitude', 'longitude', 'location_accuracy']
        
    def validate_latitude(self, value):
        from .geocoding import GeocodingService
        if not GeocodingService.validate_coordinates(value, self.initial_data.get('longitude', 0)):
            raise serializers.ValidationError("Invalid latitude for Nairobi area")
        return value
    
    def validate_longitude(self, value):
        from .geocoding import GeocodingService
        if not GeocodingService.validate_coordinates(self.initial_data.get('latitude', 0), value):
            raise serializers.ValidationError("Invalid longitude for Nairobi area")
        return value
