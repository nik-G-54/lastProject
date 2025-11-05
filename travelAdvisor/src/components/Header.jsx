import { FiSearch } from 'react-icons/fi'
import { useEffect, useRef } from 'react'


const Header = ({ isLoaded, hasError, onLoad, onPlaceChanged, onManualSearch }) => {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)

  useEffect(() => {
    if (!isLoaded || hasError || !inputRef.current) return

    // Try to use the new PlaceAutocompleteElement if available
    if (window.google?.maps?.places?.PlaceAutocompleteElement) {
      const autocomplete = new window.google.maps.places.PlaceAutocompleteElement({
        inputElement: inputRef.current,
      })

      // Listen for the place selection event
      const handlePlaceSelect = async (event) => {
        if (onPlaceChanged) {
          onPlaceChanged(event)
        }
      }

      autocomplete.addEventListener('gmp-placeselect', handlePlaceSelect)

      if (onLoad) {
        onLoad(autocomplete)
      }

      autocompleteRef.current = autocomplete

      return () => {
        if (autocompleteRef.current) {
          autocompleteRef.current.removeEventListener('gmp-placeselect', handlePlaceSelect)
          autocompleteRef.current = null
        }
      }
    }

    return () => {
      if (autocompleteRef.current) {
        autocompleteRef.current = null
      }
    }
  }, [isLoaded, hasError, onLoad, onPlaceChanged])

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Travel Advisor</h1>
          <p className="mt-1 text-sm text-slate-500">
            Discover restaurants, hotels, and attractions around any destination.
          </p>
        </div>

        {hasError ? (
          <div className="w-full max-w-md rounded-full border border-red-200 bg-red-50 py-2 px-4 text-center text-sm text-red-600">
            Add your Google Maps API key to enable search.
          </div>
        ) : isLoaded ? (
          <div className="relative w-full max-w-md">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a city, landmark, or address"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-24 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputRef.current?.value?.trim()) {
                  // Manual search with Geocoder if user presses Enter without selecting a suggestion
                  const query = inputRef.current.value.trim()
                  if (!onManualSearch) return
                  onManualSearch(query)
                }
              }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-sky-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
              onClick={() => {
                const query = inputRef.current?.value?.trim()
                if (!query) return
                if (!onManualSearch) return
                onManualSearch(query)
              }}
            >
              Search
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-full border border-dashed border-slate-300 bg-slate-50 py-2 px-4 text-center text-sm text-slate-400">
            Loading map search…
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
