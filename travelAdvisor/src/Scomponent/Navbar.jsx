import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Profile from "./Profile"
import axiosInstance from "../utils/axiosInstance"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useDispatch } from "react-redux"
import SearchBar from "./SearchBar"

const Navbar = ({
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      const response = await axiosInstance.post("/user/signout")

      if (response.data) {
        dispatch(signOutSuccess())

        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    handleClearSearch()
    setSearchQuery("")
  }

  return (
    <div className="bg-white flex items-center justify-between px-10 py-2 drop-shadow sticky top-0 z-10">
      <Link to={"/home"}>
        <h1 className="font-bold text-2xl sm:text-2xl flex flex-wrap">
          <span className="text-blue-400">Travel</span>
          <span className="text-blue-800">Diary</span>
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <Link 
          to="/place" 
          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition"
        >
          Places
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link 
          to="/chat" 
          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition"
        >
          ChatBoat
        </Link>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <Profile onLogout={onLogout} />
    </div>
  )
}

export default Navbar
