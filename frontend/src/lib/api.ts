const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const TOKEN_KEY = "whybuilder_token";

export const token = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  const t = token.get();

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...options?.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: data.error || data.detail || `HTTP ${res.status}`,
      };
    }

    if (data && typeof data === "object" && "results" in data) {
      return { data: data.results, error: null };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export type AccountType = "renter" | "landlord" | "administrator";
export type ListingStatus = "pending" | "verified" | "rejected";
export type NoiseLevel = "quiet" | "moderate" | "lively";

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  account_type: AccountType;
  phone_number?: string;
  trust_score: number;
  response_rate: number;
  total_listings: number;
  verified_listings_count: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  area: string;
  city: string;
  price_per_month: number;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number | null;
  property_type: string;
  listing_status: ListingStatus;
  safety_score: number;
  noise_level: string;
  commute_rating: number;
  lifestyle_tags: string[];
  area_insight: string | null;
  image_url: string | null;
  landlord_id: string;
  landlord_name?: string | null;
  landlord_email?: string | null;
  landlord_phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location_accuracy?: string;
  created_at: string;
  verified_at: string | null;
  images?: { id: string; image_url: string; display_order: number }[];
}

export interface SubmitPropertyData {
  landlordId: string;
  title: string;
  description: string;
  address: string;
  area: string;
  city: string;
  priceKes: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number | null;
  propertyType: string;
  safetyScore: number;
  noiseLevel: NoiseLevel;
  commuteRating: number;
  lifestyleTags: string[];
  areaInsight: string;
  imageFile: File | null;
  imageUrl: string;
  latitude?: number | null;
  longitude?: number | null;
  location_accuracy?: string;
}

export const auth = {
  getCurrentUser(): User | null {
    const t = token.get();
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      return {
        id: payload.user_id || payload.id,
        email: payload.email || "",
        username: payload.username || "",
        full_name: payload.full_name || "",
        account_type: payload.account_type || "renter",
        trust_score: 50,
        response_rate: 0,
        total_listings: 0,
        verified_listings_count: 0,
      };
    } catch {
      token.remove();
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await request<{ user: User; token: string; refresh: string }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
    });
    if (error || !data) return { user: null, error: error || "Login failed" };
    token.set(data.token);
    return { user: data.user, error: null };
  },

  async signUp(
    email: string,
    password: string,
    fullName: string,
    accountType: AccountType
  ): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await request<{ user: User; token: string; refresh: string }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        username: email,
        email,
        password,
        full_name: fullName,
        account_type: accountType,
      }),
    });
    if (error || !data) return { user: null, error: error || "Signup failed" };
    token.set(data.token);
    return { user: data.user, error: null };
  },

  async resetPassword(email: string): Promise<{ error: string | null }> {
    return { error: "Password reset not implemented yet" };
  },

  signOut() {
    token.remove();
  },
};

