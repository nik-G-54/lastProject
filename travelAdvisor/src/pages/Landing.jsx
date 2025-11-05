import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        
        className="absolute top-0 left-0 w-full h-full  object-cover z-0 pointer-events-none"
      >
        <source src="/O.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10 pointer-events-none"></div>

      {/* Transparent Navbar */}
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6 z-30 pointer-events-auto">
        {/* Website Name */}
        <Link to="/">
          <h1 className="font-bold text-3xl sm:text-4xl flex flex-wrap">
            <span className="text-blue-400">Travel</span>
            <span className="text-blue-800">Diary</span>
          </h1>
        </Link>

        {/* Login Button */}
        <Link
          to="/login"
          className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          aria-label="Go to Login"
        >
          Login <t></t>
          <i class="fa-solid fa-right-to-bracket"></i>
        </Link>
      </nav>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Website Name */}
          <h1 className="font-bold text-6xl sm:text-7xl md:text-8xl mb-6 flex flex-wrap justify-center gap-2">
            <span className="text-blue-400 drop-shadow-2xl">Travel</span>
            <span className="text-blue-800 drop-shadow-2xl">Diary</span>
          </h1>

          {/* Travel Quote */}
          <p className="text-white text-xl sm:text-2xl md:text-3xl font-light italic drop-shadow-lg mt-4">
            "The world is a book and those who do not travel read only one page"
          </p>
        </div>
      </div>
    </div>
  )
}

export default Landing

