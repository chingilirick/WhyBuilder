import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ShieldCheck, Database, UserCheck, MapPin, TrendingUp, Users, Volume2, ChevronRight } from "lucide-react";
import { getImageUrl, PLACEHOLDER_IMAGE } from "../../../../lib/api";

interface Neighbourhood {
  id: string;
  name: string;
  slug: string;
  tag: string;
  safetyScore: number;
  noiseLevel: "Quiet" | "Moderate" | "Lively";
  listings: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

interface TrustPillar {
  id: string;
  icon: string;
  heading: string;
  description: string;
  active: boolean;
  sort_order: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const NOISE_STYLES: Record<string, { bg: string; color: string }> = {
  Quiet:    { bg: "#ECFDF5", color: "#065F46" },
  Moderate: { bg: "#FFFBEB", color: "#92400E" },
  Lively:   { bg: "#EFF6FF", color: "#1E40AF" },
};

const ICON_MAP: Record<string, React.ElementType> = {
  shield: ShieldCheck,
  database: Database,
  "user-check": UserCheck,
};

export function TrustLayer() {
  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [pillars, setPillars] = useState<TrustPillar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [neighbourhoodsRes, pillarsRes] = await Promise.all([
          fetch(`${API_URL}/neighbourhoods`),
          fetch(`${API_URL}/trust-pillars`)
        ]);
        
        if (neighbourhoodsRes.ok) {
          const data = await neighbourhoodsRes.json();
          setNeighbourhoods(data.filter((n: Neighbourhood) => n.active).sort((a: Neighbourhood, b: Neighbourhood) => a.sort_order - b.sort_order));
        } else {
          setNeighbourhoods([
            { id: "1", name: "Westlands", slug: "westlands", tag: "Urban professionals", safetyScore: 88, noiseLevel: "Lively", listings: 312, image_url: null, active: true, sort_order: 1 },
            { id: "2", name: "Karen", slug: "karen", tag: "Family living", safetyScore: 94, noiseLevel: "Quiet", listings: 186, image_url: null, active: true, sort_order: 2 },
            { id: "3", name: "Lavington", slug: "lavington", tag: "Remote-work ready", safetyScore: 91, noiseLevel: "Quiet", listings: 224, image_url: null, active: true, sort_order: 3 },
          ]);
        }
        
        if (pillarsRes.ok) {
          const data = await pillarsRes.json();
          setPillars(data.filter((p: TrustPillar) => p.active).sort((a: TrustPillar, b: TrustPillar) => a.sort_order - b.sort_order));
        } else {
          setPillars([
            { id: "1", icon: "shield", heading: "Every home. Seen firsthand.", description: "Properties appear on WhyBuilder only after passing our manual review. No exceptions.", active: true, sort_order: 1 },
            { id: "2", icon: "database", heading: "Safety. Noise. Commute. Measured.", description: "Structured data — not user-generated opinions. Every score is reviewed before a listing goes live.", active: true, sort_order: 2 },
            { id: "3", icon: "user-check", heading: "Landlord. ID. History. Verified.", description: "Every landlord carries a trust score built from verified listings and renter history.", active: true, sort_order: 3 },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch trust layer data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-20" style={{ background: "var(--bg-body)" }}>
        <div className="container-custom">
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" style={{ background: "var(--bg-body)" }}>
      <div className="container-custom">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-secondary)" }}>
              Nairobi neighbourhoods
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight" style={{ color: "var(--text-primary)" }}>
              Know the area before you decide.
            </h2>
          </div>
          <Link 
            to="/browse" 
            className="text-sm font-medium inline-flex items-center gap-1 transition-colors hover:gap-2"
            style={{ color: "var(--color-primary)" }}
          >
            Browse all areas <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {neighbourhoods.map((n) => {
            const noise = NOISE_STYLES[n.noiseLevel] ?? NOISE_STYLES.Moderate;
            const imageUrl = getImageUrl(n.image_url);
            
            return (
              <Link 
                key={n.id} 
                to={`/area/${n.slug}`} 
                className="group block rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                style={{ 
                  background: "var(--bg-card)", 
                  border: "0.5px solid var(--border-light)" 
                }}
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={n.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                    <MapPin size={12} className="text-white/80" />
                    <span className="text-white text-xs font-semibold tracking-wide">{n.name}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{n.tag}</p>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: noise.bg, color: noise.color }}>
                      {n.noiseLevel}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} style={{ color: "var(--color-primary)" }} />
                      <div>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Safety</p>
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{n.safetyScore} / 100</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} style={{ color: "var(--color-secondary)" }} />
                      <div>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Listings</p>
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{n.listings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-light)" }}>
          {pillars.map((pillar, index) => {
            const Icon = ICON_MAP[pillar.icon] || ShieldCheck;
            const colors = [
              { color: "var(--color-secondary)" },
              { color: "var(--color-primary)" },
              { color: "#8B5CF6" },
            ];
            
            return (
              <div 
                key={pillar.id} 
                className="p-6" 
                style={{ 
                  background: "var(--bg-card)",
                  borderLeft: index > 0 ? "0.5px solid var(--border-light)" : "none"
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={18} style={{ color: colors[index].color }} />
                  <div className="w-0.5 h-5 rounded-full" style={{ background: colors[index].color }} />
                </div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{pillar.heading}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
