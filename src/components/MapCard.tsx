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

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      setUserLocation([latitude, longitude])
      
      try {
        const query = `
          [out:json][timeout:25];
          (
            node(around:5000,${latitude},${longitude})[amenity=hospital];
            node(around:5000,${latitude},${longitude})[amenity=clinic];
            node(around:5000,${latitude},${longitude})[amenity=doctors];
          );
          out body;
        `
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `data=${encodeURIComponent(query)}`
        })
        
        if (!response.ok) throw new Error('Failed to fetch places')
        
        const data = await response.json()
        if (data.elements) {
          setPlaces(data.elements.slice(0, 10))
        }
      } catch (error) {
        console.error('Error fetching places:', error)
      }
    })
  }, [])

  if (!userLocation) return null

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
    </motion.div>
  )
}