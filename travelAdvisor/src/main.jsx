import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { Provider } from "react-redux"
import { persistor, store } from "./redux/store.js"
import { PersistGate } from "redux-persist/integration/react"
import "react-day-picker/style.css"

createRoot(document.getElementById("root")).render(
  // <PersistGate persistor={persistor}>   Delays rendering until persisted state is restored
  //   <Provider store={store}>       Makes Redux store available to entire app 
  //     <App  />   
  //   </Provider>
  // </PersistGate>

  //   this is the right way to use PersistGate and Provider together

    <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
 
)
