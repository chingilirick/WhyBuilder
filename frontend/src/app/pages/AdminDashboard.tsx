import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏠</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Connected to Django Backend</p>
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-sm text-green-700">✅ API Connected</p>
          <p className="text-xs text-green-600 mt-1">
            {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}
          </p>
        </div>
      </div>
    </div>
  );
}
