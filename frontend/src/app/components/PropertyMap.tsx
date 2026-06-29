// Maps without API key complexity using embedded Google Maps

interface PropertyMapProps {
  address: string;
  area: string;
  city: string;
}

export function PropertyMap({ address, area, city }: PropertyMapProps) {
  const fullAddress = `${address}, ${area}, ${city}, Kenya`;
  const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}&q=${encodeURIComponent(fullAddress)}`;
  const fallbackUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  const finalUrl = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? mapsUrl : fallbackUrl;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <iframe
        title="Property Location Map"
        width="100%"
        height="300"
        frameBorder="0"
        style={{ border: 0 }}
        src={finalUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      />
    </div>
  );
}