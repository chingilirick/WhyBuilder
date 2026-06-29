import { useParams, Link } from "react-router";
import { ArrowLeft, MapPin } from "lucide-react";

export default function Neighbourhood() {
  const { areaName } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{areaName}</h1>
        <p className="text-gray-500 mb-6">Neighbourhood data is being prepared.</p>
        <Link to="/browse" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to browse
        </Link>
      </div>
    </div>
  );
}
