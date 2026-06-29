from django.urls import path
from . import views
from .location_views import LocationCaptureView, PropertyLocationUpdateView, AddressGeocodeView

urlpatterns = [
    path('hero-slides/', views.HeroSlidesView.as_view(), name='hero-slides'),
    path('neighbourhoods/', views.NeighbourhoodsView.as_view(), name='neighbourhoods'),
    path('trust-pillars/', views.TrustPillarsView.as_view(), name='trust-pillars'),
    path('lifestyle-categories/', views.LifestyleCategoriesView.as_view(), name='lifestyle-categories'),
    path('geocode/', AddressGeocodeView.as_view(), name='address-geocode'),
    path('location/capture/', LocationCaptureView.as_view(), name='location-capture'),
    path('neighbourhood/<str:area>/', views.NeighbourhoodView.as_view(), name='neighbourhood'),
    path('create/', views.PropertyCreateView.as_view(), name='property-create'),
    path('', views.PropertyListView.as_view(), name='property-list'),
    path('<str:id>/', views.PropertyDetailView.as_view(), name='property-detail'),
    path('<str:id>/update/', views.PropertyUpdateView.as_view(), name='property-update'),
    path('<str:property_id>/location/', PropertyLocationUpdateView.as_view(), name='property-location-update'),
    path('<str:id>/delete/', views.PropertyDeleteView.as_view(), name='property-delete'),
]
