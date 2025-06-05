import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2 as Hospital, ChevronRight, AlertCircle } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import toast from 'react-hot-toast'

// Create custom marker icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Create custom marker icon for hospitals
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface Place {
  lat: number
  lon: number
  tags: {
    name?: string
    amenity: string
  }
}

export default function MapCard() {
  const navigate = useNavigate()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    const locationSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords
      setUserLocation([latitude, longitude])
      
      try {
        // Fetch nearby hospitals using Overpass API
        const query = `
          [out:json][timeout:25];
          (
            node(around:2000,${latitude},${longitude})[amenity=hospital];
            node(around:2000,${latitude},${longitude})[amenity=clinic];
          );
          out body;
        `
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(query)}`
        })
        
        if (!response.ok) throw new Error('Failed to fetch places')
        
        const data = await response.json()
        if (data.elements && data.elements.length > 0) {
          setPlaces(data.elements)
        } else {
          toast.error('No healthcare centers found nearby')
        }
      } catch (error) {
        console.error('Error fetching places:', error)
        toast.error('Failed to load nearby healthcare centers')
      } finally {
        setLoading(false)
      }
    }

    const locationError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error)
      let errorMessage = 'Could not access your location. '
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Please enable location services in your browser settings.'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information is unavailable.'
          break
        case error.TIMEOUT:
          errorMessage += 'Location request timed out.'
          break
        default:
          errorMessage += 'An unknown error occurred.'
      }
      
      setError(errorMessage)
      setLoading(false)
      toast.error('Location access required to show nearby centers')
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, options)
  }, [])

  if (error) {
    return (
      <div className="card bg-gradient-to-br from-red-50 to-red-100/50">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">
            Location Access Required
          </h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary bg-red-600 hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center mb-4">
        <Hospital className="w-6 h-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">
          Nearby Healthcare Centers
        </h2>
      </div>

      {userLocation ? (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden shadow-md">
            <MapContainer
              center={userLocation}
              zoom={14}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User location marker */}
              <Marker position={userLocation} icon={userIcon}>
                <Popup>
                  <div className="font-medium">You are here</div>
                </Popup>
              </Marker>

              {/* Hospital markers */}
              {places.map((place, index) => (
                <Marker
                  key={index}
                  position={[place.lat, place.lon]}
                  icon={hospitalIcon}
                >
                  <Popup>
                    <div className="font-medium">
                      {place.tags.name || 'Healthcare Center'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {place.tags.amenity.charAt(0).toUpperCase() + place.tags.amenity.slice(1)}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <motion.button
            onClick={() => navigate('/nearby-healthcare')}
            className="btn-primary bg-gradient-to-r from-primary to-secondary
                     hover:from-primary/90 hover:to-secondary/90 
                     shadow-lg hover:shadow-primary/20
                     flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Full Map
            <ChevronRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[250px]">
          <motion.div
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  )
}