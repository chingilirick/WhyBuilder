import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Link as LinkIcon, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { getCurrentUser } from "../../lib/auth";
import { submitProperty } from "../../lib/properties";
import type { NoiseLevel } from "../../lib/database.types";

const PROPERTY_TYPES = ["Apartment", "House", "Townhouse", "Studio", "Villa"] as const;
const NOISE_LEVELS = ["Quiet", "Moderate", "Lively"] as const;
const LIFESTYLE_OPTIONS = ["Quiet living", "Social areas", "Work-friendly zones"] as const;

type ImageMode = "url" | "upload";

interface FormState {
  title: string;
  description: string;
  address: string;
  area: string;
  city: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  sizeSqft: string;
  propertyType: string;
  safetyScore: string;
  noiseLevel: string;
  commuteRating: string;
  lifestyleTags: string[];
  areaInsight: string;
  imageUrl: string;
  imageFile: File | null;
  imageMode: ImageMode;
}

const INITIAL_FORM: FormState = {
  title: "", description: "", address: "", area: "", city: "",
  price: "", bedrooms: "", bathrooms: "", sizeSqft: "",
  propertyType: "Apartment", safetyScore: "", noiseLevel: "Moderate",
  commuteRating: "", lifestyleTags: [], areaInsight: "",
  imageUrl: "", imageFile: null, imageMode: "url",
};

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

export default function ListingSubmission() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleTagToggle(tag: string) {
    setForm((prev) => ({
      ...prev,
      lifestyleTags: prev.lifestyleTags.includes(tag)
        ? prev.lifestyleTags.filter((t) => t !== tag)
        : [...prev.lifestyleTags, tag],
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // Guard: must be logged in as landlord
    const user = await getCurrentUser();

    if (!user) {
      setSubmitError("You must be logged in to submit a listing. Please sign in and try again.");
      setSubmitting(false);
      return;
    }

    if (user.account_type !== "landlord") {
      setSubmitError("Only landlord accounts can submit properties. Please sign in with a landlord account.");
      setSubmitting(false);
      return;
    }

    const { error } = await submitProperty({
      landlordId: user.id,
      title: form.title,
      description: form.description,
      address: form.address,
      area: form.area,
      city: form.city,
      priceKes: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      sizeSqft: form.sizeSqft ? Number(form.sizeSqft) : null,
      propertyType: form.propertyType,
      safetyScore: Number(form.safetyScore),
      noiseLevel: form.noiseLevel.toLowerCase() as NoiseLevel,
      commuteRating: Number(form.commuteRating),
      lifestyleTags: form.lifestyleTags,
      areaInsight: form.areaInsight,
      imageFile: form.imageFile,
      imageUrl: form.imageUrl,
    });

    setSubmitting(false);

    if (error) {
      setSubmitError("Something went wrong submitting your listing. Please check your details and try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
          <CheckCircle className="w-14 h-14 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Listing submitted</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your property has been submitted for verification. The WhyBuilder team will review it
            and publish it once verified. This usually takes 1–2 business days.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setForm(INITIAL_FORM); setSubmitted(false); setSubmitError(null); }}
              className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Submit another
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              My listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page header */}
      <div className="bg-primary text-white py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl mb-1">Submit a property</h1>
          <p className="text-white/70 text-sm">
            Fill in the details below. Your listing will go live after WhyBuilder verifies it.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Property details ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Property details</h2>
            <Field label="Title">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Modern 2-bed apartment in Westlands"
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe the property honestly — what makes it a good home?"
                className={`${inputClass} resize-none`}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Property type">
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className={inputClass}>
                  {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Price per month (KES)">
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 45000"
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Bedrooms">
                <input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange} required placeholder="2" className={inputClass} />
              </Field>
              <Field label="Bathrooms">
                <input name="bathrooms" type="number" min="1" step="0.5" value={form.bathrooms} onChange={handleChange} required placeholder="1" className={inputClass} />
              </Field>
              <Field label="Size (sqft)">
                <input name="sizeSqft" type="number" value={form.sizeSqft} onChange={handleChange} placeholder="950" className={inputClass} />
              </Field>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Location</h2>
            <Field label="Full address">
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="e.g. 14 Lenana Road"
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Area / neighbourhood">
                <input name="area" value={form.area} onChange={handleChange} required placeholder="e.g. Westlands" className={inputClass} />
              </Field>
              <Field label="City">
                <input name="city" value={form.city} onChange={handleChange} required placeholder="e.g. Nairobi" className={inputClass} />
              </Field>
            </div>
          </div>

          {/* ── Decision data ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Decision data</h2>
            <p className="text-xs text-gray-400">
              This is what makes WhyBuilder different. Be honest — renters use this data to make real decisions.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Safety score (0–100)" hint="Your honest assessment of the area's safety">
                <input
                  name="safetyScore"
                  type="number"
                  min="0"
                  max="100"
                  value={form.safetyScore}
                  onChange={handleChange}
                  required
                  placeholder="85"
                  className={inputClass}
                />
              </Field>
              <Field label="Commute rating (0–100)" hint="How easy is it to commute from here?">
                <input
                  name="commuteRating"
                  type="number"
                  min="0"
                  max="100"
                  value={form.commuteRating}
                  onChange={handleChange}
                  required
                  placeholder="80"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Noise level">
              <div className="flex gap-2">
                {NOISE_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, noiseLevel: level }))}
                    className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                      form.noiseLevel === level
                        ? "bg-primary text-white border-primary"
                        : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Lifestyle tags">
              <div className="flex gap-2 flex-wrap">
                {LIFESTYLE_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      form.lifestyleTags.includes(tag)
                        ? "bg-primary text-white border-primary"
                        : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Area insight" hint="One sentence describing who this area is best for">
              <textarea
                name="areaInsight"
                value={form.areaInsight}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. This area is best for young professionals who value walkability and nightlife"
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>

          {/* ── Property photo ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Property photo</h2>
            <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1 w-fit">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, imageMode: "url" }))}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  form.imageMode === "url" ? "bg-white shadow text-primary" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, imageMode: "upload" }))}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  form.imageMode === "upload" ? "bg-white shadow text-primary" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload photo
              </button>
            </div>

            {form.imageMode === "url" ? (
              <Field label="Image URL" hint="Paste an Unsplash URL or any direct image link">
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="/images/placeholders/property-placeholder.svg"
                  className={inputClass}
                />
                {form.imageUrl && (
                  <div className="mt-3 h-48 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </Field>
            ) : (
              <Field label="Upload photo" hint="JPG or PNG. Max 5MB. Will be stored in WhyBuilder's image library.">
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors bg-gray-50">
                  <Upload className="w-6 h-6 text-gray-300 mb-2" />
                  <span className="text-sm text-gray-400">
                    {form.imageFile ? form.imageFile.name : "Click to choose a file"}
                  </span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
                {form.imageFile && (
                  <div className="mt-3 h-48 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(form.imageFile)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Field>
            )}
          </div>

          {/* ── Error banner ── */}
          {submitError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* ── Submit button ── */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Submitting..." : "Submit for verification"}
          </button>

        </form>
      </div>
    </div>
  );
}