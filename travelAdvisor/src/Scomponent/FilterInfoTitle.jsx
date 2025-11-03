import moment from "moment"
import React from "react"
import { IoMdClose } from "react-icons/io"

const FilterInfoTitle = ({ filterType, filterDate, searchQuery, onClear }) => {
  const DateRangeChip = ({ date }) => {
    const startDate = date?.from
      ? moment(date?.from).format("Do MMM YYYY")
      : "N/A"

    const endDate = date?.to ? moment(date?.to).format("Do MMM YYYY") : "N/A"

    return (
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-sm">
        <p className="text-xs font-medium">
          {startDate} - {endDate}
        </p>

        <button onClick={onClear} className="cursor-pointer">
          <IoMdClose />
        </button>
      </div>
    )
  }

  const SearchChip = ({ query }) => {
    return (
      <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-sm">
        <p className="text-xs font-medium text-blue-800">
          "{query}"
        </p>

        <button onClick={onClear} className="cursor-pointer hover:text-blue-600">
          <IoMdClose />
        </button>
      </div>
    )
  }

  return (
    filterType && (
      <div className="mb-5">
        {filterType === "search" ? (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Search Results for:</h3>
            {searchQuery && <SearchChip query={searchQuery} />}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Travel Stories from</h3>

            <DateRangeChip date={filterDate} />
          </div>
        )}
      </div>
    )
  )
}

export default FilterInfoTitle
