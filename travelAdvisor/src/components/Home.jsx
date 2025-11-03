import React from 'react'
import { useNavigate } from 'react-router-dom'
const Home = () => {
     const navigate = useNavigate()
  return (
    <div>
      hi this is the home page 
     <button
              type="submit"
              className="btn-primary btn-light "
              onClick={() => navigate("/Login")}
            >
        Login
            </button>
   
    </div>
  )
}

export default Home
