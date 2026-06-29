import { createContext, useContext, ReactNode } from "react";
import { useCurrency } from "../hooks/useCurrency";

type CurrencyContextType = ReturnType<typeof useCurrency>;

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currency = useCurrency();
  return (
    <CurrencyContext.Provider value={currency}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencyContext() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrencyContext must be used inside CurrencyProvider");
  return ctx;
}