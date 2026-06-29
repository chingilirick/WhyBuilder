import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface HeroSlide {
  id: number;
  image_url: string;
  area: string;
  label: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

function getToken() {
  return localStorage.getItem("whybuilder_token");
}

export function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    image_url: "",
    area: "",
    label: "",
    sort_order: 0,
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSlides = async () => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/admin/hero-slides`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAddModal = () => {
    setEditingSlide(null);
    setFormData({ image_url: "", area: "", label: "", sort_order: slides.length + 1, active: true });
    setShowModal(true);
    setError(null);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      image_url: slide.image_url,
      area: slide.area,
      label: slide.label,
      sort_order: slide.sort_order,
      active: slide.active,
    });
    setShowModal(true);
    setError(null);
  };

  const saveSlide = async () => {
    if (!formData.image_url || !formData.area || !formData.label) {
      setError("Image URL, area, and label are required");
      return;
    }

    setSaving(true);
    setError(null);
    const token = getToken();

    try {
      if (editingSlide) {
        await fetch(`${API_URL}/admin/hero-slides/${editingSlide.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        setSuccess("Slide updated");
      } else {
        await fetch(`${API_URL}/admin/hero-slides`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        setSuccess("Slide added");
      }
      setShowModal(false);
      fetchSlides();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save slide");
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (id: number) => {
    if (!confirm("Delete this slide? This cannot be undone.")) return;
    const token = getToken();
    try {
      await fetch(`${API_URL}/admin/hero-slides/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlides();
    } catch (err) {
      setError("Failed to delete slide");
    }
  };

  const moveSlide = async (id: number, direction: "up" | "down") => {
    const currentIndex = slides.findIndex(s => s.id === id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[currentIndex], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[currentIndex]];
    
    const token = getToken();
    for (let i = 0; i < newSlides.length; i++) {
      await fetch(`${API_URL}/admin/hero-slides/${newSlides[i].id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sort_order: i + 1 }),
      });
    }
    fetchSlides();
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading slides...</div>;
  }

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid rgba(0,0,0,0.07)", padding: "20px", marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Hero Slides</h3>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0" }}>Manage homepage carousel slides</p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", background: "var(--color-primary)", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
          }}
        >
          <Plus size={14} /> Add slide
        </button>
      </div>

      {success && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: "#ECFDF5", borderRadius: 8, fontSize: 12, color: "#065F46" }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: "#FEF2F2", borderRadius: 8, fontSize: 12, color: "#991B1B" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", background: "#FAFAFA", borderRadius: 10,
              border: "0.5px solid rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={slide.image_url}
              alt=""
              style={{ width: 60, height: 45, borderRadius: 8, objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/60x45?text=Error"; }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{slide.area}</p>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>{slide.label}</p>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => moveSlide(slide.id, "up")}
                disabled={idx === 0}
                style={{
                  padding: "6px", background: "none", border: "none", cursor: idx === 0 ? "not-allowed" : "pointer",
                  opacity: idx === 0 ? 0.3 : 1,
                }}
              >
                <ChevronUp size={16} color="#6B7280" />
              </button>
              <button
                onClick={() => moveSlide(slide.id, "down")}
                disabled={idx === slides.length - 1}
                style={{
                  padding: "6px", background: "none", border: "none", cursor: idx === slides.length - 1 ? "not-allowed" : "pointer",
                  opacity: idx === slides.length - 1 ? 0.3 : 1,
                }}
              >
                <ChevronDown size={16} color="#6B7280" />
              </button>
              <button
                onClick={() => openEditModal(slide)}
                style={{ padding: "6px", background: "none", border: "none", cursor: "pointer" }}
              >
                <Edit2 size={14} color="var(--color-primary)" />
              </button>
              <button
                onClick={() => deleteSlide(slide.id)}
                style={{ padding: "6px", background: "none", border: "none", cursor: "pointer" }}
              >
                <Trash2 size={14} color="#EF4444" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
          No slides yet. Click "Add slide" to create your first hero image.
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px", width: "90%", maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                {editingSlide ? "Edit Slide" : "Add New Slide"}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>
                  Image URL *
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: "100%", padding: "10px", border: "0.5px solid #D1D5DB", borderRadius: 8, fontSize: 13 }}
                />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>
                  Area *
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g., Karen, Nairobi"
                  style={{ width: "100%", padding: "10px", border: "0.5px solid #D1D5DB", borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>
                  Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Family living · Safe · Quiet"
                  style={{ width: "100%", padding: "10px", border: "0.5px solid #D1D5DB", borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 12 }}>Active (visible on homepage)</span>
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                onClick={saveSlide}
                disabled={saving}
                style={{
                  flex: 1, padding: "10px", background: "var(--color-primary)", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : (editingSlide ? "Update Slide" : "Add Slide")}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px", background: "#F3F4F6", color: "#374151",
                  border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
