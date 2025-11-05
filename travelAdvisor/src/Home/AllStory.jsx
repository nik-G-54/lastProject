import React, { useEffect, useState } from "react"
import Navbar from "../Scomponent/Navbar"
import axiosInstance from "../utils/axiosInstance"
import TravelStoryCard from "../Scomponent/TravelStoryCard "
import { ToastContainer } from "react-toastify"
import Modal from "react-modal"
import ViewTravelStory from "./ViewTravelStory"
import EmptyCard from "../Scomponent/EmptyCard"

const AllStory = () => {
  const [stories, setStories] = useState([])
  const [openViewModal, setOpenViewModal] = useState({ isShown: false, data: null })

  const fetchAllStories = async () => {
    try {
      const response = await axiosInstance.get("/travel-story/get-all")
      if (response.data && response.data.stories) {
        setStories(response.data.stories)
      }
    } catch (error) {
      // silent for now
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllStories()
  }, [])

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {stories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {stories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavorite}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={
                  "https://images.pexels.com/photos/5706021/pexels-photo-5706021.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                message="No stories to show yet."
                setOpenAddEditModal={() => {}}
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prev) => ({ ...prev, isShown: false }))
          }}
          onEditClick={() => {}}
          onDeleteClick={() => {}}
        />
      </Modal>

      <ToastContainer />
    </>
  )
}

export default AllStory



