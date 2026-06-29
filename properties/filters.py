from django_filters import rest_framework as filters
from .models import Property

class PropertyFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name='price_per_month', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price_per_month', lookup_expr='lte')
    min_safety = filters.NumberFilter(field_name='safety_score', lookup_expr='gte')
    min_commute = filters.NumberFilter(field_name='commute_rating', lookup_expr='gte')
    bedrooms = filters.NumberFilter()
    property_type = filters.CharFilter(lookup_expr='iexact')
    area = filters.CharFilter(lookup_expr='iexact')
    noise_level = filters.CharFilter(lookup_expr='iexact')
    lifestyle_tags = filters.CharFilter(lookup_expr='icontains')
    has_parking = filters.BooleanFilter()
    has_security = filters.BooleanFilter()
    has_gym = filters.BooleanFilter()
    has_pool = filters.BooleanFilter()
    has_ac = filters.BooleanFilter()
    pet_friendly = filters.BooleanFilter()
    
    class Meta:
        model = Property
        fields = [
            'area', 'property_type', 'bedrooms', 
            'noise_level', 'lifestyle_tags',
            'min_price', 'max_price',
            'min_safety', 'min_commute',
            'has_parking', 'has_security', 'has_gym',
            'has_pool', 'has_ac', 'pet_friendly'
        ]
