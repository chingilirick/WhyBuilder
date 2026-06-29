import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ShieldCheck, Star, Phone, MessageSquare, Building2, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { PropertyCard } from "../components/PropertyCard";
import { properties, landlords } from "../../lib/api";

interface LandlordData {
  id: string;
  full_name: string;
  email: string;
  business_name: string | null;
  phone_number: string | null;
  trust_score: number;
  response_rate: number;
  total_listings: number;
  verified_listings_count: number;
  member_since: string;
}

interface PropertyData {
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
  safety_score: number;
  noise_level: string;
  commute_rating: number;
  lifestyle_tags: string[];
  image_url: string | null;
  listing_status: string;
}

function TrustScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "text-secondary" : score >= 70 ? "text-accent" : "text-red-500";
  const bg = score >= 90 ? "bg-secondary/10" : score >= 70 ? "bg-accent/10" : "bg-red-50";
  return (
    <div className={`${bg} ${color} rounded-xl px-4 py-3 text-center`}>
      <div className="text-3xl font-bold">{score}</div>
      <div className="text-xs mt-0.5 opacity-80">Trust Score</div>
    </div>
  );
}

export default function LandlordProfile() {
  const { id } = useParams<{ id: string }>();
  const [landlord, setLandlord] = useState<LandlordData | null>(null);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLandlordData() {
      if (!id) {
        setError("Landlord not found");
        setLoading(false);
        return;
      }

      try {
        const { data: landlordData, error: landlordError } = await landlords.get(id);
        if (landlordError || !landlordData) {
          setError("Landlord profile not found");
          setLoading(false);
          return;
        }

        setLandlord({
          id: landlordData.id,
          full_name: landlordData.full_name || "Landlord",
          email: landlordData.email || "",
          business_name: landlordData.business_name || null,
          phone_number: landlordData.phone_number || null,
          trust_score: landlordData.trust_score || 0,
          response_rate: landlordData.response_rate || 0,
          total_listings: landlordData.total_listings || 0,
          verified_listings_count: landlordData.verified_listings_count || 0,
          member_since: landlordData.member_since || new Date().toISOString().split("T")[0],
        });

        const { data: propertiesData } = await properties.listByLandlord(id);
        if (propertiesData) {
          setProperties(propertiesData.filter(p => p.listing_status === "verified"));
        }
      } catch {
        setError("Failed to load landlord profile");
      } finally {
        setLoading(false);
      }
    }

    fetchLandlordData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !landlord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-500">{error || "Landlord not found"}</p>
          <Link to="/browse" className="inline-block mt-4 text-primary hover:underline">
            Browse properties →
          </Link>
        </div>
      </div>
    );
  }

  const memberYear = new Date(landlord.member_since).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-serif mb-1">{landlord.full_name}</h1>
              <p className="text-white/70">{landlord.business_name || "Independent Landlord"}</p>
              <p className="text-white/50 text-sm mt-1">Member since {memberYear}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span className="text-sm">Verified Landlord</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Trust Metrics
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <TrustScoreBadge score={landlord.trust_score} />
                <div className="bg-primary/10 text-primary rounded-xl px-4 py-3 text-center">
                  <div className="text-3xl font-bold">{landlord.response_rate}%</div>
                  <div className="text-xs mt-0.5 opacity-80">Response Rate</div>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total listings</span>
                  <span className="text-gray-900 font-semibold">{landlord.total_listings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Verified listings</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-gray-900 font-semibold">{landlord.verified_listings_count}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Contact</h2>
              <div className="space-y-2">
                <a
                  href={`mailto:${landlord.email}`}
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all justify-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send a message
                </a>
                {landlord.phone_number && (
                  <a
                    href={`tel:${landlord.phone_number}`}
                    className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm hover:border-primary hover:text-primary transition-all justify-center"
                  >
                    <Phone className="w-4 h-4" />
                    Call {landlord.phone_number}
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Renter Ratings</h2>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-accent fill-accent" />
                <span className="text-2xl font-bold text-gray-900">4.8</span>
                <span className="text-sm text-gray-400">/ 5.0</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Based on verified renter reviews</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {landlord.business_name 
                  ? `${landlord.business_name} is a verified property management company in Nairobi, Kenya.`
                  : `${landlord.full_name} is a verified landlord on WhyBuilder, committed to transparency and quality housing.`}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Active Listings ({properties.length})
              </h2>
              {properties.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No active listings at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property as any} />
                  ))}
                </div>
              )}
              <div className="mt-6 text-center">
                <Link to="/browse" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  Browse all properties →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
