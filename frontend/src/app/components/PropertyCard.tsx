import { Link } from "react-router";
import { useCurrencyContext } from "../context/CurrencyContext";
import { useSavedProperties } from "../hooks/useSavedProperties";
import { Icons } from "./Icon";
import type { Property } from "../../lib/api";
import { getImageUrl, PLACEHOLDER_IMAGE } from "../../lib/api";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { format } = useCurrencyContext();
  const { isSaved, toggleSave } = useSavedProperties();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imgError, setImgError] = useState(false);

  const saved = isSaved(property.id);
  const imageUrl = imgError ? PLACEHOLDER_IMAGE : getImageUrl(property.image_url);

  const getNoiseColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'quiet': return 'var(--color-secondary)';
      case 'moderate': return 'var(--color-accent)';
      case 'lively': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    await toggleSave(property.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Link
      to={`/property/${property.id}`}
      className="group block rounded-xl overflow-hidden shadow-sm transition-all duration-200"
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border-light)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />

        {property.listing_status === 'verified' ? (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
            <Icons.ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-xs font-medium text-gray-700">Verified</span>
          </div>
        ) : property.listing_status === 'pending' ? (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
            <Icons.Clock size={12} className="text-amber-500" />
            <span className="text-xs font-medium text-gray-700">Pending review</span>
          </div>
        ) : null}

        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
        >
          <Icons.Heart
            size={16}
            className={`transition-all ${saved ? 'fill-red-500 text-red-500' : 'text-gray-500'} ${isAnimating ? 'heart-saved' : ''}`}
          />
        </button>

        <div className="absolute bottom-3 right-3 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
          {format(property.price_per_month)}<span className="text-xs opacity-80">/mo</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold transition-colors line-clamp-1" style={{ color: 'var(--text-primary)' }}>
          {property.title}
        </h3>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{property.area}</p>

        <div className="flex items-center gap-3 mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Icons.Bed size={14} />
          <span>{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} beds`}</span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-light)' }} />
          <Icons.Bath size={14} />
          <span>{property.bathrooms} baths</span>
          {property.size_sqft && (
            <>
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-light)' }} />
              <Icons.Maximize size={14} />
              <span>{property.size_sqft} sqft</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-1">
            <Icons.ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{property.safety_score}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Volume2 size={12} style={{ color: getNoiseColor(property.noise_level) }} />
            <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{property.noise_level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Navigation size={12} style={{ color: 'var(--color-primary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{property.commute_rating}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heartBeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .heart-saved {
          animation: heartBeat 0.3s ease;
        }
      `}</style>
    </Link>
  );
}
