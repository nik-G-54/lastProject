import React, { useEffect, useState } from "react"
import Navbar from "../Scomponent/Navbar"
import axiosInstance from "../utils/axiosInstance"
import TravelStoryCard from "../Scomponent/TravelStoryCard "
import { ToastContainer, toast } from "react-toastify"
import { IoMdAdd } from "react-icons/io"
import Modal from "react-modal"
import AddEditTravelStory from "../Scomponent/AddEditTravelStory"
import ViewTravelStory from "./ViewTravelStory"
import EmptyCard from "../Scomponent/EmptyCard"
import { DayPicker } from "react-day-picker"
import { motion, AnimatePresence } from "framer-motion"
import moment from "moment"
import FilterInfoTitle from "../Scomponent/FilterInfoTitle"
import { getEmptyCardMessage } from "../utils/helper"

const Home = () => {
  const [allStories, setAllStories] = useState([])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")

  const [dateRange, setDateRange] = useState({ from: null, to: null })

  // console.log(allStories)

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  })

  // Get only logged-in user's travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/travel-story/my-stories")

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log(error, "Something went wrong. Please try again.")
    }
  }

  // Handle Edit Story
  const handleEdit = async (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data })
  }

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id

    try {
      const response = await axiosInstance.put(
        "/travel-story/update-is-favourite/" + storyId,
        {
          isFavorite: !storyData.isFavorite,
        }
      )

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!")
        getAllTravelStories()
      }
    } catch (error) {
      console.log(error, "Something went wrong. Please try again.")
    }
  }

  // delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id

    try {
      const response = await axiosInstance.delete(
        "/travel-story/delete-story/" + storyId
      )

      if (response.data && !response.data.error) {
        toast.success("Story deleted successfully!")

        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))

        getAllTravelStories()
      }
    } catch (error) {
      console.log(error, "Something went wrong. Please try again.")
    }
  }

  // search story
  const onSearchStory = async (query) => {
    if (!query || query.trim() === "") {
      handleClearSearch()
      return
    }

    try {
      const response = await axiosInstance.get("/travel-story/search", {
        params: {
          query: query.trim(),
        },
      })

      if (response.data && response.data.stories) {
        setFilterType("search")
        setAllStories(response.data.stories)
        const count = response.data.stories.length
        const storyText = count === 1 ? "story" : "stories"
        toast.info(`Found ${count} ${storyText} matching "${query}" in title, story, or location`)
      }
    } catch (error) {
      console.log(error, "Something went wrong. Please try again.")
      toast.error("Failed to search stories. Please try again.")
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setFilterType("")
    getAllTravelStories()
  }

  // Handle filter travel story by date range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null
      const endDate = day.to ? moment(day.to).valueOf() : null

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-story/filter", {
          params: { startDate, endDate },
        })

        if (response.data && response.data.stories) {
          setFilterType("date")
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log(error, "Something went wrong. Please try again.")
    }
  }

  // Handle date range click
  const handleDayClick = (day) => {
    setDateRange(day)
    filterStoriesByDate(day)
  }

  const resetFilter = () => {
    setDateRange({ from: null, to: null })
    setFilterType("")
    setSearchQuery("")
    getAllTravelStories()
  }

  // Real-time search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && searchQuery.trim() !== "") {
        onSearchStory(searchQuery)
      } else if (searchQuery === "" && filterType === "search") {
        // Clear search results when search query is cleared
        handleClearSearch()
      }
    }, 500) // Debounce: wait 500ms after user stops typing

    return () => {
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]) // Re-run when searchQuery changes

  useEffect(() => {
    getAllTravelStories()

    return () => { }
  }, [])

  return (
    <>
      <Navbar
        searchQuery={ searchQuery }
        setSearchQuery={ setSearchQuery }
        onSearchNote={ onSearchStory }
        handleClearSearch={ handleClearSearch }
      />

      <div className="bg-gradient-to-b from-blue-50 to-white pb-10">
        {/* Animated Hero Section */ }
        <div className="relative overflow-hidden bg-slate-900 py-20 mb-10">
          <motion.div
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.8 } }
            className="container mx-auto px-4 relative z-10 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Personal <span className="text-blue-400">Travel Diary</span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Capture your memories, explore new horizons, and share your journey with the world.
            </p>
            <motion.button
              whileHover={ { scale: 1.05 } }
              whileTap={ { scale: 0.95 } }
              onClick={ () => setOpenAddEditModal({ isShown: true, type: "add", data: null }) }
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-colors"
            >
              Share a New Story
            </motion.button>
          </motion.div>

          {/* Decorative Animated Background Elements */ }
          <motion.div
            animate={ {
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            } }
            transition={ { duration: 20, repeat: Infinity, ease: "linear" } }
            className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={ {
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.15, 0.1]
            } }
            transition={ { duration: 25, repeat: Infinity, ease: "linear" } }
            className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FilterInfoTitle
            filterType={ filterType }
            filterDate={ dateRange }
            searchQuery={ searchQuery }
            onClear={ () => {
              resetFilter()
            } }
          />

          <div className="flex flex-col-reverse lg:flex-row gap-7">
            <div className="flex-1">
              <AnimatePresence mode="popLayout">
                { allStories.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    { allStories.map((item) => {
                      return (
                        <motion.div
                          layout
                          key={ item._id }
                          initial={ { opacity: 0, scale: 0.9 } }
                          animate={ { opacity: 1, scale: 1 } }
                          exit={ { opacity: 0, scale: 0.9 } }
                          transition={ { duration: 0.3 } }
                        >
                          <TravelStoryCard
                            imageUrl={ item.imageUrl }
                            title={ item.title }
                            story={ item.story }
                            date={ item.visitedDate }
                            visitedLocation={ item.visitedLocation }
                            isFavourite={ item.isFavorite }
                            onEdit={ () => handleEdit(item) }
                            onClick={ () => handleViewStory(item) }
                            onFavouriteClick={ () => updateIsFavourite(item) }
                          />
                        </motion.div>
                      )
                    }) }
                  </motion.div>
                ) : (
                  <motion.div
                    initial={ { opacity: 0 } }
                    animate={ { opacity: 1 } }
                  >
                    <EmptyCard
                      imgSrc="/blankbox.jpg"
                      message={ getEmptyCardMessage(filterType) }
                      setOpenAddEditModal={ () =>
                        setOpenAddEditModal({
                          isShown: true,
                          type: "add",
                          data: null,
                        })
                      }
                    />
                  </motion.div>
                ) }
              </AnimatePresence>
            </div>

            <div className="w-full lg:w-[320px]">
              <motion.div
                initial={ { opacity: 0, x: 20 } }
                animate={ { opacity: 1, x: 0 } }
                className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-xl overflow-hidden sticky top-24"
              >
                <div className="p-3">
                  <DayPicker
                    captionLayout="dropdown"
                    mode="range"
                    selected={ dateRange }
                    onSelect={ handleDayClick }
                    pagedNavigation
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Add & Edit Travel Story Modal */ }
      <Modal
        isOpen={ openAddEditModal.isShown }
        onRequestClose={ () => { } }
        style={ {
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        } }
        appElement={ document.getElementById("root") }
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <AddEditTravelStory
          storyInfo={ openAddEditModal.data }
          type={ openAddEditModal.type }
          onClose={ () => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          } }
          getAllTravelStories={ getAllTravelStories }
        />
      </Modal>

      {/* View travel story modal */ }
      <Modal
        isOpen={ openViewModal.isShown }
        onRequestClose={ () => { } }
        style={ {
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        } }
        appElement={ document.getElementById("root") }
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <ViewTravelStory
          storyInfo={ openViewModal.data || null }
          onClose={ () => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
          } }
          onEditClick={ () => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
            handleEdit(openViewModal.data || null)
          } }
          onDeleteClick={ () => {
            deleteTravelStory(openViewModal.data || null)
          } }
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-[#05b6d3] hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={ () => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        } }
      >
        <IoMdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  )
}

export default Home
