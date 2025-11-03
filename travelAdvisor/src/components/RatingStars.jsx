import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

const RatingStars = ({ rating = 0 }) => {
  const safeRating = Number(rating) || 0
  const fullStars = Math.floor(safeRating)
  const hasHalf = safeRating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: fullStars }).map((_, index) => (
        <FaStar key={`full-${index}`} className="h-4 w-4" />
      ))}
      {hasHalf && <FaStarHalfAlt className="h-4 w-4" />}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <FaRegStar key={`empty-${index}`} className="h-4 w-4" />
      ))}
    </div>
  )
}

export default RatingStars



