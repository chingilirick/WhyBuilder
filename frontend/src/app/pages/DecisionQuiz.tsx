import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ArrowLeft, ShieldCheck, Check } from "lucide-react";
import { useUserPreferences } from "../hooks/useUserPreferences";

interface QuizState {
  area: string;
  lifestyle: string;
  noise: string;
  workPattern: string;
  budget: [number, number];
}

const INITIAL: QuizState = {
  area: "", lifestyle: "", noise: "", workPattern: "", budget: [30000, 120000],
};

const AREAS = [
  { value: "Westlands",  label: "Westlands",  sub: "Urban · Connected · Lively" },
  { value: "Kilimani",   label: "Kilimani",   sub: "Residential · Calm · Safe" },
  { value: "Karen",      label: "Karen",      sub: "Quiet · Green · Family" },
  { value: "Lavington",  label: "Lavington",  sub: "Peaceful · Work-ready" },
  { value: "Ngong Road", label: "Ngong Road", sub: "Affordable · Well-connected" },
  { value: "Any",        label: "Show all",   sub: "No preference" },
];

const LIFESTYLES = [
  { value: "Quiet living",        label: "Quiet & focused",  sub: "Low traffic, calm streets" },
  { value: "Social areas",        label: "Social & vibrant", sub: "Cafés, parks, energy" },
  { value: "Work-friendly zones", label: "Work from home",   sub: "Fast internet, quiet hours" },
  { value: "Any",                 label: "No preference",    sub: "Show me everything" },
];

const NOISE_OPTIONS = [
  { value: "Quiet",    label: "Quiet",     sub: "Peaceful environment" },
  { value: "Moderate", label: "Moderate",  sub: "Some activity is fine" },
  { value: "Lively",   label: "Lively",    sub: "I like energy around me" },
  { value: "Any",      label: "Any level", sub: "No preference" },
];

const WORK_PATTERNS = [
  { value: "remote",   label: "Fully remote", sub: "I work from home" },
  { value: "hybrid",   label: "Hybrid",       sub: "Office a few days a week" },
  { value: "office",   label: "Office-based", sub: "Commute matters to me" },
  { value: "flexible", label: "Flexible",     sub: "It varies" },
];

