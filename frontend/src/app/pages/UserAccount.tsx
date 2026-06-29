import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Heart, Settings, LogOut, Trash2, MapPin, Bed, Bath, ShieldCheck, CheckCircle, Loader2 } from "lucide-react";
import { signOut, getCurrentUser } from "../../lib/auth";

interface SavedProperty {
  id: string;
  title: string;
  location: string;
  price_per_month: number;
  image_url: string | null;
  bedrooms: number;
  bathrooms: number;
  area: string;
}

type Tab = "saved" | "preferences";

export default function UserAccount() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("saved");
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [userName, setUserName] = useState<string>("there");
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/auth?mode=login");
        return;
      }
      setUserName(user.full_name.split(" ")[0]);
      setUserId(user.id);
      setSavedProperties([]);
      setLoading(false);
    }

    loadUserData();
  }, [navigate]);

  async function handleRemoveSaved(id: string) {
    if (!userId) return;
    setSavedProperties((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleSignOut() {
    setLoggingOut(true);
    await signOut();
    navigate("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="container-custom flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif mb-1">Hello, {userName}</h1>
            <p className="text-white/70 text-sm">Your saved properties and preferences</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm transition-all duration-200 ${
              activeTab === "saved"
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === "saved" ? "fill-white" : ""}`} />
            Saved homes
            {savedProperties.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "saved" ? "bg-white/20" : "bg-gray-100"}`}>
                {savedProperties.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm transition-all duration-200 ${
              activeTab === "preferences"
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings className="w-4 h-4" />
            Preferences
          </button>
        </div>

        {activeTab === "saved" && (
          <div>
            {savedProperties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl text-gray-700 mb-2">No saved properties yet</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Browse verified homes and save the ones you like.
                </p>
                <Link
                  to="/browse"
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  Browse properties
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-sm mb-6">
                  {savedProperties.length} saved {savedProperties.length === 1 ? "property" : "properties"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProperties.map((property) => (
                    <div key={property.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="p-4">
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="text-sm text-gray-500">{property.location}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                          <span>{property.bedrooms} beds</span>
                          <span>{property.bathrooms} baths</span>
                        </div>
                        <p className="text-primary font-semibold mt-2">KES {property.price_per_month.toLocaleString()}/mo</p>
                        <div className="flex gap-2 mt-3">
                          <Link to={`/property/${property.id}`} className="text-sm text-primary hover:underline">
                            View details →
                          </Link>
                          <button
                            onClick={() => handleRemoveSaved(property.id)}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-serif text-gray-900 mb-2">Lifestyle preferences</h2>
              <p className="text-gray-500 mb-6">
                These help us surface properties that match how you want to live.
              </p>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">What matters to you?</h3>
                {["Quiet living", "Social areas", "Work-friendly zones"].map((tag) => (
                  <label key={tag} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input type="checkbox" className="w-4 h-4 accent-primary" />
                    <span className="text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
              <button className="mt-8 w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
