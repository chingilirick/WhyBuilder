import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { getImageUrl } from "../../../lib/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"\;

interface Neighbourhood {
  id: string;
  name: string;
  slug: string;
  tag: string;
  safety_score: number;
  noise_level: string;
  listings: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

function getToken() {
  return localStorage.getItem("whybuilder_token");
}

export function NeighbourhoodsManager() {
  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Neighbourhood | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tag: "",
    safety_score: 0,
    noise_level: "Moderate",
    listings: 0,
    image_url: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/admin/neighbourhoods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNeighbourhoods(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load neighbourhoods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      slug: "",
      tag: "",
      safety_score: 0,
      noise_level: "Moderate",
      listings: 0,
      image_url: "",
      active: true,
    });
    setShowModal(true);
    setError(null);
  };

  const openEditModal = (item: Neighbourhood) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      tag: item.tag,
      safety_score: item.safety_score,
      noise_level: item.noise_level,
      listings: item.listings,
      image_url: item.image_url || "",
      active: item.active,
    });
    setShowModal(true);
    setError(null);
  };

  const saveItem = async () => {
    if (!formData.name || !formData.slug || !formData.tag) {
      setError("Name, slug, and tag are required");
      return;
    }

    setSaving(true);
    setError(null);
    const token = getToken();

    try {
      if (editingItem) {
        await fetch(`${API_URL}/admin/neighbourhoods/${editingItem.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        setSuccess("Neighbourhood updated");
      } else {
        await fetch(`${API_URL}/admin/neighbourhoods`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        setSuccess("Neighbourhood added");
      }
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this neighbourhood? This cannot be undone.")) return;
    const token = getToken();
    try {
      await fetch(`${API_URL}/admin/neighbourhoods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      setError("Failed to delete");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading neighbourhoods...</div>;
  }

  return (
    <div className="bg-white rounded-xl border p-5 mt-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-semibold">Neighbourhoods</h3>
          <p className="text-xs text-gray-400">Manage homepage neighbourhood cards</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs"
        >
          <Plus size={12} /> Add neighbourhood
        </button>
      </div>

      {success && <div className="mb-3 p-2 bg-green-50 text-green-700 rounded text-xs">{success}</div>}
      {error && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-xs">{error}</div>}

      <div className="space-y-2">
        {neighbourhoods.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden flex-shrink-0">
              <img src={getImageUrl(item.image_url)} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-400">{item.tag} · {item.listings} listings</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEditModal(item)} className="p-1.5 hover:bg-gray-200 rounded">
                <Edit2 size={14} />
              </button>
              <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:bg-red-100 rounded">
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{editingItem ? "Edit" : "Add"} Neighbourhood</h3>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s/g, '-')})} className="w-full p-2 border rounded text-sm" />
              <input type="text" placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded text-sm" />
              <input type="text" placeholder="Tag (e.g., Urban professionals)" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full p-2 border rounded text-sm" />
              <input type="number" placeholder="Safety Score" value={formData.safety_score} onChange={e => setFormData({...formData, safety_score: Number(e.target.value)})} className="w-full p-2 border rounded text-sm" />
              <select value={formData.noise_level} onChange={e => setFormData({...formData, noise_level: e.target.value})} className="w-full p-2 border rounded text-sm">
                <option>Quiet</option>
                <option>Moderate</option>
                <option>Lively</option>
              </select>
              <input type="number" placeholder="Listing Count" value={formData.listings} onChange={e => setFormData({...formData, listings: Number(e.target.value)})} className="w-full p-2 border rounded text-sm" />
              <input type="text" placeholder="Image URL" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-2 border rounded text-sm" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={saveItem} disabled={saving} className="flex-1 py-2 bg-primary text-white rounded text-sm">{saving ? "Saving..." : "Save"}</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
