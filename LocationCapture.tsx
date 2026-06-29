import { useState } from 'react'
import { MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface LocationData {
  latitude: number
  longitude: number
  address: string
  accuracy: string
}

interface LocationCaptureProps {
  onLocationCaptured: (location: LocationData) => void
  buttonText?: string
}

export function LocationCapture({ onLocationCaptured, buttonText = 'Use my current location' }: LocationCaptureProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          const response = await fetch('/api/properties/location/capture/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('whybuilder_token')}`
            },
            body: JSON.stringify({
              latitude,
              longitude,
              location_accuracy: 'gps'
            })
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Failed to save location')
          }

          setSuccess(true)
          setLoading(false)

          onLocationCaptured({
            latitude,
            longitude,
            address: data.data.address || 'Address found',
            accuracy: 'gps'
          })

          setTimeout(() => setSuccess(false), 3000)

        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to capture location')
          setLoading(false)
        }
      },
      (err) => {
        setError(err.message || 'Location access denied')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={getLocation}
        disabled={loading}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-2.5 
          rounded-lg text-sm font-medium transition-all duration-200
          ${loading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : success 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10'
          }
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Capturing location...
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Location captured!
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4" />
            {buttonText}
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-gray-400">
        We'll use your device's GPS to get the exact property location
      </p>
    </div>
  )
}
