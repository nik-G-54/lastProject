import { GoogleMap, InfoWindowF, MarkerF } from '@react-google-maps/api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import mapStyles from '../constants/mapStyles'

const containerClassName = 'h-full w-full'

const Map = ({
  isLoaded,
  hasError,
  coords,
  setCoords,
  setBounds,
  places,
  selectedPlaceId,
  onSelectPlace,
  weather,
}) => {
  const [mapRef, setMapRef] = useState(null)
  const [activeMarkerId, setActiveMarkerId] = useState(null)
  const [currentZoom, setCurrentZoom] = useState(14)
  const prevCoordsRef = useRef(null)

  // Handle coordinate changes (e.g., from search) - zoom out and update bounds
  useEffect(() => {
    if (!coords || !mapRef) return
    
    // Check if coords actually changed (to avoid unnecessary updates)
    const coordsStr = `${coords.lat},${coords.lng}`
    const prevCoordsStr = prevCoordsRef.current ? `${prevCoordsRef.current.lat},${prevCoordsRef.current.lng}` : null
    
    if (coordsStr === prevCoordsStr) return
    
    // Store previous coords before updating
    const prevCoords = prevCoordsRef.current
    prevCoordsRef.current = coords
    
    // If this is a new search location (significant change > 0.1 degrees), zoom out
    const isSearchAction = !prevCoords || 
      (Math.abs(coords.lat - prevCoords.lat) > 0.1 || 
       Math.abs(coords.lng - prevCoords.lng) > 0.1)
    
    if (isSearchAction) {
      console.log('🔍 New location detected - zooming out to show area')
      // Zoom out to show a wider area (zoom level 13 for city view)
      const searchZoom = 13
      setCurrentZoom(searchZoom)
      mapRef.setZoom(searchZoom)
      mapRef.panTo({ lat: coords.lat, lng: coords.lng })
      
      // Force bounds update after a short delay to ensure map has updated
      setTimeout(() => {
        if (mapRef) {
          const bounds = mapRef.getBounds()
          if (bounds) {
            const northEast = bounds.getNorthEast()
            const southWest = bounds.getSouthWest()
            const boundsData = {
              ne: { lat: northEast.lat(), lng: northEast.lng() },
              sw: { lat: southWest.lat(), lng: southWest.lng() },
            }
            console.log('🗺️ Updating bounds for search location:', boundsData)
            setBounds(boundsData)
          }
        }
      }, 500)
    }
  }, [coords, mapRef, setBounds])

  useEffect(() => {
    if (selectedPlaceId) {
      setActiveMarkerId(selectedPlaceId)
      
      // Center map on selected place
      const selectedPlace = places.find((place) => place.uid === selectedPlaceId)
      if (selectedPlace && mapRef && selectedPlace.latitude && selectedPlace.longitude) {
        const position = {
          lat: Number(selectedPlace.latitude),
          lng: Number(selectedPlace.longitude),
        }
        console.log('📍 Centering map on selected place:', selectedPlace.name)
        mapRef.panTo(position)
        // Zoom in slightly when selecting a place
        mapRef.setZoom(15)
      }
    } else {
      setActiveMarkerId(null)
    }
  }, [selectedPlaceId, places, mapRef])

  const handleLoad = useCallback((map) => {
    console.log('🗺️ Map loaded successfully')
    setMapRef(map)
    const zoom = map.getZoom()
    if (zoom>13) {
      setCurrentZoom(zoom)
      console.log('📍 Initial zoom level:', zoom)
    }
  }, [])

  const handleUnmount = useCallback(() => {
    console.log('🗺️ Map unmounted')
    setMapRef(null)
  }, [])

  // Store previous bounds to compare for significant changes
  const prevBoundsRef = useRef(null)

  // Helper function to check if bounds changed significantly (prevent minor updates)
  const hasSignificantChange = useCallback((newBounds, oldBounds) => {
    if (!oldBounds || !newBounds) return true

    // Threshold for significant change (approximately 1km at equator)
    const THRESHOLD = 0.01 // degrees

    const latDiff = Math.abs(newBounds.ne.lat - oldBounds.ne.lat) +
                    Math.abs(newBounds.sw.lat - oldBounds.sw.lat)
    const lngDiff = Math.abs(newBounds.ne.lng - oldBounds.ne.lng) +
                    Math.abs(newBounds.sw.lng - oldBounds.sw.lng)

    const hasSignificantLatChange = latDiff > THRESHOLD
    const hasSignificantLngChange = lngDiff > THRESHOLD

    return hasSignificantLatChange || hasSignificantLngChange
  }, [])

  const updateBounds = useCallback(() => {
    if (!mapRef) {
      console.warn('⚠️ Map ref not available')
      return
    }

    const newBounds = mapRef.getBounds()
    const newCenter = mapRef.getCenter()
    const newZoom = mapRef.getZoom()

    if (newCenter) {
      const centerCoords = { lat: newCenter.lat(), lng: newCenter.lng() }
      // Only update coords if they changed significantly (avoid minor drift)
      setCoords((prevCoords) => {
        if (!prevCoords) return centerCoords
        const latDiff = Math.abs(centerCoords.lat - prevCoords.lat)
        const lngDiff = Math.abs(centerCoords.lng - prevCoords.lng)
        const THRESHOLD = 0.001 // Very small threshold for center
        
        if (latDiff > THRESHOLD || lngDiff > THRESHOLD) {
          console.log('📍 Map center updated:', centerCoords)
          return centerCoords
        }
        return prevCoords
      })
    }

    if (newZoom !== undefined && newZoom !== currentZoom) {
      console.log('🔍 Zoom changed from', currentZoom, 'to', newZoom)
      setCurrentZoom(newZoom)
    }

    if (newBounds) {
      const northEast = newBounds.getNorthEast()
      const southWest = newBounds.getSouthWest()

      const boundsData = {
        ne: { lat: northEast.lat(), lng: northEast.lng() },
        sw: { lat: southWest.lat(), lng: southWest.lng() },
      }

      // Only update bounds if there's a significant change
      if (hasSignificantChange(boundsData, prevBoundsRef.current)) {
        console.log('🗺️ Bounds updated (significant change):', boundsData)
        prevBoundsRef.current = boundsData
        setBounds(boundsData)
      } else {
        console.log('⏭️ Skipping bounds update (minor change)')
      }
    }
  }, [mapRef, setBounds, currentZoom, hasSignificantChange])

  const handleIdle = useCallback(() => {
    console.log('⏸️ Map idle - updating bounds and fetching data')
    updateBounds()
    // This will trigger data fetch in Place.jsx via bounds change
  }, [updateBounds])

  // Remove immediate zoom trigger - only update on idle to prevent too many API calls
  const handleZoomChanged = useCallback(() => {
    if (!mapRef) return
    const newZoom = mapRef.getZoom()
    if (newZoom !== undefined && newZoom !== currentZoom) {
      console.log('🔍 Zoom changed from', currentZoom, 'to', newZoom, '- waiting for idle')
      setCurrentZoom(newZoom)
      // Don't trigger updateBounds immediately - let onIdle handle it
    }
  }, [mapRef, currentZoom])

  // Remove immediate drag end trigger - only update on idle
  const handleDragEnd = useCallback(() => {
    console.log('🖱️ Map drag ended - waiting for idle')
    // Don't trigger updateBounds immediately - let onIdle handle it
  }, [])

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      styles: mapStyles,
      clickableIcons: true,
    }),
    [],
  )

  const handleMarkerClick = (place) => {
    setActiveMarkerId(place.uid)
    onSelectPlace(place.uid)
  }

  if (hasError) {
    return (
      <section className="flex h-[75vh] items-center justify-center rounded-2xl border border-dashed border-red-200 bg-white text-sm text-red-600 shadow-sm">
        Add your Google Maps API key to preview the interactive map.
      </section>
    )
  }

  if (!isLoaded) {
    return (
      <section className="flex h-[75vh] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400 shadow-sm">
        Preparing the map experience…
      </section>
    )
  }

  if (!coords) {
    return (
      <section className="flex h-[75vh] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-400 shadow-sm">
        Allow location access or search for a place to get started.
      </section>
    )
  }

  const defaultCenter = {
    lat: Number(coords.lat) || 40.7128,
    lng: Number(coords.lng) || -74.006,
  }

  return (
    <section className="h-[75vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <GoogleMap
        mapContainerClassName={containerClassName}
        center={defaultCenter}
        zoom={currentZoom}
        options={mapOptions}
        onLoad={handleLoad}
        onUnmount={handleUnmount}
        onIdle={handleIdle}
        onZoomChanged={handleZoomChanged}
        onDragEnd={handleDragEnd}
      >
        {/* Only show selected place on map if one is selected, otherwise show all */}
        {(selectedPlaceId 
          ? places.filter((place) => place.uid === selectedPlaceId)
          : places
        )
          .filter((place) => Number(place.latitude) && Number(place.longitude))
          .map((place) => {
            const position = {
              lat: Number(place.latitude),
              lng: Number(place.longitude),
            }

            // Get image for custom marker icon
            const imageSrc = place.photo?.images?.thumbnail?.url || 
                            place.photo?.images?.small?.url ||
                            'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=100&q=80'
            
            // Create custom marker icon with image (circular badge style)
            const hasGoogle = typeof window !== 'undefined' && window.google && window.google.maps
            let markerIcon = undefined
            
            if (hasGoogle && imageSrc) {
              try {
                markerIcon = {
                  url: imageSrc,
                  scaledSize: new window.google.maps.Size(48, 48),
                  anchor: new window.google.maps.Point(24, 48),
                  shape: {
                    coords: [24, 24, 24],
                    type: 'circle'
                  }
                }
              } catch (error) {
                console.warn('Error creating marker icon:', error)
                markerIcon = undefined // Fallback to default marker
              }
            }

            return (
              <MarkerF
                key={place.uid}
                position={position}
                onClick={() => handleMarkerClick(place)}
                title={place.name}
                icon={markerIcon}
                animation={activeMarkerId === place.uid ? window.google?.maps?.Animation?.BOUNCE : undefined}
              >
                {activeMarkerId === place.uid && (
                  <InfoWindowF 
                    onCloseClick={() => {
                      setActiveMarkerId(null)
                      onSelectPlace(null)
                    }}
                    position={position}
                    options={window.google?.maps ? {
                      pixelOffset: new window.google.maps.Size(0, -10),
                    } : undefined}
                  >
                    <div className="max-w-[380px] p-1">
                      {/* Image with overlay gradient */}
                      {(place.photo?.images?.large?.url || place.photo?.images?.medium?.url) && (
                        <div className="relative mb-4 overflow-hidden rounded-xl shadow-md">
                          <img
                            src={place.photo?.images?.large?.url || place.photo?.images?.medium?.url}
                            alt={place.name}
                            className="h-52 w-full object-cover"
                            loading="lazy"
                          />
                          {/* Gradient overlay for better text readability if needed */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          {/* Open Now badge on image */}
                          {place.open_now_text && (
                            <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                              {place.open_now_text}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Name with better styling */}
                      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{place.name}</h3>
                      
                      {/* Rating and Reviews - Enhanced */}
                      {place.rating && (
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold text-amber-500">⭐</span>
                            <span className="text-base font-bold text-slate-800">
                              {Number(place.rating).toFixed(1)}
                            </span>
                          </div>
                          {place.num_reviews && (
                            <span className="text-sm text-slate-600">
                              ({place.num_reviews.toLocaleString()} review{Number(place.num_reviews) > 1 ? 's' : ''})
                            </span>
                          )}
                          {place.price_level && (
                            <span className="ml-auto text-sm font-semibold text-emerald-600">
                              {'$'.repeat(place.price_level)}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Ranking - Enhanced */}
                      {place.ranking && (
                        <div className="mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Ranking</p>
                          <p className="text-sm font-medium text-slate-700">{place.ranking}</p>
                        </div>
                      )}
                      
                      {/* Address - Enhanced */}
                      {place.address && (
                        <div className="mb-3 flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                          <span className="text-sky-500 text-base mt-0.5">📍</span>
                          <p className="text-sm text-slate-700 leading-relaxed">{place.address}</p>
                        </div>
                      )}
                      
                      {/* Phone - Enhanced */}
                      {place.phone && (
                        <div className="mb-3 flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                          <span className="text-sky-500 text-base">📞</span>
                          <a 
                            href={`tel:${place.phone}`}
                            className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {place.phone}
                          </a>
                        </div>
                      )}
                      
                      {/* Distance - Enhanced */}
                      {place.distance_string && (
                        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
                          <span className="text-blue-500">📏</span>
                          <span className="text-sm font-medium text-blue-700">
                            {place.distance_string} away
                          </span>
                        </div>
                      )}
                      
                      {/* Cuisine/Tags - Enhanced */}
                      {place.cuisine && place.cuisine.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Cuisine</p>
                          <div className="flex flex-wrap gap-2">
                            {place.cuisine.slice(0, 4).map((cuisineItem, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-100 to-blue-100 px-3 py-1.5 text-xs font-semibold text-sky-700 border border-sky-200 shadow-sm"
                              >
                                {typeof cuisineItem === 'object' ? cuisineItem.name : cuisineItem}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* View Details Button - Enhanced */}
                      <button
                        onClick={() => {
                          onSelectPlace(place.uid)
                          setActiveMarkerId(place.uid)
                        }}
                        className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        View Full Details →
                      </button>
                    </div>
                  </InfoWindowF>
                )}
              </MarkerF>
            )
          })}

        {weather?.list?.map((weatherPoint, index) => {
          const position = {
            lat: weatherPoint.coord.lat,
            lng: weatherPoint.coord.lon,
          }

          const iconUrl = `http://openweathermap.org/img/w/${weatherPoint.weather[0].icon}.png`

          const hasGoogle = typeof window !== 'undefined' && window.google && window.google.maps

          const icon = hasGoogle
              ? {
                  url: iconUrl,
                  scaledSize: new window.google.maps.Size(48, 48),
                }
              : {
                  url: iconUrl,
                }

          return (
            <MarkerF
              key={`weather-${index}`}
              position={position}
              icon={icon}
              clickable={false}
            />
          )
        })}
      </GoogleMap>
    </section>
  )
}

export default Map


