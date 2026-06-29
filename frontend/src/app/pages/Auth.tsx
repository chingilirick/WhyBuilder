import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Building2, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { signIn, signUp } from "../../lib/auth";
import { getCurrentUser } from "../../lib/auth";
import type { AccountType } from "../../lib/api";

type Mode = "login" | "signup";

function getDashboardRoute(accountType: AccountType): string {
  if (accountType === "landlord") return "/dashboard";
  if (accountType === "administrator") return "/admin";
  return "/browse";
}

function getPasswordStrength(password: string): {
  label: string;
  color: string;
  width: string;
} {
  if (password.length === 0) return { label: "", color: "bg-gray-200", width: "0%" };
  if (password.length < 6) return { label: "Too short", color: "bg-red-400", width: "25%" };
  if (password.length < 8) return { label: "Weak", color: "bg-amber-400", width: "50%" };
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return { label: "Fair", color: "bg-yellow-400", width: "65%" };
  return { label: "Strong", color: "bg-green-500", width: "100%" };
}

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as Mode) ?? "login";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    accountType: "renter" as AccountType,
  });

  const strength = getPasswordStrength(form.password);
  const passwordsMatch =
    form.confirmPassword === "" || form.password === form.confirmPassword;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const { error: signInError } = await signIn({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      const user = getCurrentUser();
      navigate(user ? getDashboardRoute(user.account_type) : "/browse");
    } else {
      if (!form.fullName.trim()) {
        setError("Full name is required.");
        setLoading(false);
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const { error: signUpError } = await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        accountType: form.accountType,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      navigate(getDashboardRoute(form.accountType));
    }
  }

  function switchMode() {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
    setForm({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      accountType: "renter",
    });
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl text-primary font-semibold">WhyBuilder</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {mode === "login"
                ? "Sign in to access your saved properties and account."
                : "Join WhyBuilder and make better housing decisions."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    mode === "signup" ? "At least 8 characters" : "Your password"
                  }
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {mode === "signup" && form.password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    required
                    className={`${inputClass} pr-10 ${
                      form.confirmPassword.length > 0
                        ? passwordsMatch
                          ? "border-green-400 focus:border-green-400 focus:ring-green-100"
                          : "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : ""
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {form.confirmPassword.length > 0 &&
                      (passwordsMatch ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ))}
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="text-gray-400 hover:text-gray-600 ml-1"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {form.confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am a
                </label>
                <select
                  name="accountType"
                  value={form.accountType}
                  onChange={handleChange}
                  className={`${inputClass} bg-white`}
                >
                  <option value="renter">Renter — looking for a home</option>
                  <option value="landlord">Landlord — listing a property</option>
                </select>
                <p className="text-xs text-gray-400 mt-1.5">
                  {form.accountType === "landlord"
                    ? "You'll be taken to your landlord dashboard to submit your first listing."
                    : "You'll be taken to browse verified properties in Nairobi."}
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                (mode === "signup" &&
                  form.confirmPassword.length > 0 &&
                  !passwordsMatch)
              }
              className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={switchMode}
              className="text-primary font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          <Link to="/browse" className="hover:text-primary transition-colors">
            Continue browsing without an account
          </Link>
        </p>
      </div>
    </div>
  );
}