import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router";
import { Icons } from "../Icon";
import { getCurrentUser, signOut } from "../../../lib/auth";
import type { AccountType } from "../../../lib/api";

interface NavItem {
  label: string;
  path: string;
  icon: keyof typeof Icons;
}

const NAV_CONFIG: Record<string, NavItem[]> = {
  administrator: [
    { label: "Verification queue", path: "/admin", icon: "ShieldCheck" },
  ],
  landlord: [
    { label: "My listings", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Add listing", path: "/submit", icon: "Plus" },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  administrator: "Administrator",
  landlord: "Landlord",
  renter: "Renter",
};

export function DashboardLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = user ? NAV_CONFIG[user.account_type] ?? [] : [];

  async function handleSignOut() {
    setLoggingOut(true);
    await signOut();
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-body)" }}>
      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ background: "var(--bg-header)", borderBottom: "0.5px solid var(--border-light)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          WhyBuilder {ROLE_LABEL[user.account_type]}
        </span>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "var(--bg-hover)" }}
        >
          {mobileOpen ? <Icons.X size={18} /> : <Icons.Menu size={18} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${mobileOpen ? "flex" : "hidden"} md:flex fixed md:sticky top-14 md:top-0 left-0 z-30 w-64 h-[calc(100vh-56px)] md:h-screen flex-col justify-between`}
        style={{ background: "var(--bg-sidebar)", borderRight: "0.5px solid var(--border-light)" }}
      >
        <div>
          <div className="hidden md:flex items-center gap-2 px-6 h-16" style={{ borderBottom: "0.5px solid var(--border-light)" }}>
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
              <span className="text-white text-xs font-bold">WB</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              WhyBuilder
            </span>
          </div>

          <nav className="px-3 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = Icons[item.icon];
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? "var(--bg-hover)" : "transparent",
                    color: isActive ? "var(--color-primary)" : "var(--text-secondary)",
                  })}
                >
                  <Icon size={17} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-2 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <Icons.ArrowLeft size={17} />
            Back to site
          </Link>

          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-light)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--color-primary)" }}
            >
              <span className="text-xs font-semibold text-white">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {user.full_name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {ROLE_LABEL[user.account_type]}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              aria-label="Sign out"
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-50"
            >
              <Icons.LogOut size={15} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
