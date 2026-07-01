import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getImageUrl, PLACEHOLDER_IMAGE, properties as apiProperties } from "../../lib/api";
import { useCurrencyContext } from "../context/CurrencyContext";
import { useSavedProperties } from "../hooks/useSavedProperties";
import { ContactModal } from "../components/ContactModal";
import { PropertyMap } from "../components/PropertyMap";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import {
  Bed, Bath, Maximize, ShieldCheck, Volume2, Zap, MapPin, Home,
  Heart, Phone, Mail, Star, Trees, Car, Users, Building2,
  CalendarDays, BadgeCheck, VolumeX, Volume, Volume1,
  ParkingCircle, Lock, Dumbbell, Waves, Wind, Dog,
  X, ChevronLeft, ChevronRight,
} from "lucide-react";

interface PropertyImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface PropertyDetailData {
  id: string;
  title: string;
  description: string;
  address: string;
  area: string;
  city: string;
  price_per_month: number;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number | null;
  property_type: string;
  listing_status: string;
  safety_score: number;
  noise_level: string;
  commute_rating: number;
  lifestyle_tags: string[];
  area_insight: string;
  created_at: string;
  verified_at: string | null;
  // Flat landlord fields from Django serializer
  landlord_name?: string | null;
  landlord_email?: string | null;
  // Amenities from Django serializer
  has_parking?: boolean;
  has_security?: boolean;
  has_gym?: boolean;
  has_pool?: boolean;
  has_ac?: boolean;
  pet_friendly?: boolean;
  // Images
  images?: PropertyImage[];
}

const getNoiseIcon = (level: string) => {
  switch (level.toLowerCase()) {
    case "quiet": return VolumeX;
    case "moderate": return Volume1;
    case "lively": return Volume;
    default: return Volume1;
  }
};

const getNoiseColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "quiet": return "from-green-50 to-emerald-50 border-green-100 text-green-700";
    case "moderate": return "from-amber-50 to-yellow-50 border-amber-100 text-amber-700";
    case "lively": return "from-orange-50 to-red-50 border-orange-100 text-orange-700";
    default: return "from-gray-50 to-gray-100 border-gray-100 text-gray-700";
  }
};

const getNoiseBgIcon = (level: string) => {
  switch (level.toLowerCase()) {
    case "quiet": return "bg-green-100";
    case "moderate": return "bg-amber-100";
    case "lively": return "bg-orange-100";
    default: return "bg-gray-100";
  }
};

