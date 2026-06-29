import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getImageUrl, PLACEHOLDER_IMAGE, properties as apiProperties } from "../../lib/api";
import { useCurrencyContext } from "../context/CurrencyContext";
import { useSavedProperties } from "../hooks/useSavedProperties";
import { ContactModal } from "../components/ContactModal";
import { PropertyMap } from "../components/PropertyMap";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import {
  Bed, Bath, Maximize, ShieldCheck, Volume2, Zap, MapPin, Home,
  Heart, Phone, Mail, Star, Trees, Car, Users, Building2, CalendarDays, BadgeCheck, VolumeX, Volume, Volume1,
} from "lucide-react";

interface PropertyImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface LandlordProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  trust_score?: number;
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
  landlord_id: string;
  users?: LandlordProfile;
  property_images?: PropertyImage[];
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
  const navigate = useNavigate();
  const { format } = useCurrencyContext();
  const { isSaved, toggleSave } = useSavedProperties();
  const [property, setProperty] = useState<PropertyDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [saving, setSaving] = useState(false);

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
      if (typedData.property_images && typedData.property_images.length > 0) {
        const sorted = [...typedData.property_images].sort((a, b) => a.display_order - b.display_order);
        setSelectedImage(sorted[0].image_url);
      }
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
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" message="Loading property details..." />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {showContactModal && property.users && (
        <ContactModal
          landlord={{
            id: property.users.id,
            full_name: property.users.full_name || "Landlord",
            phone_number: property.users.phone_number,
            email: property.users.email,
          }}
          propertyTitle={property.title}
          onClose={() => setShowContactModal(false)}
        />
      )}

      <div className="relative h-[500px] md:h-[600px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        <img
          src={getImageUrl(selectedImage)}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
        />

        {property.property_images && property.property_images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3 bg-black/50 backdrop-blur-md p-2 rounded-2xl overflow-x-auto max-w-[90vw]">
            {property.property_images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.image_url)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                  selectedImage === img.image_url ? "border-primary shadow-lg" : "border-white/30 hover:border-white/60"
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.area}, {property.city}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl px-6 py-4 text-center shadow-lg">
              <div className="text-3xl font-bold">{format(property.price_per_month)}</div>
              <div className="text-sm text-white/70">per month</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Bed, label: "Bedrooms", value: property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Bed${property.bedrooms !== 1 ? "s" : ""}` },
              { icon: Bath, label: "Bathrooms", value: `${property.bathrooms} Bath${property.bathrooms !== 1 ? "s" : ""}` },
              { icon: Maximize, label: "Size", value: property.size_sqft ? `${property.size_sqft.toLocaleString()} sqft` : "N/A" },
              { icon: Building2, label: "Property Type", value: property.property_type },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                <Icon className="w-6 h-6 mx-auto mb-2 text-primary" strokeWidth={1.5} />
                <div className="font-semibold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" strokeWidth={1.5} />
              Decision Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 p-5 border border-secondary/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-full blur-2xl" />
                <ShieldCheck className="w-8 h-8 text-secondary mb-3" strokeWidth={1.5} />
                <div className="text-4xl font-bold text-secondary mb-1">{property.safety_score}</div>
                <div className="text-sm text-gray-600">Safety Score</div>
                <div className="text-xs text-gray-400 mt-2">out of 100 · Area crime data verified</div>
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
                <div className="text-sm text-gray-600">Commute Rating</div>
                <div className="text-xs text-gray-400 mt-2">Access to matatu routes & highways</div>
              </div>
            </div>
          </div>

          {property.lifestyle_tags && property.lifestyle_tags.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                Lifestyle Match
              </h2>
              <div className="flex flex-wrap gap-2">
                {property.lifestyle_tags.map((tag, idx) => {
                  const tagIcon = tag.includes("Quiet") ? Trees : tag.includes("Social") ? Users : tag.includes("Work") ? Zap : Home;
                  return (
                    <span key={idx} className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
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

          {property.area_insight && (
            <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Trees className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Area Insight
              </h2>
              <p className="text-gray-700 leading-relaxed">{property.area_insight}</p>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{property.description || "No description provided."}</p>
          </div>

          {property.address && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Location
              </h2>
              <PropertyMap address={property.address} area={property.area} city={property.city} />
            </div>
          )}

          {property.users && (
            <div className="border-t border-gray-100 pt-8 mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
                Listed By
              </h2>
              <div className="flex items-center justify-between flex-wrap gap-4 p-5 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-xl">
                      {property.users.full_name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{property.users.full_name || "Landlord"}</div>
                    {property.users.trust_score && (
                      <div className="flex items-center gap-1 text-sm text-secondary mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                        Trust Score: {property.users.trust_score}%
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <CalendarDays className="w-3 h-3" />
                      Member since {formattedDate}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {property.users.email && (
                    <a
                      href={`mailto:${property.users.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm hover:border-primary hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowContactModal(true)}
              className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
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
                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5"
              }`}
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