export const properties = {
  async list(params?: {
    area?: string;
    lifestyle?: string;
    noise?: string;
    minBudget?: number;
    maxBudget?: number;
    limit?: number;
  }): Promise<{ data: Property[]; error: string | null }> {
    const q = new URLSearchParams();
    if (params?.area) q.set("area", params.area);
    if (params?.lifestyle) q.set("lifestyle", params.lifestyle);
    if (params?.noise) q.set("noise", params.noise);
    if (params?.minBudget) q.set("minBudget", String(params.minBudget));
    if (params?.maxBudget) q.set("maxBudget", String(params.maxBudget));
    if (params?.limit) q.set("limit", String(params.limit));

    const { data, error } = await request<Property[]>(`/properties/${q.toString() ? `?${q}` : ""}`);
    return { data: data ?? [], error };
  },

  async get(id: string): Promise<{ data: Property | null; error: string | null }> {
    return request<Property>(`/properties/${id}/`);
  },

  async submit(data: SubmitPropertyData): Promise<{ data: Property | null; error: string | null }> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("address", data.address);
    formData.append("area", data.area);
    formData.append("city", data.city);
    formData.append("price_per_month", String(data.priceKes));
    formData.append("bedrooms", String(data.bedrooms));
    formData.append("bathrooms", String(data.bathrooms));
    formData.append("property_type", data.propertyType);
    formData.append("safety_score", String(data.safetyScore));
    formData.append("noise_level", data.noiseLevel);
    formData.append("commute_rating", String(data.commuteRating));
    formData.append("lifestyle_tags", JSON.stringify(data.lifestyleTags));
    formData.append("area_insight", data.areaInsight);

    if (data.sizeSqft) {
      formData.append("size_sqft", String(data.sizeSqft));
    }

    if (data.latitude !== undefined && data.latitude !== null) {
      formData.append("latitude", String(data.latitude));
    }
    if (data.longitude !== undefined && data.longitude !== null) {
      formData.append("longitude", String(data.longitude));
    }
    if (data.location_accuracy) {
      formData.append("location_accuracy", data.location_accuracy);
    }

    if (data.imageFile) {
      formData.append("image", data.imageFile);
    } else if (data.imageUrl) {
      formData.append("image_url", data.imageUrl);
    }

    const t = token.get();
    try {
      const res = await fetch(`${API_URL}/properties/create/`, {
        method: "POST",
        headers: {
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
        },
        body: formData,
      });

      const responseData = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: responseData.error || responseData.detail || `HTTP ${res.status}`,
        };
      }

      return { data: responseData, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Network error",
      };
    }
  },

  async save(propertyId: string): Promise<{ error: string | null }> {
    const { error } = await request(`/properties/${propertyId}/save/`, { method: "POST" });
    return { error };
  },

  async unsave(propertyId: string): Promise<{ error: string | null }> {
    const { error } = await request(`/properties/${propertyId}/unsave/`, { method: "DELETE" });
    return { error };
  },

  async listByLandlord(landlordId: string): Promise<{ data: Property[]; error: string | null }> {
    const { data, error } = await request<Property[]>(`/properties/?landlord_id=${landlordId}`);
    return { data: data ?? [], error };
  },

  async listAll(): Promise<{ data: Property[]; error: string | null }> {
    const { data, error } = await request<Property[]>("/properties/all/");
    return { data: data ?? [], error };
  },

  async updateStatus(propertyId: string, status: ListingStatus): Promise<{ error: string | null }> {
    const { error } = await request(`/properties/${propertyId}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ listing_status: status }),
    });
    return { error };
  },
};

export const saved = {
  async list(): Promise<{ data: Property[]; error: string | null }> {
    const { data, error } = await request<Property[]>("/saved/");
    return { data: data ?? [], error };
  },

  async save(propertyId: string): Promise<{ error: string | null }> {
    return properties.save(propertyId);
  },

  async remove(propertyId: string): Promise<{ error: string | null }> {
    return properties.unsave(propertyId);
  },
};

export const preferences = {
  async get(): Promise<{ data: { lifestyle_tags: string[]; noise_level: string | null } | null; error: string | null }> {
    return request("/preferences/");
  },

  async save(data: { lifestyleTags: string[]; noiseLevel: string | null }): Promise<{ error: string | null }> {
    const { error } = await request("/preferences/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { error };
  },
};

export const areas = {
  async list(): Promise<{ data: { area: string; count: number }[]; error: string | null }> {
    return request("/areas/");
  },

  async neighbourhood(area: string): Promise<{ data: any; error: string | null }> {
    return request(`/neighbourhood/${encodeURIComponent(area)}/`);
  },
};

export const hero = {
  async get(): Promise<{ data: { id: string; image_url: string; area: string; label: string }[]; error: string | null }> {
    return request("/hero-slides/");
  },
};

export const PLACEHOLDER_IMAGE = "/images/placeholders/property-placeholder.svg";
export const PLACEHOLDER_ICON = "/images/placeholders/icon-placeholder.svg";

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/images/")) return url;
  return PLACEHOLDER_IMAGE;
}

export const landlords = {
  async get(id: string): Promise<{ data: any; error: string | null }> {
    return request(`/landlords/${id}/`);
  },
  async list(): Promise<{ data: any[]; error: string | null }> {
    return request("/landlords/");
  }
};

export const neighbourhood = {
  async get(area: string): Promise<{ data: any; error: string | null }> {
    return request(`/properties/neighbourhood/${encodeURIComponent(area)}/`);
  }
};

export const notifications = {
  async list(): Promise<{ data: any[]; error: string | null }> {
    return request("/notifications/");
  },
  async markRead(id: string): Promise<{ error: string | null }> {
    return request(`/notifications/${id}/read/`, { method: "POST" });
  }
};

export interface ImageUploadResult {
  created_ids: number[];
  total_images: number;
  meets_minimum: boolean;
}

export async function uploadPropertyImages(
  propertyId: string,
  files: File[]
): Promise<{ data: ImageUploadResult | null; error: string | null }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const t = token.get();
  try {
    const res = await fetch(`${API_URL}/properties/${propertyId}/images/`, {
      method: "POST",
      headers: {
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      body: formData,
    });
    const responseData = await res.json();
    if (!res.ok) {
      return { data: null, error: responseData.error || responseData.detail || `HTTP ${res.status}` };
    }
    return { data: responseData, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function deletePropertyImage(
  propertyId: string,
  imageId: number
): Promise<{ error: string | null }> {
  const t = token.get();
  try {
    const res = await fetch(`${API_URL}/properties/${propertyId}/images/${imageId}/`, {
      method: "DELETE",
      headers: {
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
    });
    if (!res.ok) {
      const responseData = await res.json().catch(() => ({}));
      return { error: responseData.error || responseData.detail || `HTTP ${res.status}` };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}

export const admin = {
  async getPendingListings(): Promise<{ data: Property[] | null; error: string | null }> {
    return request<Property[]>("/properties/pending/");
  },

  async verifyListing(
    id: string,
    action: "approved" | "rejected"
  ): Promise<{ data: Property | null; error: string | null }> {
    return request<Property>(`/properties/${id}/verify/`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    });
  },

  async updateListing(
    id: string,
    fields: Partial<Property>
  ): Promise<{ data: Property | null; error: string | null }> {
    return request<Property>(`/properties/${id}/update/`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    });
  },
};
