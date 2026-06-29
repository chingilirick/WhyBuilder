import { useCurrencyContext } from "../context/CurrencyContext";

export function CurrencyToggle() {
  const { currency, setCurrency, usdToKes, rateDate, loading } = useCurrencyContext();

  const tooltipText = loading
    ? "Loading live rate..."
    : `1 USD = KES ${usdToKes.toFixed(2)} · Rate as of ${rateDate}`;

  return (
    <div
      className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5"
      title={tooltipText}
    >
      <button
        onClick={() => setCurrency("KES")}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
          currency === "KES"
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        KES
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
          currency === "USD"
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        USD
      </button>
    </div>
  );
}