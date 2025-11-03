import React from "react"
import { useSelector } from "react-redux"
import { getFirstCharacter } from "../utils/helper"

const Profile = ({ onLogout }) => {
  const { currentUser } = useSelector((state) => state.user)

  // Handle both possible data structures: currentUser.user or currentUser directly
  const user = currentUser?.user || currentUser
  const userDisplayName = user?.username || user?.email || ""
  const firstChar = getFirstCharacter(userDisplayName)
  
  // Display name for showing in profile
  const displayName = user?.username || user?.email || "User"

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow">
        {firstChar}
      </div>

      <div>
        <p className="text-lg font-medium">{displayName}</p>

        <button className="text-sm text-red-600 underline hover:text-red-700 transition-colors" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile
