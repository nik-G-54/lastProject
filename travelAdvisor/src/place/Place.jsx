import { useEffect, useMemo, useRef, useState } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'

import Header from '../components/Header'
import List from '../components/List'
import Map from '../components/Map'
import { getPlacesData, getWeatherData } from '../api/travelAdvisor'
import Navbar from '../Scomponent/Navbar'

const libraries = ['places']

const Place = () => {
  const [type, setType] = useState('restaurants')
  const [rating, setRating] = useState('')

  const [coords, setCoords] = useState(null)
  const [bounds, setBounds] = useState(null)

  const [places, setPlaces] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [weather, setWeather] = useState(null)

  const [selectedPlaceId, setSelectedPlaceId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY ?? ''
  const hasGoogleApiKey = Boolean(googleApiKey)

  console.log(' Google Maps API Key:', googleApiKey ? 'Present' : 'Missing')
  console.log(' Has Google API Key:', hasGoogleApiKey)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
    libraries,
  })

  console.log(' Maps loaded:', isLoaded)
  console.log(' Load error:', loadError)

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: 40.7128, lng: -74.006 })
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: location }) => {
        setCoords({ lat: location.latitude, lng: location.longitude })
      },
      () => setCoords({ lat: 40.7128, lng: -74.006 }),
    )
  }, [])

  // Filter places based on rating - if no rating selected, show all places
  useEffect(() => {
    if (!rating) {
      // If no rating filter, show all places
      setFilteredPlaces([])
      return
    }

    // Filter by rating
    const filtered = places.filter((place) => {
      const placeRating = Number(place.rating)
      const minRating = Number(rating)
      return placeRating >= minRating && !isNaN(placeRating)
    })
    
    console.log(`🔍 Rating filter applied: ${rating}+, showing ${filtered.length} of ${places.length} places`)
    setFilteredPlaces(filtered)
  }, [rating, places])

  // Store previous bounds to prevent duplicate API calls
  const prevBoundsRef = useRef(null)
  const prevTypeRef = useRef(null)

  useEffect(() => {
    console.log(' Data fetch effect triggered')
    console.log(' Current bounds:', bounds)
    console.log(' Current coords:', coords)
    console.log(' Current type:', type)

    if (!bounds?.ne || !bounds?.sw) {
      console.warn('⚠️ Missing bounds, skipping data fetch')
      return
    }
    if (!coords?.lat || !coords?.lng) {
      console.warn('⚠️ Missing coordinates, skipping data fetch')
      return
    }

    // Check if bounds or type actually changed to prevent unnecessary API calls
    const boundsChanged = !prevBoundsRef.current || 
      JSON.stringify(prevBoundsRef.current) !== JSON.stringify(bounds)
    const typeChanged = !prevTypeRef.current || prevTypeRef.current !== type

    if (!boundsChanged && !typeChanged) {
      console.log('⏭️ Skipping API call - bounds and type unchanged')
      return
    }

    console.log('⏳ Starting data fetch in 3s...')
    const timeout = setTimeout(() => {
      // Double-check bounds haven't changed during timeout
      if (JSON.stringify(prevBoundsRef.current) === JSON.stringify(bounds) && 
          prevTypeRef.current === type && 
          prevBoundsRef.current !== null) {
        console.log('⏭️ Skipping API call - bounds changed during timeout')
        return
      }

      console.log('🚀 Fetching places data...')
      console.log('📍 Fetch params:', {
        type,
        sw: bounds.sw,
        ne: bounds.ne,
        coords: { lat: coords.lat, lng: coords.lng },
      })
      
      prevBoundsRef.current = bounds
      prevTypeRef.current = type
      setIsLoading(true)

      Promise.all([
        getPlacesData(type, bounds.sw, bounds.ne),
        getWeatherData(coords.lat, coords.lng),
      ])
        .then(([placesData, weatherData]) => {
          console.log('✅ Places data received:', placesData?.length || 0, 'items')
          console.log('✅ Weather data received:', weatherData ? 'Yes' : 'No')
          
          const sanitized = (placesData ?? []).filter(
            (place) => place.name && Number(place.num_reviews) > 0,
          )
          const MAX_PLACES = 20
          const limitedPlaces = sanitized.slice(0, MAX_PLACES)

          console.log(`✅ Filtered & Limited places: ${limitedPlaces.length} of ${sanitized.length}`)

          setPlaces(limitedPlaces)
          setWeather(weatherData)
          // Don't reset selectedPlaceId if user selected something
        })
        .catch((error) => {
          console.error('❌ Failed to load data:', error)
          console.error('❌ Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          })
        })
        .finally(() => {
          console.log('✅ Data fetch completed')
          setIsLoading(false)
        })
    }, 3000) // wait 3s after user stops moving/zooming map (debounce) - increased to reduce API calls

    return () => {
      console.log('🧹 Cleaning up timeout')
      clearTimeout(timeout)
    }
  }, [bounds, type, coords?.lat, coords?.lng])


  const handleAutocompleteLoad = () => {
    // Placeholder for future use if needed
  }

  const handlePlaceChanged = async (event) => {
    console.log('🔍 Place changed event:', event)
    try {
      let location = null
      
      // For gmp-place-autocomplete, the event has placePrediction
      if (event.placePrediction) {
        console.log('📍 Using placePrediction path')
        const place = await event.placePrediction.toPlace()
        console.log('📍 Place object:', place)
        
        // Fetch location field from the Place object
        await place.fetchFields({ fields: ['location', 'viewport'] })
        location = place.location
        
        if (!location) {
          console.warn('⚠️ No location found in place')
          return
        }
      }
      // For PlaceAutocompleteElement, the event has place directly
      else if (event.place) {
        console.log('📍 Using place path')
        const place = event.place
        
        // Fetch location and viewport fields from the Place object
        await place.fetchFields({ fields: ['location', 'viewport'] })
        location = place.location
        
        if (!location) {
          console.warn('⚠️ No location found in place')
          return
        }
      } else {
        console.warn('⚠️ Unknown event structure:', event)
        return
      }

      const newCoords = { lat: location.lat, lng: location.lng }
      console.log('📍 Setting coords to:', newCoords)
      
      // Update coordinates
      setCoords(newCoords)
      
      // Reset selected place when searching new location
      setSelectedPlaceId(null)
      
      // Reset previous bounds ref to force new API call with new location
      prevBoundsRef.current = null
      
      // Force map to zoom out and set bounds for new location
      // This will trigger the data fetch with current type and rating filters
      console.log('🔍 Search completed - map will update with current filters (type:', type, ', rating:', rating || 'all', ')')
      
    } catch (error) {
      console.error('❌ Error getting place details:', error)
      console.error('❌ Error stack:', error.stack)
    }
  }

  // Display places: if rating filter is active and has results, use filtered; otherwise use all places
  const displayPlaces = useMemo(() => {
    if (rating && filteredPlaces.length > 0) {
      console.log(`📋 Showing ${filteredPlaces.length} filtered places (rating: ${rating}+)`)
      return filteredPlaces
    }
    if (rating && filteredPlaces.length === 0) {
      console.log(`📋 No places match rating filter: ${rating}+`)
      return []
    }
    console.log(`📋 Showing all ${places.length} places (no rating filter)`)
    return places
  }, [filteredPlaces, places, rating])

  const enhancedPlaces = useMemo(
    () =>
      displayPlaces.map((place, index) => ({
        ...place,
        uid:
          place.location_id ||
          `${place.latitude ?? 'lat'}-${place.longitude ?? 'lng'}-${index}`,
        index,
      })),
    [displayPlaces],
  )

  const handleManualSearch = async (query) => {
    try {
      if (!query) return
      if (!window.google?.maps?.Geocoder) return
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const loc = results[0].geometry.location
          const newCoords = { lat: loc.lat(), lng: loc.lng() }
          setCoords(newCoords)
          setSelectedPlaceId(null)
          prevBoundsRef.current = null
        } else {
          console.warn('Geocoding failed:', status)
        }
      })
    } catch (error) {
      console.error('❌ Manual search error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <Header
        isLoaded={isLoaded}
        hasError={Boolean(loadError) || !hasGoogleApiKey}
        onLoad={handleAutocompleteLoad}
        onPlaceChanged={handlePlaceChanged}
        onManualSearch={handleManualSearch}
      />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          <List
            places={enhancedPlaces}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
          />

          <Map
            isLoaded={isLoaded}
            hasError={Boolean(loadError) || !hasGoogleApiKey}
            coords={coords}
            places={enhancedPlaces}
            setCoords={setCoords}
            setBounds={setBounds}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
            weather={weather}
          />
        </div>
      </main>
    </div>
  )
}

export default Place


