import Loader from './Loader'
import PlaceCard from './PlaceCard'
// import { useState } from 'react'



const List = ({
  places,
  isLoading,
  type,
  setType,
  rating,
  setRating,
  selectedPlaceId,
  onSelectPlace,

  // const [type,settype]=useState('')
} ) => (
  <section className="flex h-[75vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Nearby Highlights</h2>
          <p className="text-sm text-slate-500">Adjust the filters to refine your recommendations.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="flex flex-col text-sm font-medium text-slate-600">
          <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="restaurants">Restaurants</option>
            <option value="hotels">Hotels</option>
            <option value="attractions">Attractions</option>
          </select>
        </label>

        <label className="flex flex-col text-sm font-medium text-slate-600">
          <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Rating</span>
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="">All ratings</option>
            <option value="3">3.0+</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </label>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto bg-slate-50/60 p-5">
      {isLoading ? (
        <Loader label="Fetching the best places for you…" />
      ) : places.length ? (
        <div className="space-y-4">
          {places.map((place) => (
            <PlaceCard
              key={place.uid}
              place={place}
              isSelected={selectedPlaceId === place.uid}
              onSelect={() => onSelectPlace(place.uid)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          <p className="font-medium text-slate-600">No places found</p>
          <p className="mt-1 max-w-xs text-xs text-slate-500">
            Try broadening your filters or moving the map to a different area.
          </p>
        </div>
      )}
    </div>
  </section>
)

export default List



