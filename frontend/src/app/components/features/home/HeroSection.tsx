import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ArrowRight, ShieldCheck, MapPin, Loader2 } from "lucide-react";

interface HeroSlide {
  id: number;
  image_url: string;
  area: string;
  label: string;
  sort_order: number;
  active: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const SLIDE_DURATION = 5000;

function WhyBuilderLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="white" fillOpacity="0.12" />
        <path d="M6 12 L11 26 L16 16 L21 26 L26 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M29 12 L29 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 12 Q36 12 36 16 Q36 19 29 19 Q36 19 36 23 Q36 26 29 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.02em", color: "white" }}>
        Why<span style={{ color: "var(--color-secondary)" }}>Builder</span>
      </span>
    </div>
  );
}

const TRUST_BADGES = [
  { stat: "1,500+", label: "homes verified" },
  { stat: "12", label: "areas mapped" },
  { stat: "100%", label: "landlord ID checked" },
];

export function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/hero-slides`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSlides(data);
      } else {
        setSlides([
          { id: 1, image_url: "/images/hero/karen-peaceful-01.jpg", area: "Karen, Nairobi", label: "Family living · Safe · Quiet", sort_order: 1, active: true },
          { id: 2, image_url: "/images/hero/westlands-vibrant-01.jpg", area: "Westlands, Nairobi", label: "Urban professionals · Connected · Lively", sort_order: 2, active: true },
          { id: 3, image_url: "/images/hero/lavington-elegant-01.jpg", area: "Lavington, Nairobi", label: "Remote work · Calm streets · Well-served", sort_order: 3, active: true },
        ]);
      }
    } catch {
      setSlides([
        { id: 1, image_url: "/images/hero/karen-peaceful-01.jpg", area: "Karen, Nairobi", label: "Family living · Safe · Quiet", sort_order: 1, active: true },
        { id: 2, image_url: "/images/hero/westlands-vibrant-01.jpg", area: "Westlands, Nairobi", label: "Urban professionals · Connected · Lively", sort_order: 2, active: true },
        { id: 3, image_url: "/images/hero/lavington-elegant-01.jpg", area: "Lavington, Nairobi", label: "Remote work · Calm streets · Well-served", sort_order: 3, active: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const goToSlide = useCallback((index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(index);
      setFade(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      goToSlide((current + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [current, goToSlide, slides.length]);

  if (loading) {
    return (
      <div className="h-screen min-h-[560px] bg-[var(--color-dark-bg)] flex items-center justify-center">
        <Loader2 size={32} className="text-secondary animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative w-full h-[85vh] min-h-[560px] max-h-[800px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: `url(${slide.image_url})`,
          backgroundPosition: "center 30%",
          opacity: fade ? 1 : 0,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,18,40,0.85)] via-[rgba(10,18,40,0.4)] to-[rgba(0,0,0,0.2)]" />
      <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-center">
        <div className="absolute top-8 left-8 transition-opacity duration-300" style={{ opacity: fade ? 1 : 0 }}>
          <WhyBuilderLogo />
        </div>
        <div
          className="max-w-[680px] transition-all duration-400"
          style={{
            opacity: fade ? 1 : 0,
            transform: fade ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3.5 py-1.5 mb-7">
            <MapPin size={12} className="text-secondary" />
            <span className="text-xs font-medium text-white/85">{slide.area}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-4">
            Your life. <span className="text-secondary">Your home.</span>
            <br />
            One answer.
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-[520px] mb-8">
            Tell us who you are. We'll show you where to live.
          </p>
          <div className="flex flex-wrap gap-3.5 mb-12">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-secondary text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-secondary/90 transition-all hover:-translate-y-0.5"
            >
              Find my match <ArrowRight size={16} />
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-white/20 transition-all"
            >
              See all homes
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 border-t border-white/20 pt-7">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                  <ShieldCheck size={12} className="text-secondary" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">{badge.stat}</span>
                  <span className="text-xs text-white/50 ml-1.5">{badge.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-7 right-8 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === current ? "w-7 bg-secondary" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
        <div className="absolute bottom-7 left-8 text-[11px] font-light text-white/40 tracking-wider">
          {slide.label}
        </div>
      </div>
    </section>
  );
}
