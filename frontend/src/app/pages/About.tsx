import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ShieldCheck, Volume2, Navigation, BadgeCheck, Building2,
  ArrowRight, Home, Sparkles, Users, Mail, MapPin, Clock,
  CheckCircle, XCircle, TrendingUp, Award, Eye, LayoutDashboard, Database, UserCheck, Crown
} from "lucide-react";

const STATS = {
  totalHomes: 1523,
  totalAreas: 12,
  landlordVerificationRate: 98,
};

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [target]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-body)" }}>
      
      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, var(--color-dark-bg) 0%, var(--color-primary) 100%)",
        padding: "80px 0 96px",
        position: "relative",
      }}>
        <div className="container-custom" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 40,
              padding: "6px 16px 6px 12px",
              marginBottom: 32,
            }}>
              <Building2 size={14} style={{ color: "var(--color-secondary)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Founded Nairobi, September 2024</span>
            </div>
            
            <h1 style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 700,
              color: "white",
              margin: "0 0 24px 0",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
            }}>
              Why is it still so hard
              <br />
              to know where to live?
            </h1>
            
            <p style={{
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              color: "rgba(255,255,255,0.7)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
            }}>
              That question bothered its founder for months.
              <br />
              So he stopped searching and started building.
            </p>
          </div>
        </div>
      </div>

      {/* The Story */}
      <div className="container-custom" style={{ padding: "64px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--text-primary)",
            lineHeight: 1.5,
            marginBottom: 24,
          }}>
            In late 2024, Chingili Ricky needed a place to live in Nairobi.
          </p>
          
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
            He opened every property site he could find. Westlands. Kilimani. Karen. Lavington.
            Each listing showed him photos, a price, and a phone number.
          </p>
          
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
            What none of them showed him: <strong>Is this area safe? Will I sleep well here? Is this landlord real?</strong>
            He called one listing. The photos were fake. He called another. The landlord never answered.
          </p>
          
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
            Three weeks of this. Dozens of calls. Zero confidence. He realized something.
          </p>
          
          <div style={{
            background: "rgba(16,185,129,0.08)",
            borderLeft: "3px solid var(--color-secondary)",
            padding: "24px 28px",
            borderRadius: 12,
            marginBottom: 32,
          }}>
            <p style={{
              fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
              fontStyle: "italic",
              color: "var(--color-secondary)",
              lineHeight: 1.6,
              margin: 0,
            }}>
              "Every platform was built for listing homes. None was built for deciding where to live.
              That's two different problems. I wanted the second one."
            </p>
          </div>
          
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
            So he applied a lesson from Amazon's earliest days: find the smallest valuable piece,
            build it well, and use it as the foundation for everything that follows.
          </p>
          
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
            That piece was housing data. Not opinions. Real numbers. Safety scores from area crime data.
            Noise ratings from location assessment. Commute times from matatu routes.
            A trust score for every landlord.
          </p>
          
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            In May 2026, WhyBuilder opened its doors. Not a listing site. A decision system.
            One question guided every line of code: <strong>Does this help someone choose with confidence?</strong>
          </p>
        </div>
      </div>

      {/* The Difference - Premium Comparison Cards */}
      <div style={{ background: "var(--bg-card)", padding: "64px 0" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-secondary)" }}>
              The difference
            </span>
            <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, color: "var(--text-primary)", margin: "12px 0 8px", letterSpacing: "-0.02em" }}>
              What you see changes how you choose.
            </h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

            {/* Traditional Platforms Card */}
            <div style={{
              background: "var(--bg-body)",
              borderRadius: 20,
              padding: "32px",
              border: "0.5px solid var(--border-light)",
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(239,68,68,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}>
                <LayoutDashboard size={24} style={{ color: "#EF4444" }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>Most platforms</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                You see price. Bedrooms. Bathrooms. Square feet. And photos.
                That's it. You still don't know if the area is safe.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                  <XCircle size={14} style={{ color: "#EF4444" }} /> Safety? Not shown
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                  <XCircle size={14} style={{ color: "#EF4444" }} /> Noise? Not shown
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                  <XCircle size={14} style={{ color: "#EF4444" }} /> Landlord? Unknown
                </div>
              </div>
            </div>

            {/* WhyBuilder Card */}
            <div style={{
              background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(16,185,129,0.03) 100%)",
              borderRadius: 20,
              padding: "32px",
              border: "1px solid rgba(16,185,129,0.2)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.08)",
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(16,185,129,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}>
                <CheckCircle size={24} style={{ color: "var(--color-secondary)" }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>WhyBuilder</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                Every property shows four trust metrics. Each one verified before the listing goes live.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-secondary)" }}>
                  <ShieldCheck size={14} /> Safety Score (0–100)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-secondary)" }}>
                  <Volume2 size={14} /> Noise Level (Quiet · Moderate · Lively)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-secondary)" }}>
                  <BadgeCheck size={14} /> Landlord Trust Score
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Data - Four Numbers */}
      <div className="container-custom" style={{ padding: "64px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-secondary)" }}>
            Trust is not a feeling
          </span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, color: "var(--text-primary)", margin: "12px 0 8px", letterSpacing: "-0.02em" }}>
            It's four numbers.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto" }}>
            Every property carries the same scorecard. No exceptions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          
          {/* Safety */}
          <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-light)", borderRadius: 16, padding: "24px", textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: "rgba(16,185,129,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <ShieldCheck size={28} style={{ color: "var(--color-secondary)" }} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "var(--color-secondary)", marginBottom: 4 }}>92</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>out of 100</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Safety Score</h3>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Area crime data. Updated monthly.
              A 92 means you can walk at night.
            </p>
          </div>
          
          {/* Noise */}
          <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-light)", borderRadius: 16, padding: "24px", textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: "rgba(245,158,11,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Volume2 size={28} style={{ color: "#F59E0B" }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F59E0B", marginBottom: 4 }}>Quiet</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>or Moderate · Lively</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Noise Level</h3>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Quiet means you sleep. Lively means you're near everything.
              You choose which fits.
            </p>
          </div>
          
          {/* Commute */}
          <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-light)", borderRadius: 16, padding: "24px", textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: "rgba(30,58,138,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Navigation size={28} style={{ color: "var(--color-primary)" }} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "var(--color-primary)", marginBottom: 4 }}>87</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>out of 100</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Commute Rating</h3>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Matatu routes. Major roads. CBD access.
              Higher score = shorter travel.
            </p>
          </div>
          
          {/* Landlord Trust */}
          <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-light)", borderRadius: 16, padding: "24px", textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: "rgba(139,92,246,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <BadgeCheck size={28} style={{ color: "#8B5CF6" }} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#8B5CF6", marginBottom: 4 }}>96%</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>landlord trust</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Landlord Score</h3>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Built from verified ID, response rate, and renter history.
              No anonymous landlords.
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 32 }}>
          Every number is checked before any listing goes live.
        </p>
      </div>

      {/* Live Stats */}
      <div style={{ background: "var(--color-primary)", padding: "48px 0" }}>
        <div className="container-custom">
          <div style={{ display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "var(--color-secondary)" }}>
                <Counter target={STATS.totalHomes} />+
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>homes verified</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "var(--color-secondary)" }}>
                <Counter target={STATS.totalAreas} />
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Nairobi areas mapped</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "var(--color-secondary)" }}>
                <Counter target={STATS.landlordVerificationRate} />%
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>landlords ID-verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="container-custom" style={{ padding: "64px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-secondary)" }}>
            Not finished. Just started.
          </span>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, color: "var(--text-primary)", margin: "12px 0 8px", letterSpacing: "-0.02em" }}>
            Three phases. One mission.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          
          <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-light)", borderRadius: 16, padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Home size={24} style={{ color: "var(--color-secondary)" }} />
              <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(16,185,129,0.15)", color: "var(--color-secondary)", padding: "2px 10px", borderRadius: 20 }}>Live now</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Trusted Homes</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
              Verified rentals and sales. Safety, noise, commute, and landlord scores on every property.
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Launched May 2026</p>
          </div>
          
          <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-light)", borderRadius: 16, padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Sparkles size={24} style={{ color: "#F59E0B" }} />
              <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(245,158,11,0.15)", color: "#F59E0B", padding: "2px 10px", borderRadius: 20 }}>Building now</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Creative Builds</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
              Tiny homes, container homes, alternative housing. Verified builder profiles.
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Expected Q4 2026</p>
          </div>
          
          <div style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-light)", borderRadius: 16, padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Users size={24} style={{ color: "var(--color-primary)" }} />
              <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(30,58,138,0.15)", color: "var(--color-primary)", padding: "2px 10px", borderRadius: 20 }}>Coming</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>Community</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
              Contractors, suppliers, builders — all on one verified platform. The original vision.
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Expected 2027</p>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div style={{ background: "var(--bg-card)", padding: "64px 0" }}>
        <div className="container-custom">
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <span style={{ fontSize: 32, fontWeight: 600, color: "#fff" }}>CR</span>
            </div>
            <p style={{
              fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              marginBottom: 20,
            }}>
              "I built WhyBuilder because I was tired of guessing.
              Every rental search felt like a gamble. Is this real?
              Is this area safe? Will this landlord call me back?
            </p>
            <p style={{
              fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              marginBottom: 20,
            }}>
              I wanted answers. Not more photos.
              So I built the thing I wished existed.
              One property at a time. One number at a time."
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>— Chingili Ricky, Founder</p>
            <a
              href="mailto:chingiliricky@gmail.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 24,
                fontSize: 13,
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
            >
              <Mail size={14} />
              chingiliricky@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container-custom" style={{ padding: "64px 0 80px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>
          Stop guessing. Start knowing.
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>
          Two minutes. Four questions. Your match.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/quiz"
            style={{
              background: "var(--color-primary)",
              color: "white",
              padding: "12px 28px",
              borderRadius: 40,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            Take the quiz → Find your home
          </Link>
          <Link
            to="/browse"
            style={{
              background: "transparent",
              border: "1px solid var(--border-medium)",
              color: "var(--text-primary)",
              padding: "12px 28px",
              borderRadius: 40,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            Browse all homes
          </Link>
        </div>
      </div>
    </div>
  );
}
