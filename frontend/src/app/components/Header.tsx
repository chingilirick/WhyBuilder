import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Icons } from "./Icon";
import { getCurrentUser, signOut } from "../../lib/auth";
import { useTheme } from "../../context/ThemeContext";

interface NavUser {
  id: string;
  full_name: string;
  account_type: "renter" | "landlord" | "administrator";
}

function WhyBuilderLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="var(--color-primary)" />
        <path d="M6 12 L11 26 L16 16 L21 26 L26 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M29 12 L29 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 12 Q36 12 36 16 Q36 19 29 19 Q36 19 36 23 Q36 26 29 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className="text-base font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        Why<span style={{ color: "var(--color-secondary)" }}>Builder</span>
      </span>
    </div>
  );
}

const NAV_ITEMS = [
  { name: "Homes", path: "/" },
  { name: "Browse", path: "/browse" },
  { name: "About", path: "/about" },
];

export function Header() {
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();
  const [user, setUser] = useState<NavUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    const u = getCurrentUser();
    if (u) setUser(u as NavUser);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  async function handleSignOut() {
    await signOut();
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  }

  const getDashboardLink = () =>
    user?.account_type === "landlord" ? "/dashboard" :
    user?.account_type === "administrator" ? "/admin" : "/account";

  const getDashboardLabel = () =>
    user?.account_type === "landlord" ? "Dashboard" :
    user?.account_type === "administrator" ? "Admin" : "My account";

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-md transition-colors duration-300"
        style={{
          borderBottom: "0.5px solid var(--border-light)",
          background: "var(--bg-header)"
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">

            <WhyBuilderLogo />

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-hover)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to={user ? "/submit" : "/auth?mode=signup&type=landlord"}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                For landlords
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ background: "var(--bg-hover)" }}
              >
                {isDark ? <Icons.Sun size={16} style={{ color: "var(--color-accent)" }} /> : <Icons.Moon size={16} style={{ color: "var(--color-primary)" }} />}
              </button>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    className="flex items-center gap-2 py-1.5 pl-2 pr-3 rounded-full border"
                    style={{
                      borderColor: "var(--border-light)",
                      background: "var(--bg-card)"
                    }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
                      <span className="text-xs font-semibold text-white">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                      {user.full_name.split(" ")[0]}
                    </span>
                    <Icons.ChevronDown size={12} style={{ color: "var(--text-muted)", transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg overflow-hidden" style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border-light)",
                    }}>
                      <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border-light)" }}>
                        <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{user.account_type}</p>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user.full_name}</p>
                      </div>
                      <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm transition-colors" style={{ color: "var(--text-secondary)" }}>
                        <Icons.LayoutDashboard size={14} /> {getDashboardLabel()}
                      </Link>
                      <Link to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm transition-colors" style={{ color: "var(--text-secondary)" }}>
                        <Icons.Heart size={14} /> Saved
                      </Link>
                      {user.account_type === "landlord" && (
                        <Link to="/submit" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm transition-colors" style={{ color: "var(--text-secondary)" }}>
                          <Icons.Plus size={14} /> Submit listing
                        </Link>
                      )}
                      <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 w-full text-left border-t transition-colors hover:bg-red-50 dark:hover:bg-red-900/20" style={{ borderColor: "var(--border-light)" }}>
                        <Icons.LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth?mode=login" className="px-4 py-2 text-sm font-medium rounded-full transition-colors" style={{ color: "var(--text-secondary)" }}>Sign in</Link>
                  <Link to="/auth?mode=signup" className="px-4 py-2 text-sm font-semibold rounded-full text-white" style={{ background: "var(--color-primary)" }}>Get started</Link>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "var(--bg-hover)" }}
              >
                {mobileMenuOpen ? <Icons.X size={18} /> : <Icons.Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 p-5" style={{ background: "var(--bg-body)" }}>
          <div className="flex flex-col gap-2">
            {[...NAV_ITEMS, { name: "For landlords", path: user ? "/submit" : "/auth?mode=signup&type=landlord" }].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium border-b"
                style={{ color: "var(--text-primary)", borderColor: "var(--border-light)" }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
