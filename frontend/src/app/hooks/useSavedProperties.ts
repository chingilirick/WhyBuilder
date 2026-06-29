import { useState, useEffect, useCallback } from "react";
import { saved } from "../../lib/api";
import { getCurrentUser } from "../../lib/auth";

export function useSavedProperties() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    saved.list().then(({ data }) => {
      if (data) setSavedIds(new Set(data.map((p) => p.id)));
      setLoading(false);
    });
  }, []);

  const saveProperty = useCallback(async (propertyId: string) => {
    const user = getCurrentUser();
    if (!user) {
      window.location.href =
        "/auth?mode=login&redirect=" +
        encodeURIComponent(window.location.pathname);
      return false;
    }
    const { error } = await saved.save(propertyId);
    if (!error) {
      setSavedIds((prev) => new Set([...prev, propertyId]));
      return true;
    }
    return false;
  }, []);

  const unsaveProperty = useCallback(async (propertyId: string) => {
    const { error } = await saved.remove(propertyId);
    if (!error) {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
      return true;
    }
    return false;
  }, []);

  const toggleSave = useCallback(
    async (propertyId: string) => {
      return savedIds.has(propertyId)
        ? unsaveProperty(propertyId)
        : saveProperty(propertyId);
    },
    [savedIds, saveProperty, unsaveProperty]
  );

  const isSaved = useCallback(
    (propertyId: string) => savedIds.has(propertyId),
    [savedIds]
  );

  return { savedIds, loading, saveProperty, unsaveProperty, toggleSave, isSaved };
}