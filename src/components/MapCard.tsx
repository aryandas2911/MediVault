import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2 as Hospital, ChevronRight } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false)
      return
    }

    const locationSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords
      setUserLocation([latitude, longitude])
      
      try {
        // Fetch nearby places using Overpass API
        const radius = 5000 // 5km radius
        const query = `
          [out:json][timeout:90];
          (
            node(around:${radius},${latitude},${longitude})[amenity=hospital];
            node(around:${radius},${latitude},${longitude})[amenity=clinic];
            node(around:${radius},${latitude},${longitude})[amenity=doctors];
          );
          out body;
          >;
          out skel qt;
        `
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: `data=${encodeURIComponent(query)}`
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (data.elements && data.elements.length > 0) {
          // Sort places by distance from user
          const placesWithDistance = data.elements.map((place: Place) => ({
            ...place,
            distance: calculateDistance(latitude, longitude, place.lat, place.lon)
          })).sort((a: any, b: any) => a.distance - b.distance)
          
          setPlaces(placesWithDistance.slice(0, 10)) // Show closest 10 places
        }
      } catch (error) {
        console.error('Error fetching places:', error)
      } finally {
        setLoading(false)
      }
    }

    const locationError = () => {
      setLoading(false)
    }

    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    })
  }, [])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  if (!userLocation && !loading) {
    return null
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

      {userLocation && (
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
              
              <Marker position={userLocation} icon={userIcon}>
                <Popup>
                  <div className="font-medium">You are here</div>
                </Popup>
              </Marker>

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
      )}
    </motion.div>
  )
}