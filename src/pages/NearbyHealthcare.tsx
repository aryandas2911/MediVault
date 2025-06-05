import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Guitar as Hospital, Pill, Building2, ChevronDown, X, Navigation } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import toast from 'react-hot-toast'

type PlaceType = 'all' | 'hospital' | 'clinic' | 'pharmacy'

interface Place {
  id: string
  lat: number
  lon: number
  tags: {
    name?: string
    amenity: string
    [key: string]: string | undefined
  }
}

const placeTypes = [
  { id: 'all', label: 'Show All', icon: MapPin },
  { id: 'hospital', label: 'Hospitals', icon: Hospital },
  { id: 'clinic', label: 'Clinics', icon: Building2 },
  { id: 'pharmacy', label: 'Pharmacies', icon: Pill }
]

// Custom marker icons
const createIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const icons = {
  hospital: createIcon('red'),
  clinic: createIcon('blue'),
  pharmacy: createIcon('green'),
  default: createIcon('blue')
}

export default function NearbyHealthcare() {
  const navigate = useNavigate()
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedType, setSelectedType] = useState<PlaceType>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation([latitude, longitude])
        
        try {
          const query = `
            [out:json];
            (
              node(around:2000,${latitude},${longitude})[amenity=hospital];
              node(around:2000,${latitude},${longitude})[amenity=clinic];
              node(around:2000,${latitude},${longitude})[amenity=doctors];
              node(around:2000,${latitude},${longitude})[amenity=pharmacy];
            );
            out;
          `
          const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`
          })
          
          if (!response.ok) throw new Error('Failed to fetch places')
          
          const data = await response.json()
          setPlaces(data.elements)
        } catch (error) {
          console.error('Error fetching places:', error)
          toast.error('Failed to load nearby healthcare centers')
          setError('Failed to load nearby places')
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        setError('Failed to get your location. Please enable location services.')
        setLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }, [])

  const getIcon = (amenity: string) => {
    if (amenity === 'hospital') return icons.hospital
    if (amenity === 'clinic' || amenity === 'doctors') return icons.clinic
    if (amenity === 'pharmacy') return icons.pharmacy
    return icons.default
  }

  const filteredPlaces = places.filter(place => {
    if (selectedType === 'all') return true
    if (selectedType === 'hospital') return place.tags.amenity === 'hospital'
    if (selectedType === 'clinic') return place.tags.amenity === 'clinic' || place.tags.amenity === 'doctors'
    if (selectedType === 'pharmacy') return place.tags.amenity === 'pharmacy'
    return true
  })

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-white">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </motion.button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Nearby Hospitals & Clinics
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Find medical help near your location instantly
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-4">
              {placeTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as PlaceType)}
                  className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300
                           ${selectedType === type.id
                             ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                             : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <type.icon className="w-5 h-5 mr-2" />
                  {type.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          {error ? (
            <div className="text-center py-12 bg-red-50 rounded-xl">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Location Access Required
              </h3>
              <p className="text-gray-600">
                {error}
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : userLocation ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <MapContainer
                center={userLocation}
                zoom={15}
                className="map-fullscreen"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* User location marker */}
                <Marker
                  position={userLocation}
                  icon={createIcon('blue')}
                >
                  <Popup>
                    <div className="font-medium">You are here</div>
                  </Popup>
                </Marker>

                {/* Place markers */}
                {filteredPlaces.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lon]}
                    icon={getIcon(place.tags.amenity)}
                  >
                    <Popup>
                      <div className="font-medium">
                        {place.tags.name || place.tags.amenity}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {place.tags.amenity.charAt(0).toUpperCase() + place.tags.amenity.slice(1)}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
          ) : null}
        </main>
        <Footer />
      </div>
    </PageTransition>
  )
}