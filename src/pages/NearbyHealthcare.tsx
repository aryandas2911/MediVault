import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, MapPin, Cross, Pill, Building2, ChevronDown, 
  X, Navigation, ExternalLink, AlertTriangle 
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import toast from 'react-hot-toast'

type PlaceType = 'all' | 'hospital' | 'clinic' | 'pharmacy'
type MapTheme = 'default' | 'dark' | 'light'

interface Place {
  id: string
  lat: number
  lon: number
  distance?: string
  tags: {
    name?: string
    amenity: string
    [key: string]: string | undefined
  }
}

const placeTypes = [
  { id: 'all', label: 'Show All', icon: MapPin },
  { id: 'hospital', label: 'Hospitals', icon: Cross },
  { id: 'clinic', label: 'Clinics', icon: Building2 },
  { id: 'pharmacy', label: 'Pharmacies', icon: Pill }
]

const mapThemes = {
  default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
}

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

function MapThemeControl({ theme, onChange }: { theme: MapTheme, onChange: (theme: MapTheme) => void }) {
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <select
        value={theme}
        onChange={(e) => onChange(e.target.value as MapTheme)}
        className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm"
      >
        <option value="default">Default Theme</option>
        <option value="dark">Dark Theme</option>
        <option value="light">Light Theme</option>
      </select>
    </div>
  )
}

function ZoomToMarker({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(position, 16)
  }, [map, position])
  return null
}

export default function NearbyHealthcare() {
  const navigate = useNavigate()
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedType, setSelectedType] = useState<PlaceType>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [mapTheme, setMapTheme] = useState<MapTheme>('default')
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)

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
          const placesWithDistance = data.elements.map((place: Place) => ({
            ...place,
            distance: calculateDistance(latitude, longitude, place.lat, place.lon)
          }))
          setPlaces(placesWithDistance)
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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const d = R * c
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`
  }

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
  }).sort((a, b) => {
    const distA = parseFloat(a.distance?.replace(/[^\d.]/g, '') || '0')
    const distB = parseFloat(b.distance?.replace(/[^\d.]/g, '') || '0')
    return distA - distB
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

          {/* Main Content */}
          <div className="relative grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
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
                  className="rounded-xl overflow-hidden shadow-lg relative"
                >
                  <MapContainer
                    center={userLocation}
                    zoom={15}
                    className="map-fullscreen"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url={mapThemes[mapTheme]}
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
                          <div className="text-sm text-primary mt-1">
                            {place.distance} away
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {selectedPlace && (
                      <ZoomToMarker 
                        position={[
                          places.find(p => p.id === selectedPlace)?.lat || userLocation[0],
                          places.find(p => p.id === selectedPlace)?.lon || userLocation[1]
                        ]} 
                      />
                    )}
                  </MapContainer>

                  <MapThemeControl theme={mapTheme} onChange={setMapTheme} />

                  {/* Mobile Toggle Sidebar Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="lg:hidden absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg"
                    onClick={() => setShowSidebar(!showSidebar)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showSidebar ? (
                      <X className="w-6 h-6 text-gray-600" />
                    ) : (
                      <Navigation className="w-6 h-6 text-primary" />
                    )}
                  </motion.button>
                </motion.div>
              ) : null}
            </div>

            {/* List View */}
            <AnimatePresence>
              {(showSidebar || !loading) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`lg:block ${showSidebar ? 'block' : 'hidden'}`}
                >
                  <div className="card overflow-auto max-h-[600px]">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Nearby Places
                      {filteredPlaces.length > 0 && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({filteredPlaces.length} found)
                        </span>
                      )}
                    </h2>
                    
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : filteredPlaces.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No places found nearby
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredPlaces.map((place, index) => (
                          <motion.div
                            key={place.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-xl transition-all duration-300 cursor-pointer
                                    ${selectedPlace === place.id
                                      ? 'bg-primary/5 ring-2 ring-primary'
                                      : 'bg-gray-50 hover:bg-gray-100'}`}
                            onClick={() => setSelectedPlace(place.id)}
                          >
                            <h3 className="font-medium text-gray-900">
                              {place.tags.name || place.tags.amenity}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-primary">
                                {place.distance}
                              </span>
                              {place.tags.amenity && (
                                <span className={`text-sm ${
                                  place.tags.amenity === 'hospital' ? 'text-red-600' :
                                  place.tags.amenity === 'pharmacy' ? 'text-green-600' :
                                  'text-blue-600'
                                }`}>
                                  {place.tags.amenity.charAt(0).toUpperCase() + place.tags.amenity.slice(1)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedPlace(place.id)
                                }}
                                className="text-primary hover:text-primary-dark text-sm flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                View on Map
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  )
}