import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Icons } from "../components/Icon";
import { properties, type Property } from "../../lib/api";
import { PropertyCard } from "../components/PropertyCard";
import { Seo } from "../components/Seo";

const AREAS = ["Westlands", "Kilimani", "Karen", "Lavington", "Ngong Road", "Upperhill"];
const NOISE_LEVELS = ["Quiet", "Moderate", "Lively"];
const LIFESTYLE_TAGS = ["Quiet living", "Social areas", "Work-friendly zones"];
const BUDGET_MIN = 20000;
const BUDGET_MAX = 300000;

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
        active
          ? "border-secondary bg-secondary/15 text-secondary scale-105"
          : "border-white/10 bg-white/5 text-white/60 hover:border-white/25"
      }`}
    >
      {label}
    </button>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-medium">
      {label}
      <button onClick={onRemove} className="text-secondary/70 hover:text-secondary">
        <Icons.X size={12} />
      </button>
    </span>
  );
}

function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString()}`;
}

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [area, setArea] = useState(searchParams.get("area") || "");
  const [noise, setNoise] = useState(searchParams.get("noise") || "");
  const [lifestyle, setLifestyle] = useState(searchParams.get("lifestyle") || "");
  const [minBudget, setMinBudget] = useState(() => {
    const val = searchParams.get("minBudget");
    return val ? Number(val) : BUDGET_MIN;
  });
  const [maxBudget, setMaxBudget] = useState(() => {
    const val = searchParams.get("maxBudget");
    return val ? Number(val) : BUDGET_MAX;
  });

  const activeCount = [area, noise, lifestyle, minBudget > BUDGET_MIN ? "min" : "", maxBudget < BUDGET_MAX ? "max" : ""].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  async function loadProperties() {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await properties.list({
      area: area || undefined,
      noise: noise || undefined,
      lifestyle: lifestyle || undefined,
      minBudget: minBudget > BUDGET_MIN ? minBudget : undefined,
      maxBudget: maxBudget < BUDGET_MAX ? maxBudget : undefined,
    });
    if (fetchError) setError(fetchError);
    else setAllProperties(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProperties();
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (noise) params.set("noise", noise);
    if (lifestyle) params.set("lifestyle", lifestyle);
    if (minBudget > BUDGET_MIN) params.set("minBudget", String(minBudget));
    if (maxBudget < BUDGET_MAX) params.set("maxBudget", String(maxBudget));
    setSearchParams(params, { replace: true });
  }, [area, noise, lifestyle, minBudget, maxBudget]);

  function clearFilters() {
    setArea(""); setNoise(""); setLifestyle("");
    setMinBudget(BUDGET_MIN);
    setMaxBudget(BUDGET_MAX);
  }

  return (
    <>
      <Seo
        title="Browse Verified Homes"
        description="Browse verified rental properties in Nairobi with transparent safety scores, noise levels, and landlord trust ratings."
      />
      <div className="min-h-screen bg-[var(--color-dark-bg)]">
        <div className="bg-gradient-to-b from-[var(--color-dark-surface)] to-[var(--color-dark-bg)] border-b border-white/10 pb-0">
          <div className="container-custom pt-10 pb-0">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Icons.ShieldCheck size={14} className="text-secondary" />
                <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
                  Verified listings
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/95 tracking-tight">
                Browse verified homes
              </h1>
              <p className="text-sm text-white/40 mt-1">
                {loading ? "Loading homes..." : `${allProperties.length} verified ${allProperties.length === 1 ? "home" : "homes"}`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap pb-5">
              <button
                onClick={() => setShowFilters(s => !s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  showFilters
                    ? "border-primary/60 bg-primary/30 text-blue-300"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <Icons.Sliders size={14} />
                Filters
                {activeCount > 0 && (
                  <span className="w-[18px] h-[18px] rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>

              {area && <ActiveChip label={area} onRemove={() => setArea("")} />}
              {noise && <ActiveChip label={noise} onRemove={() => setNoise("")} />}
              {lifestyle && <ActiveChip label={lifestyle} onRemove={() => setLifestyle("")} />}
              {minBudget > BUDGET_MIN && <ActiveChip label={`Min ${formatKES(minBudget)}`} onRemove={() => setMinBudget(BUDGET_MIN)} />}
              {maxBudget < BUDGET_MAX && <ActiveChip label={`Max ${formatKES(maxBudget)}`} onRemove={() => setMaxBudget(BUDGET_MAX)} />}

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-white/30 underline hover:text-white/50 bg-transparent border-none cursor-pointer p-0"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white/5 border-b border-white/10">
            <div className="container-custom py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-3">Area</p>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map(a => <Pill key={a} label={a} active={area === a} onClick={() => setArea(area === a ? "" : a)} />)}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-3">Noise level</p>
                  <div className="flex flex-wrap gap-2">
                    {NOISE_LEVELS.map(n => <Pill key={n} label={n} active={noise === n} onClick={() => setNoise(noise === n ? "" : n)} />)}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-3">Lifestyle</p>
                  <div className="flex flex-wrap gap-2">
                    {LIFESTYLE_TAGS.map(l => <Pill key={l} label={l} active={lifestyle === l} onClick={() => setLifestyle(lifestyle === l ? "" : l)} />)}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-3">Budget (KES/month)</p>
                  <div className="py-2">
                    <div className="flex justify-between text-xs text-white/50 mb-2">
                      <span>Min: {formatKES(minBudget)}</span>
                      <span>Max: {maxBudget >= BUDGET_MAX ? "No limit" : formatKES(maxBudget)}</span>
                    </div>
                    <div className="mb-4">
                      <label className="text-[11px] text-white/40 block mb-1.5">Minimum rent</label>
                      <input
                        type="range"
                        min={BUDGET_MIN}
                        max={BUDGET_MAX}
                        step={5000}
                        value={minBudget}
                        onChange={e => { const v = Number(e.target.value); if (v <= maxBudget) setMinBudget(v); }}
                        className="w-full accent-secondary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/40 block mb-1.5">Maximum rent</label>
                      <input
                        type="range"
                        min={BUDGET_MIN}
                        max={BUDGET_MAX}
                        step={5000}
                        value={maxBudget}
                        onChange={e => { const v = Number(e.target.value); if (v >= minBudget) setMaxBudget(v); }}
                        className="w-full accent-secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container-custom py-8 pb-20">
          {loading && (
            <div className="flex items-center justify-center py-20 gap-2.5 text-white/30">
              <Icons.Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading homes...</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button onClick={loadProperties} className="px-5 py-2 bg-primary text-white rounded-lg text-sm cursor-pointer hover:bg-primary/90">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && allProperties.length === 0 && (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Icons.Search size={22} className="text-white/20" />
              </div>
              <p className="text-lg font-medium text-white/50 mb-1.5">
                {hasFilters ? "No homes match these preferences." : "No verified listings yet."}
              </p>
              <p className="text-sm text-white/25 mb-6">
                {hasFilters ? "Try adjusting your filters." : "Check back soon — listings are reviewed daily."}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/15 transition-all"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && allProperties.length > 0 && (
            <>
              <p className="text-[11px] text-white/25 mb-5 tracking-wide">
                {allProperties.length} {allProperties.length === 1 ? "result" : "results"}
                {hasFilters ? " · filtered" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