const BUDGET_MIN = 20000;
const BUDGET_MAX = 300000;
const BUDGET_STEP = 5000;
const TOTAL_STEPS = 5;
const STEP_LABELS = ["Area", "Lifestyle", "Noise", "Work", "Budget"];

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "2.5rem" }}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < TOTAL_STEPS - 1 ? 1 : "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, transition: "all 0.3s",
            background: i < step ? "var(--color-secondary)" : i === step ? "var(--color-primary)" : "rgba(255,255,255,0.08)",
            color: i <= step ? "#fff" : "rgba(255,255,255,0.3)",
            border: i === step ? "2px solid var(--color-secondary)" : "2px solid transparent",
            boxShadow: i === step ? "0 0 0 3px rgba(16,185,129,0.2)" : "none",
          }}>
            {i < step ? <Check style={{ width: 14, height: 14 }} /> : i + 1}
          </div>
          {i < TOTAL_STEPS - 1 && (
            <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.08)", margin: "0 4px" }}>
              <div style={{
                height: "100%", background: "var(--color-secondary)",
                width: i < step ? "100%" : "0%",
                transition: "width 0.4s ease",
              }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OptionTile({ label, sub, selected, onClick }: {
  label: string; sub: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", textAlign: "left", padding: "14px 16px",
        borderRadius: 12, border: "1px solid",
        borderColor: selected ? "var(--color-secondary)" : "rgba(255,255,255,0.1)",
        background: selected ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
        cursor: "pointer", transition: "all 0.15s",
        outline: "none",
      }}
      onMouseEnter={e => {
        if (!selected) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
      }}
      onMouseLeave={e => {
        if (!selected) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: selected ? "var(--color-secondary)" : "#f1f5f9", margin: 0 }}>
          {label}
        </p>
        {selected && (
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Check style={{ width: 11, height: 11, color: "#fff" }} />
          </div>
        )}
      </div>
      <p style={{ fontSize: 12, color: selected ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.4)", margin: "3px 0 0" }}>
        {sub}
      </p>
    </button>
  );
}

export default function DecisionQuiz() {
  const navigate = useNavigate();
  const { savePreferences } = useUserPreferences();
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState<QuizState>(INITIAL);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof QuizState, value: any) =>
    setQuiz(prev => ({ ...prev, [key]: value }));

  const canProceed = () => {
    if (step === 0) return quiz.area !== "";
    if (step === 1) return quiz.lifestyle !== "";
    if (step === 2) return quiz.noise !== "";
    if (step === 3) return quiz.workPattern !== "";
    return true;
  };

  async function handleFinish() {
    setSaving(true);
    const lifestyleTags = quiz.lifestyle !== "Any" ? [quiz.lifestyle] : [];
    const noiseLevel = quiz.noise !== "Any" ? (quiz.noise as "Quiet" | "Moderate" | "Lively") : null;
    await savePreferences({ lifestyleTags, noiseLevel });
    const params = new URLSearchParams();
    if (quiz.area && quiz.area !== "Any") params.set("area", quiz.area);
    if (quiz.lifestyle && quiz.lifestyle !== "Any") params.set("lifestyle", quiz.lifestyle);
    if (quiz.noise && quiz.noise !== "Any") params.set("noise", quiz.noise);
    if (quiz.budget[1] < BUDGET_MAX) params.set("maxBudget", String(quiz.budget[1]));
    if (quiz.budget[0] > BUDGET_MIN) params.set("minBudget", String(quiz.budget[0]));
    navigate(`/browse?${params.toString()}`);
  }

  const STEPS = [
    { key: "area",        headline: "Which area feels right for you?",    sub: "We'll match you with verified homes in that neighbourhood.",          options: AREAS,         field: "area" as const },
    { key: "lifestyle",   headline: "How do you like to live?",            sub: "This shapes which listings feel most like yours.",                    options: LIFESTYLES,    field: "lifestyle" as const },
    { key: "noise",       headline: "How much noise can you live with?",   sub: "Every WhyBuilder listing carries a verified noise rating.",           options: NOISE_OPTIONS, field: "noise" as const },
    { key: "workPattern", headline: "How do you work?",                    sub: "Commute data and internet quality are weighted by work pattern.",     options: WORK_PATTERNS, field: "workPattern" as const },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-dark-bg)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck style={{ width: 16, height: 16, color: "var(--color-secondary)" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>WhyBuilder</span>
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
          Step {step + 1} of {TOTAL_STEPS} — {STEP_LABELS[step]}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 16px 80px" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <ProgressBar step={step} />

          {/* Option steps 0–3 */}
          {step <= 3 && (() => {
            const s = STEPS[step];
            return (
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-secondary)", margin: "0 0 8px" }}>
                  Step {step + 1}
                </p>
                <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.9rem)", fontWeight: 600, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1.2 }}>
                  {s.headline}
                </h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 28px", lineHeight: 1.6 }}>
                  {s.sub}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {s.options.map((o) => (
                    <OptionTile
                      key={o.value}
                      label={o.label}
                      sub={o.sub}
                      selected={quiz[s.field] === o.value}
                      onClick={() => set(s.field, o.value)}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Budget step */}
          {step === 4 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-secondary)", margin: "0 0 8px" }}>
                Step 5
              </p>
              <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 1.9rem)", fontWeight: 600, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1.2 }}>
                What is your monthly budget?
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 28px" }}>
                All prices in Kenyan Shillings.
              </p>

              {/* Budget display */}
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Minimum</p>
                    <p style={{ fontSize: 18, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>KES {quiz.budget[0].toLocaleString()}</p>
                  </div>
                  <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Maximum</p>
                    <p style={{ fontSize: 18, fontWeight: 600, color: "var(--color-secondary)", margin: 0 }}>
                      {quiz.budget[1] >= BUDGET_MAX ? "No limit" : `KES ${quiz.budget[1].toLocaleString()}`}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>Minimum rent</label>
                  <input type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP} value={quiz.budget[0]}
                    onChange={e => { const v = Number(e.target.value); if (v < quiz.budget[1]) set("budget", [v, quiz.budget[1]]); }}
                    style={{ width: "100%", accentColor: "var(--color-secondary)" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>Maximum rent</label>
                  <input type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP} value={quiz.budget[1]}
                    onChange={e => { const v = Number(e.target.value); if (v > quiz.budget[0]) set("budget", [quiz.budget[0], v]); }}
                    style={{ width: "100%", accentColor: "var(--color-secondary)" }} />
                </div>
              </div>

              {/* Summary card */}
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "var(--color-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Your search summary</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    ["Area", quiz.area === "Any" ? "All areas" : quiz.area],
                    ["Lifestyle", quiz.lifestyle === "Any" ? "No preference" : quiz.lifestyle],
                    ["Noise", quiz.noise === "Any" ? "Any level" : quiz.noise],
                    ["Work", quiz.workPattern],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 8, fontSize: 13 }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", minWidth: 64 }}>{k}</span>
                      <span style={{ color: "#f1f5f9", fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "12px 20px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, cursor: "pointer",
                }}
              >
                <ArrowLeft style={{ width: 15, height: 15 }} /> Back
              </button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  cursor: canProceed() ? "pointer" : "not-allowed",
                  background: canProceed() ? "var(--color-primary)" : "rgba(255,255,255,0.06)",
                  color: canProceed() ? "#fff" : "rgba(255,255,255,0.25)",
                  border: canProceed() ? "1px solid var(--color-primary)" : "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.15s",
                }}
              >
                Continue <ArrowRight style={{ width: 15, height: 15 }} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: "var(--color-secondary)", color: "#fff", border: "none", cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
              >
                {saving ? "Finding your homes…" : "Show my matches"}
                {!saving && <ArrowRight style={{ width: 15, height: 15 }} />}
              </button>
            )}
          </div>

          {step === 0 && (
            <p style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={() => navigate("/browse")}
                style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Skip and browse all properties
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
