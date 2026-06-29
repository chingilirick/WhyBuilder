import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ShieldCheck, Volume2, Navigation, BadgeCheck } from "lucide-react";

const STEPS = [
  {
    number: "01",
    label: "Tell",
    headline: "Where do you need to be?",
    body: "Not just price and bedrooms. Tell us your noise preference, commute need, and lifestyle — quiet streets, work-from-home ready, near transport.",
    cta: { text: "Start matching", href: "/quiz" },
    image: "/images/how-it-works/tell-modern-01.jpg",
    imageAlt: "Westlands Nairobi modern apartment",
    tag: "Westlands, Nairobi",
  },
  {
    number: "02",
    label: "Check",
    headline: "Every home. Seen firsthand.",
    body: "Safety scores, noise ratings, and commute times are structured data — not user opinions. Every property reviewed manually. No exceptions.",
    cta: { text: "How verification works", href: "/about" },
    image: "/images/how-it-works/check-verified-01.jpg",
    imageAlt: "Lavington Nairobi verified home",
    tag: "Lavington, Nairobi",
  },
  {
    number: "03",
    label: "Choose",
    headline: "Safety. Noise. Commute. Measured.",
    body: "Every property shows a Safety Score, Noise Level, Commute Rating, and Landlord Trust Score. Move with confidence, not guesswork.",
    cta: { text: "See a live listing", href: "/browse" },
    image: "/images/how-it-works/choose-confident-01.jpg",
    imageAlt: "Karen Nairobi family home",
    tag: "Karen, Nairobi",
  },
];

const METRICS = [
  { icon: ShieldCheck, label: "Safety score", value: "92", unit: "/ 100", detail: "Area data reviewed before listing goes live." },
  { icon: Volume2, label: "Noise level", value: "Quiet", unit: "", detail: "Three-tier rating based on area assessment." },
  { icon: Navigation, label: "Commute rating", value: "87", unit: "/ 100", detail: "Matatu routes, highways, CBD access." },
  { icon: BadgeCheck, label: "Landlord trust", value: "96%", unit: "", detail: "Verified identity and renter history." },
];

const AUTO_INTERVAL = 4000;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number, manual = false) => {
    if (index === active) return;
    setAnimating(true);
    setTimeout(() => { setActive(index); setAnimating(false); }, 250);
    if (manual) setPaused(true);
  };

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setActive((prev) => (prev + 1) % STEPS.length); setAnimating(false); }, 250);
    }, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, active]);

  const step = STEPS[active];

  return (
    <section style={{ padding: "5rem 0", background: "#FAFAF8" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9c9a90", margin: "0 0 10px" }}>How it works</p>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 400, color: "#1a1a18", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Tell. Check. Choose.</h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: "#6b6b65", margin: 0 }}>Three steps. No guesswork. Confident decision.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, borderBottom: "0.5px solid rgba(0,0,0,0.1)", marginBottom: "2.5rem", position: "relative" }}>
          {STEPS.map((s, i) => (
            <button key={s.number} onClick={() => goTo(i, true)} style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "none", border: "none", borderBottom: `2px solid ${active === i ? "#1a1a18" : "transparent"}`, marginBottom: "-0.5px", cursor: "pointer", fontSize: 14, fontWeight: active === i ? 500 : 400, color: active === i ? "#1a1a18" : "#6b6b65", transition: "color 0.2s" }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", opacity: active === i ? 1 : 0.4 }}>{s.number}</span>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16 }}>{s.label}</span>
              {active === i && !paused && <span style={{ position: "absolute", bottom: -2, left: 0, height: 2, background: "#1a1a18", animation: `tabProg ${AUTO_INTERVAL}ms linear forwards` }} />}
            </button>
          ))}
          {paused && <button onClick={() => setPaused(false)} style={{ marginLeft: "auto", background: "none", border: "0.5px solid rgba(0,0,0,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 500, color: "#6b6b65", cursor: "pointer" }}>▶ Auto</button>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "start", opacity: animating ? 0 : 1, transform: animating ? "translateY(6px)" : "translateY(0)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "4/3" }}>
            <img src={step.image} alt={step.imageAlt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: 14, left: 14, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 500, color: "#1a1a18", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0, display: "inline-block" }} />
              {step.tag} · Verified listing
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9c9a90", margin: "0 0 4px" }}>Step {step.number}</p>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, fontWeight: 400, color: "#1a1a18", margin: "0 0 14px", letterSpacing: "-0.02em" }}>{step.label}</h3>
            <h4 style={{ fontSize: 17, fontWeight: 500, color: "#1a1a18", margin: "0 0 10px" }}>{step.headline}</h4>
            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.7, color: "#6b6b65", margin: "0 0 22px" }}>{step.body}</p>
            <Link to={step.cta.href} style={{ display: "inline-block", fontSize: 13, fontWeight: 500, color: "#1a1a18", textDecoration: "none", borderBottom: "0.5px solid currentColor", paddingBottom: 2, marginBottom: "1.8rem" }}>{step.cta.text} →</Link>
            {active === 0 && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9c9a90", margin: "0 0 12px" }}>What you see on every property</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {METRICS.map((m) => (
                    <div key={m.label} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: 13 }}>
                      <m.icon size={15} style={{ color: "#9c9a90", marginBottom: 7, display: "block" }} />
                      <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9c9a90", margin: "0 0 3px" }}>{m.label}</p>
                      <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, color: "#1a1a18", margin: "0 0 5px" }}>{m.value}{m.unit && <span style={{ fontSize: 12, fontWeight: 300, color: "#9c9a90" }}> {m.unit}</span>}</p>
                      <p style={{ fontSize: 11, fontWeight: 300, lineHeight: 1.5, color: "#6b6b65", margin: 0 }}>{m.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "2.5rem" }}>
          {STEPS.map((_, i) => (<button key={i} onClick={() => goTo(i, true)} style={{ width: active === i ? 20 : 6, height: 6, borderRadius: active === i ? 3 : "50%", background: active === i ? "#1a1a18" : "rgba(0,0,0,0.2)", border: "none", padding: 0, cursor: "pointer", transition: "all 0.2s" }} />))}
        </div>
      </div>
      <style>{`@keyframes tabProg { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}
