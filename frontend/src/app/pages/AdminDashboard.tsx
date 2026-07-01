import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  ShieldCheck, XCircle, ExternalLink, Loader2, ChevronDown,
  Save, ImageOff,
} from "lucide-react";
import { admin, getImageUrl, PLACEHOLDER_IMAGE, deletePropertyImage, type Property } from "../../lib/api";

const PROPERTY_TYPES = ["Apartment", "House", "Townhouse", "Studio", "Villa"];
const NOISE_LEVELS = ["quiet", "moderate", "lively"];

const fieldClass =
  "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<Property>>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await admin.getPendingListings();
    if (fetchError) {
      setError(fetchError);
    } else {
      setListings(data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  function toggleExpand(listing: Property) {
    if (expandedId === listing.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(listing.id);
    setSaveMessage(null);
    setDrafts((prev) => ({
      ...prev,
      [listing.id]: prev[listing.id] ?? { ...listing },
    }));
  }

  function updateDraft(id: string, field: keyof Property, value: unknown) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function handleSave(id: string) {
    setSaving(true);
    setSaveMessage(null);
    const draft = drafts[id];
    const { data, error: saveError } = await admin.updateListing(id, draft);
    setSaving(false);

    if (saveError) {
      setSaveMessage(`Save failed: ${saveError}`);
      return;
    }

    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    setSaveMessage("Changes saved.");
  }

  async function handleVerify(id: string, action: "approved" | "rejected") {
    setActingOn(id);
    const draft = drafts[id];

    if (draft) {
      const { error: saveError } = await admin.updateListing(id, draft);
      if (saveError) {
        alert(`Could not save your edits before ${action === "approved" ? "approving" : "rejecting"}: ${saveError}`);
        setActingOn(null);
        return;
      }
    }

    const { error: verifyError } = await admin.verifyListing(id, action);
    if (verifyError) {
      alert(`Failed to ${action === "approved" ? "approve" : "reject"} listing: ${verifyError}`);
    } else {
      setListings((prev) => prev.filter((l) => l.id !== id));
      setExpandedId(null);
    }
    setActingOn(null);
  }

  async function handleDeleteImage(propertyId: string, imageId: number) {
    const { error: deleteError } = await deletePropertyImage(propertyId, imageId);
    if (deleteError) {
      alert(`Could not remove image: ${deleteError}`);
      return;
    }
    setListings((prev) =>
      prev.map((l) =>
        l.id === propertyId ? { ...l, images: l.images?.filter((img) => img.id !== imageId) } : l
      )
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-body)" }}>
      <div className="py-8" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-serif font-bold text-white">Verification queue</h1>
          <p className="text-white/70 text-sm mt-1">
            Review pending listings before they go live to renters
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Pending review" value={listings.length} />
          <StatCard label="Awaiting your action" value={listings.length} accent />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-16 rounded-2xl border" style={{ borderColor: "var(--border-light)", background: "var(--bg-card)" }}>
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p style={{ color: "var(--text-secondary)" }}>{error}</p>
            <button onClick={loadPending} className="mt-4 text-sm text-primary hover:underline">
              Try again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border" style={{ borderColor: "var(--border-light)", background: "var(--bg-card)" }}>
            <ShieldCheck className="w-12 h-12 text-secondary mx-auto mb-3" />
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>Queue is clear</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              No listings waiting for review right now.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-light)", background: "var(--bg-card)" }}>
            <div
              className="hidden sm:grid grid-cols-[64px_2fr_1fr_1fr_140px_32px] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wide"
              style={{ background: "var(--bg-sidebar)", color: "var(--text-muted)" }}
            >
              <div></div>
              <div>Listing</div>
              <div>Area</div>
              <div>Price</div>
              <div>Actions</div>
              <div></div>
            </div>

            <div className="divide-y" style={{ borderColor: "var(--border-light)" }}>
              {listings.map((listing) => {
                const isExpanded = expandedId === listing.id;
                const draft = drafts[listing.id] ?? listing;

                return (
                  <div key={listing.id}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(listing)}
                      className="w-full grid grid-cols-1 sm:grid-cols-[64px_2fr_1fr_1fr_140px_32px] gap-4 px-6 py-4 items-center text-left hover:bg-black/[0.02] transition-colors"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "var(--bg-sidebar)" }}>
                        <img
                          src={getImageUrl(listing.image_url)}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {listing.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {listing.landlord_name || "Unknown landlord"}
                        </p>
                      </div>

                      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {listing.area}, {listing.city}
                      </div>

                      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        KES {listing.price_per_month.toLocaleString()}/mo
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleVerify(listing.id, "approved")}
                          disabled={actingOn === listing.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(listing.id, "rejected")}
                          disabled={actingOn === listing.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-300 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 justify-self-end transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        style={{ color: "var(--text-muted)" }}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t" style={{ borderColor: "var(--border-light)", background: "var(--bg-sidebar)" }}>

                        <div className="mb-5">
                          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>
                            Photos ({listing.images?.length ?? 0})
                          </p>
                          {listing.images && listing.images.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {listing.images.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group" style={{ background: "var(--bg-card)" }}>
                                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteImage(listing.id, img.id)}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                    aria-label="Remove image"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs py-3" style={{ color: "var(--text-muted)" }}>
                              <ImageOff className="w-3.5 h-3.5" />
                              No gallery photos on this listing.
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <EditField label="Title">
                            <input
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.title ?? ""}
                              onChange={(e) => updateDraft(listing.id, "title", e.target.value)}
                            />
                          </EditField>
                          <EditField label="Property type">
                            <select
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.property_type ?? ""}
                              onChange={(e) => updateDraft(listing.id, "property_type", e.target.value)}
                            >
                              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </EditField>
                        </div>

                        <div className="mb-4">
                          <EditField label="Description">
                            <textarea
                              rows={2}
                              className={`${fieldClass} resize-none`}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.description ?? ""}
                              onChange={(e) => updateDraft(listing.id, "description", e.target.value)}
                            />
                          </EditField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <EditField label="Address">
                            <input
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.address ?? ""}
                              onChange={(e) => updateDraft(listing.id, "address", e.target.value)}
                            />
                          </EditField>
                          <EditField label="Area">
                            <input
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.area ?? ""}
                              onChange={(e) => updateDraft(listing.id, "area", e.target.value)}
                            />
                          </EditField>
                          <EditField label="City">
                            <input
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.city ?? ""}
                              onChange={(e) => updateDraft(listing.id, "city", e.target.value)}
                            />
                          </EditField>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
                          <EditField label="Price/mo (KES)">
                            <input
                              type="number"
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.price_per_month ?? 0}
                              onChange={(e) => updateDraft(listing.id, "price_per_month", Number(e.target.value))}
                            />
                          </EditField>
                          <EditField label="Bedrooms">
                            <input
                              type="number"
                              min="0"
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.bedrooms ?? 0}
                              onChange={(e) => updateDraft(listing.id, "bedrooms", Number(e.target.value))}
                            />
                          </EditField>
                          <EditField label="Bathrooms">
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.bathrooms ?? 0}
                              onChange={(e) => updateDraft(listing.id, "bathrooms", Number(e.target.value))}
                            />
                          </EditField>
                          <EditField label="Size (sqft)">
                            <input
                              type="number"
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.size_sqft ?? ""}
                              onChange={(e) => updateDraft(listing.id, "size_sqft", e.target.value ? Number(e.target.value) : null)}
                            />
                          </EditField>
                          <EditField label="Noise level">
                            <select
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.noise_level ?? "moderate"}
                              onChange={(e) => updateDraft(listing.id, "noise_level", e.target.value)}
                            >
                              {NOISE_LEVELS.map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </EditField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <EditField label="Safety score (0-100)">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.safety_score ?? 0}
                              onChange={(e) => updateDraft(listing.id, "safety_score", Number(e.target.value))}
                            />
                          </EditField>
                          <EditField label="Commute rating (0-100)">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className={fieldClass}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.commute_rating ?? 0}
                              onChange={(e) => updateDraft(listing.id, "commute_rating", Number(e.target.value))}
                            />
                          </EditField>
                        </div>

                        <div className="mb-5">
                          <EditField label="Area insight">
                            <textarea
                              rows={2}
                              className={`${fieldClass} resize-none`}
                              style={{ borderColor: "var(--border-light)" }}
                              value={draft.area_insight ?? ""}
                              onChange={(e) => updateDraft(listing.id, "area_insight", e.target.value)}
                            />
                          </EditField>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSave(listing.id)}
                            disabled={saving}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border hover:bg-black/[0.02] transition-colors disabled:opacity-50"
                            style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
                          >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save changes
                          </button>
                          <Link
                            to={`/property/${listing.id}`}
                            target="_blank"
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            View public page <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          {saveMessage && (
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{saveMessage}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: "var(--border-light)",
        background: accent ? "var(--color-primary)" : "var(--bg-card)",
      }}
    >
      <p className="text-2xl font-semibold" style={{ color: accent ? "white" : "var(--text-primary)" }}>
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: accent ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
