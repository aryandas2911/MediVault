import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2 as Hospital, ChevronRight, AlertCircle } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import toast from 'react-hot-toast'

// Create custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function MapCard() {
  const navigate = useNavigate()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Could not access your location. Please enable location services.')
          toast.error('Location access required to show nearby centers')
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
    }
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
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={userLocation} icon={customIcon}>
                <Popup>
                  You are here
                </Popup>
              </Marker>
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