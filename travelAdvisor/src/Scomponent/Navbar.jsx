import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Profile from "./Profile"
import axiosInstance from "../utils/axiosInstance"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useDispatch } from "react-redux"
import SearchBar from "./SearchBar"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { MessageCircle } from "lucide-react";




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

  const hasSearch = Boolean(setSearchQuery && onSearchNote && handleClearSearch)

  const handleSearch = () => {
    if (!hasSearch) return
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    if (!hasSearch) return
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
       <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
  <i className="fa-solid fa-arrow-left"></i>
  <span>Back</span>
</button>

      </Link>

      <div className="flex items-center gap-4">
        <Link 
          to="/place" 
          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition"
        >
          Street view <t></t>
         <i class="fa-solid fa-street-view mx-auto"></i>
        </Link>
        <Link 
          to="/all-stories" 
          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition"
        >
          All Stories <t> </t>
          <i class="fa-solid fa-photo-film"></i>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link 
          to="/chat" 
          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition"
        >
          Ask me.... <t></t><i class="fa-solid fa-magnifying-glass"></i>
        </Link>
      </div>

      
 <div className="flex items-center gap-4">
  <Link
    to="/Groupchat"
    className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50 transition "
  >
    GroupChat
    {/* <MessageCircle className="w-5 h-5 mt-1 text-blue-600" /> 👈 icon below text */}
    <i class="fa-regular fa-message"></i>
  </Link>
</div>

      {hasSearch && (
        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      )}

      <Profile onLogout={onLogout}/>
      <i class="fa-solid fa-arrow-right-from-bracket"></i>
    </div>
  )
}

export default Navbar
