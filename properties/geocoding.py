import requests
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

class GeocodingService:
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
    REVERSE_URL = "https://nominatim.openstreetmap.org/reverse"
    USER_AGENT = "WhyBuilder/1.0 (https://whybuilder.com)"
    
    @classmethod
    def geocode_address(cls, address):
        """
        Convert address to coordinates using OpenStreetMap Nominatim
        Returns: {'latitude': Decimal, 'longitude': Decimal, 'display_name': str}
        """
        if not address:
            return None
        
        params = {
            'q': address,
            'format': 'json',
            'limit': 1,
            'addressdetails': 1
        }
        
        headers = {'User-Agent': cls.USER_AGENT}
        
        try:
            response = requests.get(
                cls.NOMINATIM_URL, 
                params=params, 
                headers=headers, 
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return {
                        'latitude': Decimal(str(data[0]['lat'])),
                        'longitude': Decimal(str(data[0]['lon'])),
                        'display_name': data[0].get('display_name', ''),
                        'accuracy': 'address'
                    }
            return None
            
        except requests.RequestException as e:
            logger.error(f"Geocoding error: {e}")
            return None
    
    @classmethod
    def reverse_geocode(cls, lat, lon):
        """
        Get address from coordinates
        """
        params = {
            'lat': lat,
            'lon': lon,
            'format': 'json'
        }
        
        headers = {'User-Agent': cls.USER_AGENT}
        
        try:
            response = requests.get(
                cls.REVERSE_URL, 
                params=params, 
                headers=headers, 
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data and 'display_name' in data:
                    return data['display_name']
            return None
            
        except requests.RequestException as e:
            logger.error(f"Reverse geocoding error: {e}")
            return None
    
    @classmethod
    def validate_coordinates(cls, lat, lon):
        """
        Validate coordinates are within reasonable range
        Nairobi: -1.5 to -1.0, 36.5 to 37.0
        """
        try:
            lat = float(lat)
            lon = float(lon)
            
            # Nairobi bounds (approx)
            if -2.0 <= lat <= -0.5 and 36.0 <= lon <= 37.5:
                return True
            return False
            
        except (ValueError, TypeError):
            return False
