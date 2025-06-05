import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader } from '@googlemaps/js-api-loader'
import { ArrowLeft, MapPin, Hospital, Pill, Building2, ChevronDown, X, Navigation, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import toast from 'react-hot-toast'

type PlaceType = 'all' | 'hospital' | 'clinic' | 'pharmacy'
type Place = google.maps.places.PlaceResult & {
  distance?: string
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const placeTypes = [
  { id: 'all', label: 'Show All', icon: MapPin },
  { id: 'hospital', label: 'Hospitals', icon: Hospital },
  { id: 'clinic', label: 'Clinics', icon: Building2 },
  { id: 'pharmacy', label: 'Pharmacies', icon: Pill }
]

export default function NearbyHealthcare() {
  const navigate = useNavigate()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedType, setSelectedType] = useState<PlaceType>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSidebar, setShowSidebar] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  const initMap = useCallback(async (position: GeolocationPosition) => {
    try {
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      })

      const { Map } = await loader.importLibrary('maps')
      const { PlacesService } = await loader.importLibrary('places')

      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      const mapInstance = new Map(mapRef.current!, {
        center: currentLocation,
        zoom: 14,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Add current location marker
      new google.maps.Marker({
        position: currentLocation,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#1A73E8',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        title: 'Your Location'
      })

      setMap(mapInstance)
      infoWindowRef.current = new google.maps.InfoWindow()

      // Search for nearby places
      const service = new PlacesService(mapInstance)
      const searchTypes = ['hospital', 'doctor', 'pharmacy']
      
      const requests = searchTypes.map(type => new Promise((resolve) => {
        service.nearbySearch({
          location: currentLocation,
          radius: 5000,
          type
        }, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results)
          } else {
            resolve([])
          }
        })
      }))

      const allResults = await Promise.all(requests)
      const uniquePlaces = Array.from(new Set(allResults.flat())).slice(0, 20)

      // Calculate distances
      const placesWithDistance = uniquePlaces.map(place => ({
        ...place,
        distance: google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(currentLocation),
          new google.maps.LatLng(place.geometry!.location!)
        ).toFixed(0) + ' m'
      }))

      setPlaces(placesWithDistance)
      addMarkers(placesWithDistance, mapInstance)
    } catch (error) {
      console.error('Error initializing map:', error)
      setError('Failed to load map')
    } finally {
      setLoading(false)
    }
  }, [])

  const addMarkers = (places: Place[], map: google.maps.Map) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    places.forEach(place => {
      if (!place.geometry?.location) return

      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map,
        title: place.name,
        animation: google.maps.Animation.DROP,
        icon: {
          url: getMarkerIcon(place.types?.[0] || ''),
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      marker.addListener('click', () => {
        if (infoWindowRef.current && place.name) {
          const content = `
            <div class="p-4">
              <h3 class="font-semibold text-lg">${place.name}</h3>
              ${place.vicinity ? `<p class="text-gray-600 mt-1">${place.vicinity}</p>` : ''}
              ${place.rating ? `
                <div class="flex items-center mt-2">
                  <span class="text-amber-500">★</span>
                  <span class="ml-1">${place.rating}</span>
                  <span class="text-gray-400 ml-1">(${place.user_ratings_total})</span>
                </div>
              ` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name!)}"
                 target="_blank"
                 class="inline-flex items-center text-primary hover:text-primary-dark mt-3">
                Get Directions
                <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          `
          infoWindowRef.current.setContent(content)
          infoWindowRef.current.open(map, marker)
        }
      })

      markersRef.current.push(marker)
    })
  }

  const getMarkerIcon = (type: string): string => {
    switch (type) {
      case 'hospital':
        return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      case 'doctor':
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      case 'pharmacy':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      initMap,
      (error) => {
        console.error('Error getting location:', error)
        setError('Failed to get your location. Please enable location services.')
        setLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }, [initMap])

  const filterPlaces = (type: PlaceType) => {
    setSelectedType(type)
    if (!map || !places.length) return

    const filteredPlaces = type === 'all'
      ? places
      : places.filter(place => place.types?.includes(type))

    addMarkers(filteredPlaces, map)
  }

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

          {/* Filters - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex space-x-4 mb-6"
          >
            {placeTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => filterPlaces(type.id as PlaceType)}
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
          </motion.div>

          {/* Filters - Mobile */}
          <div className="md:hidden mb-6">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-xl shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                {placeTypes.find(t => t.id === selectedType)?.label || 'Filter Places'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100"
                >
                  {placeTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => {
                        filterPlaces(type.id as PlaceType)
                        setShowFilters(false)
                      }}
                      className={`flex items-center w-full px-4 py-3 transition-colors
                               ${selectedType === type.id
                                 ? 'bg-gradient-to-r from-primary to-secondary text-white'
                                 : 'text-gray-600 hover:bg-gray-50'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <type.icon className="w-5 h-5 mr-2" />
                      {type.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Content */}
          <div className="relative grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className={`lg:col-span-2 h-[600px] rounded-2xl overflow-hidden relative
                         ${loading ? 'bg-gray-100 animate-pulse' : ''}`}>
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center p-8">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Location Access Required
                    </h3>
                    <p className="text-gray-600">
                      {error}
                    </p>
                  </div>
                </div>
              ) : (
                <div ref={mapRef} className="w-full h-full" />
              )}

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
            </div>

            {/* Sidebar */}
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
                    ) : places.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No places found nearby
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {places.slice(0, 5).map((place, index) => (
                          <motion.div
                            key={place.place_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <h3 className="font-medium text-gray-900">
                              {place.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {place.vicinity}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-primary">
                                {place.distance}
                              </span>
                              {place.opening_hours?.open_now !== undefined && (
                                <span className={`text-sm ${
                                  place.opening_hours.open_now
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}>
                                  {place.opening_hours.open_now ? 'Open' : 'Closed'}
                                </span>
                              )}
                            </div>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name!)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-primary hover:text-primary-dark mt-2 text-sm"
                            >
                              Get Directions
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
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