from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property
from .serializers import PropertySerializer
from .filters import PropertyFilter
from .permissions import IsLandlordOwner, IsAdministrator
from .models import PropertyImage
from .image_utils import validate_and_process_image, check_duplicate
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone

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
    permission_classes = [permissions.IsAuthenticated, IsLandlordOwner]

class PropertyDeleteView(generics.DestroyAPIView):
    queryset = Property.objects.all()
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated, IsLandlordOwner]


class PropertyVerifyView(APIView):
    """Admin-only: approve or reject a pending listing."""
    permission_classes = [permissions.IsAuthenticated, IsAdministrator]

    def patch(self, request, id):
        property = get_object_or_404(Property, id=id)
        action = request.data.get('action')

        if action not in ('approved', 'rejected'):
            return Response(
                {'error': "action must be 'approved' or 'rejected'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        property.listing_status = 'verified' if action == 'approved' else 'rejected'
        if action == 'approved':
            property.verified_at = timezone.now()
        property.save()

        return Response(PropertySerializer(property, context={'request': request}).data)


class PendingListingsView(generics.ListAPIView):
    """Admin-only: list all listings awaiting review."""
    queryset = Property.objects.filter(listing_status='pending').order_by('created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdministrator]


MIN_IMAGES = 5
MAX_IMAGES = 20


class PropertyImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsLandlordOwner]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, id):
        property_obj = get_object_or_404(Property, id=id)
        self.check_object_permissions(request, property_obj)

        files = request.FILES.getlist('images')
        if not files:
            return Response({'error': 'No images provided.'}, status=status.HTTP_400_BAD_REQUEST)

        existing_count = property_obj.images.count()
        if existing_count + len(files) > MAX_IMAGES:
            return Response(
                {'error': f'Maximum {MAX_IMAGES} images per listing. This listing has {existing_count}.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        created = []
        for f in files:
            try:
                processed_file, file_hash = validate_and_process_image(f)
            except DjangoValidationError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            if check_duplicate(file_hash, property_obj.landlord_id):
                return Response(
                    {'error': f'Image "{f.name}" matches a photo already used on another landlord\'s listing. Duplicate/stolen listing photos are not permitted.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            img_obj = PropertyImage.objects.create(
                property=property_obj,
                image=processed_file,
                image_hash=file_hash,
                display_order=existing_count + len(created),
            )
            created.append(img_obj.id)

        total = property_obj.images.count()
        return Response({
            'created_ids': created,
            'total_images': total,
            'meets_minimum': total >= MIN_IMAGES,
        }, status=status.HTTP_201_CREATED)


class PropertyImageDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsLandlordOwner]

    def delete(self, request, id, image_id):
        property_obj = get_object_or_404(Property, id=id)
        self.check_object_permissions(request, property_obj)
        image = get_object_or_404(PropertyImage, id=image_id, property=property_obj)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
