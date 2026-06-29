import { useState, useEffect, useCallback } from "react";

type Currency = "KES" | "USD";

const STORAGE_KEY = "whybuilder_currency";
const RATE_CACHE_KEY = "whybuilder_fx_rate";
const RATE_CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface RateCache {
  rate: number;
  fetchedAt: number;
}

async function fetchUSDToKES(): Promise<number> {
  try {
    const cached = localStorage.getItem(RATE_CACHE_KEY);
    if (cached) {
      const parsed: RateCache = JSON.parse(cached);
      if (Date.now() - parsed.fetchedAt < RATE_CACHE_TTL) {
        return parsed.rate;
      }
    }
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    const rate: number = data.rates.KES;
    localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate, fetchedAt: Date.now() }));
    return rate;
  } catch {
    return 129.50; // Fallback rate
  }
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>(
    () => (localStorage.getItem(STORAGE_KEY) as Currency) ?? "KES"
  );
  const [usdToKes, setUsdToKes] = useState<number>(129.50);
  const [rateDate, setRateDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUSDToKES().then((rate) => {
      setUsdToKes(rate);
      setRateDate(
        new Date().toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
      setLoading(false);
    });
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

  // Convert price from KES (database) to selected currency
  const convert = useCallback(
    (priceInKes: number | string | undefined | null): number => {
      // Guard against invalid values
      if (priceInKes === undefined || priceInKes === null) {
        return 0;
      }
      
      const numPrice = typeof priceInKes === 'string' ? parseFloat(priceInKes) : priceInKes;
      
      if (isNaN(numPrice)) {
        return 0;
      }
      
      if (currency === "KES") {
        return numPrice;
      }
      
      // Convert KES to USD
      return Math.round(numPrice / usdToKes);
    },
    [currency, usdToKes]
  );

  const format = useCallback(
    (priceInKes: number | string | undefined | null): string => {
      const amount = convert(priceInKes);
      
      if (currency === "KES") {
        return "KES " + amount.toLocaleString("en-KE");
      }
      return "$" + amount.toLocaleString("en-US");
    },
    [convert, currency]
  );

  return { currency, setCurrency, format, convert, usdToKes, rateDate, loading };
}