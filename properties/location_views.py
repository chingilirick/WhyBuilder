from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Property
from .location_serializers import LocationCaptureSerializer, PropertyLocationUpdateSerializer
from .geocoding import GeocodingService

class LocationCaptureView(APIView):
    """
    Endpoint for landlords to capture GPS location
    POST /api/properties/location/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = LocationCaptureSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        lat = data['latitude']
        lon = data['longitude']
        
        # Try to get address from coordinates
        address = data.get('address')
        if not address:
            address = GeocodingService.reverse_geocode(lat, lon)
        
        return Response({
            'status': 'success',
            'data': {
                'latitude': str(lat),
                'longitude': str(lon),
                'address': address or 'Address not found',
                'location_accuracy': data.get('location_accuracy', 'gps'),
                'validated': True
            }
        }, status=status.HTTP_200_OK)

class PropertyLocationUpdateView(APIView):
    """
    Update property location after creation
    PATCH /api/properties/<id>/location/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, property_id):
        property_obj = get_object_or_404(Property, id=property_id)
        
        # Check ownership
        if property_obj.landlord != request.user:
            return Response(
                {'error': 'You do not own this property'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = PropertyLocationUpdateSerializer(
            property_obj, 
            data=request.data,
            partial=True
        )
        
        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save()
        
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

class AddressGeocodeView(APIView):
    """
    Convert address to coordinates
    POST /api/properties/geocode/
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        address = request.data.get('address')
        
        if not address:
            return Response(
                {'error': 'Address is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = GeocodingService.geocode_address(address)
        
        if not result:
            return Response(
                {'error': 'Address not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            'status': 'success',
            'data': {
                'latitude': str(result['latitude']),
                'longitude': str(result['longitude']),
                'display_name': result['display_name'],
                'accuracy': result['accuracy']
            }
        }, status=status.HTTP_200_OK)
