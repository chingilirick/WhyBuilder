from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property
from .serializers import PropertySerializer
from .filters import PropertyFilter

class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.filter(listing_status='verified')
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PropertyFilter
    permission_classes = [permissions.AllowAny]

class PropertyDetailView(generics.RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny]

class PropertyCreateView(generics.CreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(landlord=self.request.user)

class PropertyUpdateView(generics.UpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated]

class PropertyDeleteView(generics.DestroyAPIView):
    queryset = Property.objects.all()
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated]

class NeighbourhoodView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, area):
        properties = Property.objects.filter(
            area__iexact=area,
            listing_status='verified'
        )
        total = properties.count()

        if total == 0:
            return Response({
                'area': area,
                'listingCount': 0,
                'avgSafety': 0,
                'avgCommute': 0,
                'noiseDistribution': {'quiet': 0, 'moderate': 0, 'lively': 0}
            })

        from django.db.models import Avg, Count, Q

        stats = properties.aggregate(
            avg_safety=Avg('safety_score'),
            avg_commute=Avg('commute_rating'),
            quiet=Count('id', filter=Q(noise_level='quiet')),
            moderate=Count('id', filter=Q(noise_level='moderate')),
            lively=Count('id', filter=Q(noise_level='lively')),
        )

        return Response({
            'area': area,
            'listingCount': total,
            'avgSafety': round(stats['avg_safety'] or 0, 1),
            'avgCommute': round(stats['avg_commute'] or 0, 1),
            'noiseDistribution': {
                'quiet': stats['quiet'],
                'moderate': stats['moderate'],
                'lively': stats['lively'],
            }
        })

class HeroSlidesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response([
            {
                "id": 1,
                "image_url": "/images/hero/karen-peaceful-01.jpg",
                "area": "Karen, Nairobi",
                "label": "Family living · Safe · Quiet",
                "sort_order": 1,
                "active": True
            },
            {
                "id": 2,
                "image_url": "/images/hero/westlands-vibrant-01.jpg",
                "area": "Westlands, Nairobi",
                "label": "Urban professionals · Connected · Lively",
                "sort_order": 2,
                "active": True
            },
            {
                "id": 3,
                "image_url": "/images/hero/lavington-elegant-01.jpg",
                "area": "Lavington, Nairobi",
                "label": "Remote work · Calm streets · Well-served",
                "sort_order": 3,
                "active": True
            }
        ])

class NeighbourhoodsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response([
            {
                "id": "1",
                "name": "Westlands",
                "slug": "westlands",
                "tag": "Urban professionals",
                "safetyScore": 88,
                "noiseLevel": "Lively",
                "listings": 312,
                "image_url": "/images/placeholders/property-placeholder.svg",
                "active": True,
                "sort_order": 1
            },
            {
                "id": "2",
                "name": "Karen",
                "slug": "karen",
                "tag": "Family living",
                "safetyScore": 94,
                "noiseLevel": "Quiet",
                "listings": 186,
                "image_url": "/images/placeholders/property-placeholder.svg",
                "active": True,
                "sort_order": 2
            },
            {
                "id": "3",
                "name": "Lavington",
                "slug": "lavington",
                "tag": "Remote-work ready",
                "safetyScore": 91,
                "noiseLevel": "Quiet",
                "listings": 224,
                "image_url": "/images/placeholders/property-placeholder.svg",
                "active": True,
                "sort_order": 3
            }
        ])

class TrustPillarsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response([
            {
                "id": "1",
                "icon": "shield",
                "heading": "Every home. Seen firsthand.",
                "description": "Properties appear on WhyBuilder only after passing our manual review. No exceptions.",
                "active": True,
                "sort_order": 1
            },
            {
                "id": "2",
                "icon": "database",
                "heading": "Safety. Noise. Commute. Measured.",
                "description": "Structured data — not user-generated opinions. Every score is reviewed before a listing goes live.",
                "active": True,
                "sort_order": 2
            },
            {
                "id": "3",
                "icon": "user-check",
                "heading": "Landlord. ID. History. Verified.",
                "description": "Every landlord carries a trust score built from verified listings and renter history.",
                "active": True,
                "sort_order": 3
            }
        ])

class LifestyleCategoriesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response([
            {
                "id": "1",
                "title": "Quiet living",
                "slug": "quiet",
                "headline": "Spaces designed for calmer living",
                "description": "Low traffic, green surroundings, and peaceful streets. Perfect for focus, rest, and slower routines.",
                "accentColor": "#10B981",
                "image_url": "/images/placeholders/property-placeholder.svg",
                "sceneLabel": "Karen, Nairobi",
                "sceneDetail": "Morning light on a quiet Karen street",
                "matchCount": 1243,
                "active": True,
                "sort_order": 1
            },
            {
                "id": "2",
                "title": "Social areas",
                "slug": "social",
                "headline": "Where life happens",
                "description": "Cafés, parks, restaurants, and energy. Walkable neighbourhoods where you're never far from something happening.",
                "accentColor": "#F59E0B",
                "image_url": "/images/placeholders/property-placeholder.svg",
                "sceneLabel": "Westlands, Nairobi",
                "sceneDetail": "Westlands buzz — cafés, co-working, nightlife",
                "matchCount": 2341,
                "active": True,
                "sort_order": 2
            },
            {
                "id": "3",
                "title": "Work-friendly",
                "slug": "work",
                "headline": "Homes built for focus and flexibility",
                "description": "Fast internet, quiet interiors, dedicated workspace potential. Designed for remote work and deep focus.",
                "accentColor": "#1E3A8A",
                "image_url": "/images/placeholders/property-placeholder.svg",
                "sceneLabel": "Lavington, Nairobi",
                "sceneDetail": "Remote work setup with city views",
                "matchCount": 1892,
                "active": True,
                "sort_order": 3
            }
        ])
