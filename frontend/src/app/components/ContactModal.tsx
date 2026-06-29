
import { useState } from "react";
import { X, Phone, Mail, MessageCircle, Copy, Check } from "lucide-react";

interface ContactModalProps {
  landlord: {
    id: string;
    full_name: string;
    phone_number?: string;
    email: string;
  };
  propertyTitle: string;
  onClose: () => void;
}

export function ContactModal({ landlord, propertyTitle, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

  const sanitizedPhone = landlord.phone_number?.replace(/\D/g, "");
  const whatsappUrl = sanitizedPhone
    ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(
        `Hi ${landlord.full_name}, I'm interested in "${propertyTitle}" from WhyBuilder. Could we arrange a viewing?`
      )}`
    : null;

  const handleCopyPhone = () => {
    if (landlord.phone_number) {
      navigator.clipboard.writeText(landlord.phone_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contact {landlord.full_name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Property: {propertyTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contact options */}
        <div className="p-5 space-y-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-green-800">WhatsApp</div>
                  <div className="text-xs text-green-600">Quick response</div>
                </div>
              </div>
              <span className="text-green-600 text-sm group-hover:translate-x-1 transition-transform">→</span>
            </a>
          )}

          {landlord.phone_number && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-blue-800">Phone call</div>
                  <div className="text-xs text-blue-600">{landlord.phone_number}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyPhone}
                  className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Copy number"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                </button>
                <a
                  href={`tel:${landlord.phone_number}`}
                  className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                </a>
              </div>
            </div>
          )}

          <a
            href={`mailto:${landlord.email}?subject=Interested in ${propertyTitle} on WhyBuilder&body=Hi ${landlord.full_name},%0D%0A%0D%0AI came across your property "${propertyTitle}" on WhyBuilder and I'm interested in learning more.%0D%0A%0D%0ACould you please let me know:%0D%0A- When would be a good time for a viewing?%0D%0A- Are there any additional costs (security deposit, maintenance)?%0D%0A%0D%0AThank you,%0D%0A[Your name]`}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Email</div>
                <div className="text-xs text-gray-500">{landlord.email}</div>
              </div>
            </div>
            <span className="text-gray-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Footer note */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-400 text-center">
            Your contact information will be shared with the landlord when you reach out.
          </p>
        </div>
      </div>
    </div>
  );
}