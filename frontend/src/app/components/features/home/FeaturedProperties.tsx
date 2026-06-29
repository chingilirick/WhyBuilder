import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ShieldCheck, Volume2, Navigation } from "lucide-react";
import { properties, type Property } from "../../../../lib/api";

function getNoiseStyle(level: string): { color: string; bg: string } {
  switch (level.toLowerCase()) {
    case "quiet":    return { color: "#065F46", bg: "#ECFDF5" };
    case "moderate": return { color: "#92400E", bg: "#FFFBEB" };
    default:         return { color: "#1E40AF", bg: "#EFF6FF" };
  }
}

export default function FeaturedProperties() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    properties.list({ limit: 3 }).then(({ data }) => {
      setFeatured(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-gray-100 h-[360px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-secondary">Featured properties</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-gray-900 tracking-tight">
              Verified homes. Clear data.
            </h2>
          </div>
          <Link to="/browse" className="text-sm font-medium text-primary border-b border-primary pb-0.5">
            View all properties →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((property) => {
            const noise = getNoiseStyle(property.noise_level);
            const imageUrl = property.image_url || "/images/placeholders/property-placeholder.svg";

            return (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="block bg-white rounded-xl overflow-hidden border border-black/10 transition-shadow hover:shadow-lg hover:-translate-y-1 duration-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                    <ShieldCheck size={11} className="text-secondary" />
                    <span className="text-[11px] font-semibold text-gray-700">Verified</span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-primary rounded-lg px-2.5 py-1">
                    <span className="text-sm font-bold text-white">KES {property.price_per_month.toLocaleString()}</span>
                    <span className="text-[11px] text-white/70">/mo</span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{property.area}</p>
                  <h3 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-1">{property.title}</h3>

                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <span>{property.bedrooms} beds</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{property.bathrooms} baths</span>
                    {property.size_sqft && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{property.size_sqft} sqft</span>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-3">
                    <div className="bg-gray-50 rounded-lg px-2 py-1.5 text-center border border-black/5">
                      <ShieldCheck size={13} className="text-secondary mx-auto mb-0.5" />
                      <span className="text-sm font-bold text-gray-900 block">{property.safety_score}</span>
                      <span className="text-[10px] text-gray-400">Safety</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-2 py-1.5 text-center border border-black/5">
                      <Volume2 size={13} className={`mx-auto mb-0.5`} style={{ color: noise.color }} />
                      <span className="text-[11px] font-semibold capitalize" style={{ color: noise.color }}>
                        {property.noise_level}
                      </span>
                      <span className="text-[10px] text-gray-400 block">Noise</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-2 py-1.5 text-center border border-black/5">
                      <Navigation size={13} className="text-primary mx-auto mb-0.5" />
                      <span className="text-sm font-bold text-gray-900 block">{property.commute_rating}</span>
                      <span className="text-[10px] text-gray-400">Commute</span>
                    </div>
                  </div>

                  {property.lifestyle_tags && property.lifestyle_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {property.lifestyle_tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center gap-8 mt-8">
          {["Safety verified", "Area checked", "Landlord rated"].map((text) => (
            <span key={text} className="text-[11px] text-gray-400 font-medium">
              ✓ {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
