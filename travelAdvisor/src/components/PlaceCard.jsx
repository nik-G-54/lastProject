import { useEffect, useRef } from 'react'
import { FiExternalLink, FiMapPin, FiPhone } from 'react-icons/fi'

import RatingStars from './RatingStars'

const fallbackImage =
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80'

const PlaceCard = ({ place, isSelected, onSelect }) => {
  const cardRef = useRef(null)

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isSelected])

  const {
    name,
    photo,
    rating,
    num_reviews: reviews,
    price_level: priceLevel,
    ranking,
    cuisine = [],
    awards = [],
    address,
    phone,
    // web_url: tripUrl,
    // website,
    open_now_text: openNow,
    distance_string: distance,
  } = place

  const imageSrc = photo?.images?.large?.url || photo?.images?.medium?.url || fallbackImage

  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect()
      }}
      className={`group overflow-hidden rounded-2xl border bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
        isSelected
          ? 'border-sky-400 shadow-lg ring-2 ring-sky-100'
          : 'border-slate-200 shadow-sm hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg'
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {openNow && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-emerald-600 shadow">
            {openNow}
          </span>
        )}
        {distance && (
          <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-white">
            {distance} away
          </span>
        )}
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <RatingStars rating={rating} />
            <span className="font-medium text-slate-600">{Number(rating) || 'N/A'}</span>
            <span className="text-slate-400">·</span>
            <span>{reviews ? `${reviews} review${Number(reviews) > 1 ? 's' : ''}` : 'No reviews yet'}</span>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-slate-600">
          {priceLevel && (
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Price</span>
              <span className="font-semibold text-slate-700"> please wisit the place </span>
            </div>
          )}
          {ranking && (
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Ranking</span>
              <span className="text-right font-semibold text-slate-700">{ranking}</span>
            </div>
          )}
        </div>

        {awards.length > 0 && (
          <div className="space-y-2">
            {awards.slice(0, 3).map((award) => (
              <div key={award.display_name} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
                {award.images?.small && (
                  <img
                    src={award.images.small}
                    alt={award.display_name}
                    className="h-6 w-6 flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <span className="text-xs font-medium text-slate-600">{award.display_name}</span>
              </div>
            ))}
          </div>
        )}

        {cuisine.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cuisine.slice(0, 6).map(({ name: cuisineName }) => (
              <span
                key={cuisineName}
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600"
              >
                {cuisineName}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2 text-sm text-slate-600">
          {address && (
            <p className="flex items-start gap-2">
              <FiMapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-500" />
              <span>{address}</span>
            </p>
          )}
          {phone && (
            <p className="flex items-center gap-2">
              <FiPhone className="h-4 w-4 flex-shrink-0 text-sky-500" />
              <span>{phone}</span>
            </p>
          )}
        </div>

        {/* <div className="flex flex-wrap gap-3">
          {tripUrl && (
            <a
              href={tripUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600"
              onClick={(event) => event.stopPropagation()}
            >
              TripAdvisor
              <FiExternalLink className="h-4 w-4" />
            </a>
          )}
          {website && (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
              onClick={(event) => event.stopPropagation()}
            >
              Website
              <FiExternalLink className="h-4 w-4" />
            </a>
          )}
        </div> */}
      </div>
    </article>
  )
}

export default PlaceCard


