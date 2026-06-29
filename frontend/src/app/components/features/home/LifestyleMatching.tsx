import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getImageUrl, PLACEHOLDER_IMAGE } from "../../../../lib/api";

interface LifestyleCategory {
  id: string;
  title: string;
  slug: string;
  headline: string;
  description: string;
  accentColor: string;
  image_url: string | null;
  sceneLabel: string;
  sceneDetail: string;
  matchCount: number;
  active: boolean;
  sort_order: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export function LifestyleMatching() {
  const [categories, setCategories] = useState<LifestyleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_URL}/lifestyle-categories`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.filter((c: LifestyleCategory) => c.active).sort((a: LifestyleCategory, b: LifestyleCategory) => a.sort_order - b.sort_order));
        } else {
          setCategories([
            {
              id: "1",
              title: "Quiet living",
              slug: "quiet",
              headline: "Spaces designed for calmer living",
              description: "Low traffic, green surroundings, and peaceful streets. Perfect for focus, rest, and slower routines.",
              accentColor: "var(--color-secondary)",
              image_url: null,
              sceneLabel: "Karen, Nairobi",
              sceneDetail: "Morning light on a quiet Karen street",
              matchCount: 1243,
              active: true,
              sort_order: 1
            },
            {
              id: "2",
              title: "Social areas",
              slug: "social",
              headline: "Where life happens",
              description: "Cafés, parks, restaurants, and energy. Walkable neighbourhoods where you're never far from something happening.",
              accentColor: "#F59E0B",
              image_url: null,
              sceneLabel: "Westlands, Nairobi",
              sceneDetail: "Westlands buzz — cafés, co-working, nightlife",
              matchCount: 2341,
              active: true,
              sort_order: 2
            },
            {
              id: "3",
              title: "Work-friendly",
              slug: "work",
              headline: "Homes built for focus and flexibility",
              description: "Fast internet, quiet interiors, dedicated workspace potential. Designed for remote work and deep focus.",
              accentColor: "var(--color-primary)",
              image_url: null,
              sceneLabel: "Lavington, Nairobi",
              sceneDetail: "Remote work setup with city views",
              matchCount: 1892,
              active: true,
              sort_order: 3
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch lifestyle categories:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: "5rem 0", background: "var(--bg-body)" }}>
        <div className="container-custom">
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "5rem 0", background: "var(--bg-body)" }}>
      <div className="container-custom">
        
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 3rem" }}>
          <span style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-secondary)",
            display: "inline-block",
            marginBottom: 12,
          }}>
            Live your way
          </span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 400,
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            A home that feels like yours.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 12 }}>
            Three ways to live. One platform to find your match.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {categories.map((cat) => {
            const imageUrl = getImageUrl(cat.image_url);
            return (
              <Link
                key={cat.id}
                to={`/browse?lifestyle=${encodeURIComponent(cat.title)}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  background: "var(--bg-card)",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "0.5px solid var(--border-light)",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  <div style={{
                    position: "relative",
                    height: 280,
                    overflow: "hidden",
                  }}>
                    <img
                      src={imageUrl}
                      alt={cat.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      background: "rgba(0,0,0,0.65)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 20,
                      padding: "4px 12px",
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "#fff" }}>{cat.sceneLabel}</span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginLeft: 6 }}>{cat.sceneDetail}</span>
                    </div>
                    <div style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "rgba(0,0,0,0.65)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 20,
                      padding: "4px 10px",
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: cat.accentColor }}>
                        {cat.matchCount.toLocaleString()} matched
                      </span>
                    </div>
                  </div>

                  <div style={{
                    padding: "32px 28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}>
                      <div style={{
                        width: 32,
                        height: 3,
                        background: cat.accentColor,
                        borderRadius: 2,
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: cat.accentColor, textTransform: "uppercase" }}>
                        {cat.title}
                      </span>
                    </div>
                    
                    <h3 style={{
                      fontSize: "clamp(20px, 2.5vw, 26px)",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: "0 0 12px 0",
                      lineHeight: 1.3,
                    }}>
                      {cat.headline}
                    </h3>
                    
                    <p style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--text-secondary)",
                      margin: "0 0 24px 0",
                    }}>
                      {cat.description}
                    </p>

                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      color: cat.accentColor,
                      fontSize: 13,
                      fontWeight: 500,
                    }}>
                      Explore homes in {cat.title.toLowerCase()} areas
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            to="/quiz"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--color-primary)",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 40,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            Not sure? Take our 2-minute quiz
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container-custom > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
