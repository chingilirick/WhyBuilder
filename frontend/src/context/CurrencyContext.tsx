import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'KES' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  format: (amount: number) => string;
  convert: (amount: number) => number;
  availableCurrencies: Currency[];
  exchangeRates: Record<Currency, number>;
}

const DEFAULT_RATES: Record<Currency, number> = {
  KES: 1,
  USD: 129.50,
  EUR: 140.00,
  GBP: 165.00,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('whybuilder_currency') as Currency) || 'KES';
  });
  
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(DEFAULT_RATES);
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>(() => {
    try {
      const stored = localStorage.getItem('wb_currencies');
      if (stored) return JSON.parse(stored);
    } catch {}
    return ['KES', 'USD'];
  });

  useEffect(() => {
    localStorage.setItem('whybuilder_currency', currency);
  }, [currency]);

  // Listen for admin currency changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('wb_currencies');
        if (stored) setAvailableCurrencies(JSON.parse(stored));
        const rate = localStorage.getItem('wb_usd_rate');
        if (rate) {
          const usdRate = parseFloat(rate);
          setExchangeRates({
            KES: 1,
            USD: usdRate,
            EUR: usdRate * 1.08,
            GBP: usdRate * 1.27,
          });
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const convert = (amountInKes: number): number => {
    if (currency === 'KES') return amountInKes;
    const rate = exchangeRates[currency];
    return amountInKes / rate;
  };

  const format = (amountInKes: number): string => {
    const converted = convert(amountInKes);
    const symbol = currency === 'KES' ? 'KES' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 0,
    });
    return `${symbol}${currency !== 'KES' ? '' : ' '}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency, setCurrency, format, convert,
      availableCurrencies, exchangeRates,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencyContext() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrencyContext must be used within CurrencyProvider');
  return ctx;
}
