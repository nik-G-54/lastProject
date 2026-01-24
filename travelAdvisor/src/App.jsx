// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Place from './place/Place'
// import Home from './components/Home'
// // import Home from './components/Home'
// import Login from './pages/Login'
// // import SignUp from './pages/SignUp'

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home/>} />
//         <Route path="/places" element={<Place />} />
//         {/* Uncomment these routes when you create the components */}
//         <Route path="/login" element={<Login />} />
//         {/* <Route path="/signup" element={<SignUp />} /> */}
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App


import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Landing from "./pages/Landing"
import PrivateRoute from "./Scomponent/PrivateRoute"
import Place from './place/Place'
import Chat from './chatboat/Chat'
import Groupchat from "./groupchat/Groupchat"
import AllStory from "./Home/AllStory"
//  import React3fiber from "./react3fiber/react3fiber"
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />
          
          {/* Authenticated Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home  />} />
            <Route path="/all-stories" element={<AllStory />} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          {/* Place component routes - accessible without authentication */}
          <Route path="/place" element={<Place/>} />
          <Route path="/places" element={<Place/>} />
          <Route path="/Place" element={<Place/>} />
          <Route path="/Chat" element={<Chat/>} />
          <Route path="/Groupchat" element={<Groupchat/>} />
          {/* <Route path="/React3fiber.jsx" element={<React3fiber/>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
