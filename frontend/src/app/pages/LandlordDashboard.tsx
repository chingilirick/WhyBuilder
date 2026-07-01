import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, ShieldCheck, Clock, XCircle, BarChart2, LogOut, HomeIcon, MessageCircle } from "lucide-react";
import { getImageUrl, PLACEHOLDER_IMAGE } from "../../lib/api";
import { getCurrentUser, signOut } from "../../lib/auth";
import { fetchLandlordProperties } from "../../lib/properties";
import type { ListingStatus } from "../../lib/api";

interface LandlordProperty {
  id: string;
  title: string;
  address: string;
  area: string;
  city: string;
  price_per_month: number;
  listing_status: ListingStatus;
  image_url: string | null;
}

function statusConfig(status: ListingStatus) {
  const configs = {
    verified: { label: "Verified", icon: ShieldCheck, className: "bg-secondary/10 text-secondary" },
    pending: { label: "Pending review", icon: Clock, className: "bg-amber-50 text-amber-600" },
    rejected: { label: "Rejected", icon: XCircle, className: "bg-red-50 text-red-500" },
  };
  return configs[status];
}

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");
  const [loggingOut, setLoggingOut] = useState(false);
  const [listings, setListings] = useState<LandlordProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [landlordWhatsApp, setLandlordWhatsApp] = useState<string | null>(null);
  const [landlordPhone, setLandlordPhone] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/auth?mode=login");
        return;
      }
      setUserName(user.full_name.split(" ")[0]);

      // Fetch landlord contact info
      try {
        const token = localStorage.getItem("whybuilder_token");
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/landlord/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLandlordWhatsApp(data.phone_number ? `https://wa.me/${data.phone_number.replace(/\D/g, "")}` : null);
          setLandlordPhone(data.phone_number);
        }
      } catch (err) {
        console.error("Failed to load contact info:", err);
      }

      const { data, error } = await fetchLandlordProperties(user.id);
      if (!error && data) {
        const formattedListings: LandlordProperty[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          address: p.address,
          area: p.area,
          city: p.city,
          price_per_month: p.price_per_month,
          listing_status: p.listing_status,
          image_url: p.image_url || null,
        }));
        setListings(formattedListings);
      }
      setLoading(false);
    }

    loadDashboard();
  }, [navigate]);

  async function handleSignOut() {
    setLoggingOut(true);
    await signOut();
    navigate("/");
  }

  const verifiedCount = listings.filter((l) => l.listing_status === "verified").length;
  const pendingCount = listings.filter((l) => l.listing_status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-serif mb-1">My listings</h1>
            <p className="text-white/70 text-sm">Hello, {userName} — manage your properties here</p>
          </div>
          <div className="flex items-center gap-4">
            {landlordWhatsApp && (
              <a
                href={landlordWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Support
              </a>
            )}
            <Link
              to="/submit"
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add listing
            </Link>
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: BarChart2, label: "Total listings", value: listings.length, color: "text-primary" },
            { icon: ShieldCheck, label: "Verified", value: verifiedCount, color: "text-secondary" },
            { icon: Clock, label: "Pending review", value: pendingCount, color: "text-amber-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">All listings</h2>
          </div>
          {listings.length === 0 ? (
            <div className="text-center py-16">
              <HomeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">You haven't submitted any listings yet.</p>
              <Link to="/submit" className="inline-block mt-4 text-primary text-sm hover:underline">
                Submit your first listing →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {listings.map((listing) => {
                const { label, icon: StatusIcon, className } = statusConfig(listing.listing_status);
                return (
                  <div key={listing.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={getImageUrl(listing.image_url)}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                      <p className="text-xs text-gray-400">{listing.area}, {listing.city}</p>
                    </div>
                    <div className="text-sm text-gray-700 hidden sm:block">
                      KES {listing.price_per_month.toLocaleString()}/mo
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${className}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {label}
                    </div>
                    <Link
                      to={`/property/${listing.id}`}
                      className="text-xs text-primary hover:underline hidden sm:block"
                    >
                      View →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {landlordPhone && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 text-center">
            <p className="text-sm text-green-800">
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Need help? Contact our landlord support on WhatsApp:{" "}
              <a href={`https://wa.me/${landlordPhone.replace(/\D/g, "")}`} className="font-semibold underline" target="_blank" rel="noopener noreferrer">
                {landlordPhone}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
