import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ShieldCheck, Crown, CheckCircle, Star, Zap } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function getToken() {
    return localStorage.getItem("whybuilder_token");
}

export default function UpgradeSubscription() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [upgrading, setUpgrading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [currentTier, setCurrentTier] = useState<string>("free");

    useEffect(() => {
        async function fetchCurrentTier() {
            const token = getToken();
            if (!token) return;
            
            try {
                const res = await fetch(`${API_URL}/landlord/subscription`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCurrentTier(data.tier);
                }
            } catch (err) {
                console.error("Failed to fetch subscription:", err);
            }
        }
        fetchCurrentTier();
    }, []);

    const handleUpgrade = async (tier: string) => {
        setUpgrading(tier);
        setError(null);
        setSuccess(null);
        
        const token = getToken();
        if (!token) {
            setError("Please login first");
            navigate("/auth?mode=login");
            return;
        }
        
        try {
            const res = await fetch(`${API_URL}/landlord/upgrade`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ tier, payment_ref: `SIMULATED_${Date.now()}` })
            });
            
            if (res.ok) {
                setSuccess(`Successfully upgraded to ${tier === 'verified' ? 'Verified Landlord' : 'Premium Landlord'} tier!`);
                setCurrentTier(tier);
            } else {
                const data = await res.json();
                setError(data.error || "Upgrade failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }
        
        setUpgrading(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <h1 className="text-3xl font-serif mb-2">Upgrade Your Listing Power</h1>
                    <p className="text-white/70">Get more visibility, faster verification, and better analytics</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-10">
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Free Tier */}
                    <div className="bg-white rounded-2xl border p-6">
                        <div className="text-center mb-4">
                            <ShieldCheck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <h3 className="text-xl font-bold">Free</h3>
                            <p className="text-3xl font-bold mt-2">KES 0</p>
                            <p className="text-xs text-gray-400">/month</p>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Up to 3 listings</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>72hr verification</span>
                            </div>
                        </div>
                        {currentTier === 'free' && (
                            <div className="text-center py-2 bg-gray-100 rounded-lg text-sm">Current Plan</div>
                        )}
                    </div>

                    {/* Verified Tier */}
                    <div className="bg-white rounded-2xl border-2 border-secondary p-6 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-3 py-0.5 rounded-full text-xs">
                            MOST POPULAR
                        </div>
                        <div className="text-center mb-4">
                            <CheckCircle className="w-10 h-10 text-secondary mx-auto mb-2" />
                            <h3 className="text-xl font-bold">Verified Landlord</h3>
                            <p className="text-3xl font-bold mt-2">KES 3,000</p>
                            <p className="text-xs text-gray-400">/month</p>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Up to 20 listings</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>24hr verification</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Contact renters directly</span>
                            </div>
                        </div>
                        {currentTier === 'verified' ? (
                            <div className="text-center py-2 bg-green-100 text-green-700 rounded-lg text-sm">Current Plan</div>
                        ) : (
                            <button
                                onClick={() => handleUpgrade('verified')}
                                disabled={upgrading === 'verified'}
                                className="w-full py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 disabled:opacity-50"
                            >
                                {upgrading === 'verified' ? 'Processing...' : 'Upgrade to Verified'}
                            </button>
                        )}
                    </div>

                    {/* Premium Tier */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6">
                        <div className="text-center mb-4">
                            <Crown className="w-10 h-10 text-accent mx-auto mb-2" />
                            <h3 className="text-xl font-bold">Premium Landlord</h3>
                            <p className="text-3xl font-bold mt-2">KES 10,000</p>
                            <p className="text-xs text-gray-400">/month</p>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Unlimited listings</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>4hr verification</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Featured placement</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Star className="w-4 h-4 text-accent" />
                                <span>Priority support</span>
                            </div>
                        </div>
                        {currentTier === 'premium' ? (
                            <div className="text-center py-2 bg-primary/10 text-primary rounded-lg text-sm">Current Plan</div>
                        ) : (
                            <button
                                onClick={() => handleUpgrade('premium')}
                                disabled={upgrading === 'premium'}
                                className="w-full py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50"
                            >
                                {upgrading === 'premium' ? 'Processing...' : 'Upgrade to Premium'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button onClick={() => navigate("/dashboard")} className="text-primary hover:underline text-sm">
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
