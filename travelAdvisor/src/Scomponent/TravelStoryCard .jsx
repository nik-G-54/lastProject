import { motion } from "framer-motion"
import moment from "moment"
import { FaLocationDot } from "react-icons/fa6"
import { FaHeart } from "react-icons/fa"

const TravelStoryCard = ({
  imageUrl,
  title,
  story,
  date,
  visitedLocation,
  isFavourite,
  // onEdit,
  onClick,
  onFavouriteClick,
}) => {
  console.log(isFavourite)

  return (
    <motion.div
      whileHover={ { y: -5, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" } }
      transition={ { duration: 0.3 } }
      className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-2xl transition-all ease-in-out relative cursor-pointer group"
    >
      <div className="overflow-hidden">
        <motion.img
          whileHover={ { scale: 1.05 } }
          transition={ { duration: 0.5 } }
          src={ imageUrl }
          alt={ title }
          className="w-full h-56 object-cover"
          onClick={ onClick }
        />
      </div>

      <button
        className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
        onClick={ onFavouriteClick }
      >
        <FaHeart
          className={ `icon-btn ${isFavourite ? "text-red-500" : "text-white"
            } hover:text-red-500` }
        />
      </button>

      <div className="p-4" onClick={ onClick }>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6 className="text-[16px] font-medium">{ title }</h6>

            <span className="text-xs text-slate-500">
              { date ? moment(date).format("Do MMM YYYY") : "-" }
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-2">{ story?.slice(0, 60) }</p>

        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
          <FaLocationDot className="text-sm" />

          { visitedLocation.map((item, index) =>
            visitedLocation.length === index + 1 ? `${item}` : `${item},`
          ) }
        </div>
      </div>
    </motion.div>
  )
}

export default TravelStoryCard