export default function PropertyDetail() {
  const { id } = useParams();
  const { format } = useCurrencyContext();
  const { isSaved, toggleSave } = useSavedProperties();
  const [property, setProperty] = useState<PropertyDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const galleryImages = property?.images
    ? [...property.images].sort((a, b) => a.display_order - b.display_order)
    : [];
  const activeImageUrl = galleryImages[activeIndex]?.image_url ?? (property as any)?.image_url ?? null;

  function openLightbox(index: number) {
    setActiveIndex(index);
    setLightboxOpen(true);
  }
  function closeLightbox() {
    setLightboxOpen(false);
  }
  function showPrev() {
    setActiveIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  }
  function showNext() {
    setActiveIndex((i) => (i + 1) % galleryImages.length);
  }

  useEffect(() => {
    async function fetchProperty() {
      if (!id) {
        setError("No property ID provided");
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await apiProperties.get(id);
      if (fetchError || !data) {
        setError(fetchError || "Property not found");
        setLoading(false);
        return;
      }
      const typedData = data as PropertyDetailData;
      setProperty(typedData);
      setActiveIndex(0);
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  const handleSave = async () => {
    if (!property) return;
    setSaving(true);
    await toggleSave(property.id);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-body)" }}>
        <LoadingSpinner size="lg" message="Loading property details..." />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-body)" }}>
        <ErrorMessage message={error || "Property not found"} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const NoiseIcon = getNoiseIcon(property.noise_level);
  const saved = isSaved(property.id);
  const formattedDate = new Date(property.created_at).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
  });

  const hasLandlordInfo = !!(property.landlord_name || property.landlord_email);

  // Amenities list — only show ones that are true
  const amenities = [
    { key: "has_parking", label: "Parking", icon: ParkingCircle, value: property.has_parking },
    { key: "has_security", label: "24/7 Security", icon: Lock, value: property.has_security },
    { key: "has_gym", label: "Gym", icon: Dumbbell, value: property.has_gym },
    { key: "has_pool", label: "Swimming Pool", icon: Waves, value: property.has_pool },
    { key: "has_ac", label: "Air Conditioning", icon: Wind, value: property.has_ac },
    { key: "pet_friendly", label: "Pet Friendly", icon: Dog, value: property.pet_friendly },
  ].filter((a) => a.value);

  return (
    <div className="min-h-screen pb-16" style={{ background: "var(--bg-body)" }}>

      {/* Contact Modal — uses flat landlord fields */}
      {showContactModal && hasLandlordInfo && (
        <ContactModal
          landlord={{
            id: property.id,
            full_name: property.landlord_name || "Landlord",
            phone_number: undefined,
            email: property.landlord_email || "",
          }}
          propertyTitle={property.title}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Hero image + gallery */}
      <div className="relative h-[500px] md:h-[600px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        <button
          type="button"
          onClick={() => galleryImages.length > 0 && openLightbox(activeIndex)}
          className="w-full h-full cursor-zoom-in"
          aria-label="Open photo gallery"
        >
          <img
            src={getImageUrl(activeImageUrl)}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />
        </button>

        {galleryImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3 bg-black/50 backdrop-blur-md p-2 rounded-2xl overflow-x-auto max-w-[90vw]">
            {galleryImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                  activeIndex === idx ? "border-white shadow-lg" : "border-white/30 hover:border-white/60"
                }`}
              >
                <img
                  src={getImageUrl(img.image_url)}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                />
              </button>
            ))}
          </div>
        )}

        {property.listing_status === "verified" && (
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full">
            <BadgeCheck className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">Verified by WhyBuilder</span>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close gallery"
            className="absolute top-6 right-6 text-white/80 hover:text-white z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {galleryImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              aria-label="Previous photo"
              className="absolute left-4 md:left-8 text-white/70 hover:text-white z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          <img
            src={getImageUrl(galleryImages[activeIndex]?.image_url ?? activeImageUrl)}
            alt={`${property.title} photo ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />

          {galleryImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              aria-label="Next photo"
              className="absolute right-4 md:right-8 text-white/70 hover:text-white z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          {galleryImages.length > 1 && (
            <div className="absolute bottom-6 text-white/60 text-sm">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10" style={{ background: "var(--bg-card)" }}>

          {/* Title + Price */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                {property.title}
              </h1>
              <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.area}, {property.city}</span>
              </div>
            </div>
            {/* Price box — fixed: uses CSS vars directly, no Tailwind gradient */}
            <div
              className="rounded-2xl px-6 py-4 text-center shadow-lg flex-shrink-0"
              style={{ background: "var(--color-primary)" }}
            >
              <div className="text-3xl font-bold text-white">{format(property.price_per_month)}</div>
              <div className="text-sm text-white/70">per month</div>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Bed, label: "Bedrooms", value: property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Bed${property.bedrooms !== 1 ? "s" : ""}` },
              { icon: Bath, label: "Bathrooms", value: `${property.bathrooms} Bath${property.bathrooms !== 1 ? "s" : ""}` },
              { icon: Maximize, label: "Size", value: property.size_sqft ? `${property.size_sqft.toLocaleString()} sqft` : "N/A" },
              { icon: Building2, label: "Property Type", value: property.property_type },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl p-4 text-center transition-colors" style={{ background: "var(--bg-sidebar)" }}>
                <Icon className="w-6 h-6 mx-auto mb-2 text-primary" strokeWidth={1.5} />
                <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{value}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Decision Data */}
          <div className="mb-10">
            <h2 className="text-2xl font-serif font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <ShieldCheck className="w-6 h-6 text-primary" strokeWidth={1.5} />
              Decision Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 p-5 border border-secondary/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-full blur-2xl" />
                <ShieldCheck className="w-8 h-8 text-secondary mb-3" strokeWidth={1.5} />
                <div className="text-4xl font-bold text-secondary mb-1">{property.safety_score}</div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Safety Score</div>
                <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>out of 100 · Area crime data verified</div>
              </div>

              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 border ${getNoiseColor(property.noise_level)}`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-current/10 rounded-full blur-2xl" />
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${getNoiseBgIcon(property.noise_level)}`}>
                  <NoiseIcon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-2xl font-bold capitalize">{property.noise_level}</div>
                <div className="text-sm text-current/70">Noise Level</div>
                <div className="text-xs text-current/50 mt-2">Daily area assessment</div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-5 border border-primary/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
                <Zap className="w-8 h-8 text-primary mb-3" strokeWidth={1.5} />
                <div className="text-4xl font-bold text-primary mb-1">{property.commute_rating}</div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Commute Rating</div>
                <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Access to matatu routes & highways</div>
              </div>
            </div>
          </div>

          {/* Amenities — only rendered if any are true */}
          {amenities.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Amenities
              </h2>
              <div className="flex flex-wrap gap-3">
                {amenities.map(({ key, label, icon: Icon }) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
                    style={{
                      background: "var(--bg-sidebar)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <Icon className="w-4 h-4 text-secondary" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle Tags */}
          {property.lifestyle_tags && property.lifestyle_tags.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-serif font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Heart className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                Lifestyle Match
              </h2>
              <div className="flex flex-wrap gap-2">
                {property.lifestyle_tags.map((tag, idx) => {
                  const tagIcon = tag.includes("Quiet") ? Trees : tag.includes("Social") ? Users : tag.includes("Work") ? Zap : Home;
                  return (
                    <span key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                      style={{ background: "var(--bg-sidebar)", color: "var(--text-primary)" }}>
                      {tagIcon === Trees && <Trees className="w-3.5 h-3.5 text-green-600" />}
                      {tagIcon === Users && <Users className="w-3.5 h-3.5 text-amber-600" />}
                      {tagIcon === Zap && <Zap className="w-3.5 h-3.5 text-blue-600" />}
                      {tagIcon === Home && <Home className="w-3.5 h-3.5 text-primary" />}
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Area Insight */}
          {property.area_insight && (
            <div className="mb-10 p-6 rounded-2xl border border-primary/20" style={{ background: "var(--bg-sidebar)" }}>
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Trees className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Area Insight
              </h2>
              <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{property.area_insight}</p>
            </div>
          )}

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Description</h2>
            <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {property.description || "No description provided."}
            </p>
          </div>

          {/* Map */}
          {property.address && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Car className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Location
              </h2>
              <PropertyMap address={property.address} area={property.area} city={property.city} />
            </div>
          )}

          {/* Listed By — fixed: uses landlord_name / landlord_email from serializer */}
          {hasLandlordInfo && (
            <div className="border-t pt-8 mb-10" style={{ borderColor: "var(--border-light)" }}>
              <h2 className="text-xl font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Listed By
              </h2>
              <div className="flex items-center justify-between flex-wrap gap-4 p-5 rounded-2xl" style={{ background: "var(--bg-sidebar)" }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <span className="text-white font-semibold text-xl">
                      {(property.landlord_name || "L").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                      {property.landlord_name || "Landlord"}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-secondary mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                      Verified Landlord
                    </div>
                    <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      <CalendarDays className="w-3 h-3" />
                      Listed {formattedDate}
                    </div>
                  </div>
                </div>
                {property.landlord_email && (
                    <a
                    href={`mailto:${property.landlord_email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors border"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border-medium)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="border-t pt-8 flex flex-col sm:flex-row gap-4" style={{ borderColor: "var(--border-light)" }}>
            <button
              onClick={() => setShowContactModal(true)}
              className="flex items-center justify-center gap-2 flex-1 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all duration-200"
              style={{ background: "var(--color-primary)" }}
            >
              <Phone className="w-5 h-5" />
              Contact Landlord
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl font-semibold transition-all duration-200 border-2 ${
                saved
                  ? "border-red-500 text-red-500 bg-red-50 hover:bg-red-100"
                  : "hover:bg-primary/5"
              }`}
              style={!saved ? { borderColor: "var(--border-medium)", color: "var(--text-secondary)" } : {}}
            >
              <Heart className={`w-5 h-5 ${saved ? "fill-red-500 text-red-500" : ""}`} />
              {saving ? "Saving..." : (saved ? "Saved" : "Save Property")}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
