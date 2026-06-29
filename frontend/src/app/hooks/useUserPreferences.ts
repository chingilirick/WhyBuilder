import { useState, useEffect, useCallback } from "react";
import { preferences as prefsApi } from "../../lib/api";
import { getCurrentUser } from "../../lib/auth";

export interface UserPreferences {
  lifestyleTags: string[];
  noiseLevel: "Quiet" | "Moderate" | "Lively" | null;
}

const PREF_KEY = "whybuilder_preferences";

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>({
    lifestyleTags: [],
    noiseLevel: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();

    // Load from API if logged in, else from localStorage
    if (user) {
      prefsApi.get().then(({ data }) => {
        if (data) {
          setPrefs({
            lifestyleTags: data.lifestyle_tags ?? [],
            noiseLevel: (data.noise_level as UserPreferences["noiseLevel"]) ?? null,
          });
        }
        setLoading(false);
      });
    } else {
      try {
        const local = localStorage.getItem(PREF_KEY);
        if (local) setPrefs(JSON.parse(local));
      } catch {}
      setLoading(false);
    }
  }, []);

  const savePreferences = useCallback(async (newPrefs: UserPreferences) => {
    setPrefs(newPrefs);
    const user = getCurrentUser();

    if (user) {
      const { error } = await prefsApi.save({
        lifestyleTags: newPrefs.lifestyleTags,
        noiseLevel: newPrefs.noiseLevel,
      });
      return !error;
    } else {
      localStorage.setItem(PREF_KEY, JSON.stringify(newPrefs));
      return true;
    }
  }, []);

  return { preferences: prefs, loading, savePreferences };
}