import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer 
      className="transition-colors duration-300"
      style={{ 
        background: "var(--bg-footer)", 
        borderTop: "0.5px solid var(--border-light)" 
      }}
    >
      <div className="container-custom" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}
          className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>WB</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>WhyBuilder</span>
            </Link>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, maxWidth: 200 }}>
              Verified rental listings for Nairobi.
            </p>
          </div>

          {/* Discover */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Discover</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link to="/browse" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }} className="hover-text-primary">Browse homes</Link>
              <Link to="/about" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }} className="hover-text-primary">How verification works</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Company</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link to="/about" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }} className="hover-text-primary">Our mission</Link>
              <Link to="/about" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }} className="hover-text-primary">Contact</Link>
            </div>
          </div>

          {/* For Landlords — promoted, visually distinct */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>List with us</p>
            <Link
              to="/auth?mode=signup&type=landlord"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-primary)",
                textDecoration: "none",
                border: "1px solid var(--color-primary)",
                borderRadius: 8,
                padding: "6px 12px",
              }}
              className="hover-text-primary"
            >
              For landlords <ArrowRight size={13} />
            </Link>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "8px 0 0", maxWidth: 160 }}>
              List a verified property in minutes.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "0.5px solid var(--border-light)", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>


          {/* Bottom bar */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>© 2026 WhyBuilder · Nairobi, Kenya</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>
              "People don't struggle to find housing. They struggle to decide confidently."
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid > div:first-child { grid-column: span 2; }
        }
        .hover-text-primary:hover { color: var(--color-primary) !important; }
      `}</style>
    </footer>
  );
}
