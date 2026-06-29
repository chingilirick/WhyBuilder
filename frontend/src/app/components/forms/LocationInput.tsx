import { useState } from 'react'
import { MapPin, Search, Loader2, X } from 'lucide-react'
import { LocationCapture } from './LocationCapture'

interface LocationData {
  latitude: number | null
  longitude: number | null
  address: string
  accuracy: string
}

interface LocationInputProps {
  value: LocationData
  onChange: (location: LocationData) => void
  label?: string
  required?: boolean
}

export function LocationInput({ value, onChange, label = 'Property Location', required = false }: LocationInputProps) {
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState<string | null>(null)

  const handleAddressChange = (address: string) => {
    onChange({
      ...value,
      address
    })
  }

  const geocodeAddress = async () => {
    if (!value.address.trim()) {
      setGeocodeError('Please enter an address first')
      return
    }

    setGeocoding(true)
    setGeocodeError(null)

    try {
      const response = await fetch('/api/properties/geocode/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address: value.address })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Address not found')
      }

      onChange({
        ...value,
        latitude: parseFloat(data.data.latitude),
        longitude: parseFloat(data.data.longitude),
        accuracy: data.data.accuracy
      })

    } catch (err) {
      setGeocodeError(err instanceof Error ? err.message : 'Failed to geocode address')
    } finally {
      setGeocoding(false)
    }
  }

  const clearLocation = () => {
    onChange({
      latitude: null,
      longitude: null,
      address: '',
      accuracy: 'unknown'
    })
  }

  const hasLocation = value.latitude !== null && value.longitude !== null

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={value.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Enter property address"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            {geocoding && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={geocodeAddress}
            disabled={geocoding || !value.address.trim()}
            className="px-4 py-2.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {geocodeError && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
            {geocodeError}
          </div>
        )}

        <LocationCapture
          onLocationCaptured={(location) => {
            onChange({
              latitude: location.latitude,
              longitude: location.longitude,
              address: location.address || value.address,
              accuracy: location.accuracy
            })
          }}
        />

        {hasLocation && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Location captured</p>
                <p className="text-xs text-green-600">
                  {value.latitude?.toFixed(6)}, {value.longitude?.toFixed(6)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearLocation}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
