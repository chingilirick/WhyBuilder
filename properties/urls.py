from django.urls import path
from . import views
from .location_views import LocationCaptureView, PropertyLocationUpdateView, AddressGeocodeView

urlpatterns = [
    path('geocode/', AddressGeocodeView.as_view(), name='address-geocode'),
    path('location/capture/', LocationCaptureView.as_view(), name='location-capture'),
    path('create/', views.PropertyCreateView.as_view(), name='property-create'),
    path('pending/', views.PendingListingsView.as_view(), name='property-pending'),
    path('<str:id>/verify/', views.PropertyVerifyView.as_view(), name='property-verify'),
    path('', views.PropertyListView.as_view(), name='property-list'),
    path('<str:id>/', views.PropertyDetailView.as_view(), name='property-detail'),
    path('<str:id>/update/', views.PropertyUpdateView.as_view(), name='property-update'),
    path('<str:id>/images/', views.PropertyImageUploadView.as_view(), name='property-images-upload'),
    path('<str:id>/images/<int:image_id>/', views.PropertyImageDeleteView.as_view(), name='property-image-delete'),
    path('<str:property_id>/location/', PropertyLocationUpdateView.as_view(), name='property-location-update'),
    path('<str:id>/delete/', views.PropertyDeleteView.as_view(), name='property-delete'),
]
