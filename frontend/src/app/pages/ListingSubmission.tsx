import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, X, CheckCircle, Loader2, AlertCircle, ImageIcon } from "lucide-react";
import { getCurrentUser } from "../../lib/auth";
import { submitProperty, uploadPropertyImages } from "../../lib/properties";
import type { NoiseLevel } from "../../lib/api";

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 20;

const PROPERTY_TYPES = ["Apartment", "House", "Townhouse", "Studio", "Villa"] as const;
const NOISE_LEVELS = ["Quiet", "Moderate", "Lively"] as const;
const LIFESTYLE_OPTIONS = ["Quiet living", "Social areas", "Work-friendly zones"] as const;

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
  photos: File[];
}

const INITIAL_FORM: FormState = {
  title: "", description: "", address: "", area: "", city: "",
  price: "", bedrooms: "", bathrooms: "", sizeSqft: "",
  propertyType: "Apartment", safetyScore: "", noiseLevel: "Moderate",
  commuteRating: "", lifestyleTags: [], areaInsight: "",
  photos: [],
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

  function handleFilesAdded(files: FileList | null) {
    if (!files) return;
    const incoming = Array.from(files);
    setForm((prev) => {
      const combined = [...prev.photos, ...incoming].slice(0, MAX_PHOTOS);
      return { ...prev, photos: combined };
    });
  }

  function removePhoto(index: number) {
    setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
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

    if (form.photos.length < MIN_PHOTOS) {
      setSubmitError(`Please add at least ${MIN_PHOTOS} photos. You currently have ${form.photos.length}.`);
      setSubmitting(false);
      return;
    }

    const { data: property, error } = await submitProperty({
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
      imageFile: null,
      imageUrl: "",
    });

    if (error || !property) {
      setSubmitting(false);
      setSubmitError("Something went wrong submitting your listing. Please check your details and try again.");
      return;
    }

    const { error: uploadError } = await uploadPropertyImages(property.id, form.photos);

    setSubmitting(false);

    if (uploadError) {
      setSubmitError(
        `Your listing was created, but photo upload failed: ${uploadError}. Go to "My listings" to add photos and complete your submission.`
      );
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

        {/* — Property photos — */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Property photos</h2>
            <span className={`text-xs font-medium ${form.photos.length >= MIN_PHOTOS ? "text-secondary" : "text-amber-600"}`}>
              {form.photos.length} of {MIN_PHOTOS} minimum
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Add at least {MIN_PHOTOS} photos covering different rooms and angles (max {MAX_PHOTOS}).
            JPG, PNG, or WebP. Each photo must be at least 800x600px. Photos are reviewed before your listing goes live.
          </p>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors bg-gray-50">
            <Upload className="w-6 h-6 text-gray-300 mb-2" />
            <span className="text-sm text-gray-400">Click to add photos, or drag them here</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => handleFilesAdded(e.target.files)}
              className="hidden"
            />
          </label>

          {form.photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {form.photos.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/90 text-gray-700">
                      Cover photo
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {form.photos.length === 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ImageIcon className="w-3.5 h-3.5" />
              No photos added yet
            </div>
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