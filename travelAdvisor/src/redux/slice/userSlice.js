import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
}

const userSlice = createSlice({
  name: "user",  // Name of the slice eg-=state.user
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true
      state.error = null
    },

    signInSuccess: (state, action) => {
      state.currentUser = action.payload  //Called when login API succeeds  ';What action.payload contains==  User data; Token ;Profile info
      state.loading = false
      state.error = null
    },

    signInFailure: (state, action) => {
      state.loading = false
      state.error = action.payload // this contains the error message from backend
    },

    signOutSuccess: (state) => {
      state.currentUser = null
      state.error = null
      state.loading = false
    },
  },
})

export const { signInStart, signInSuccess, signInFailure, signOutSuccess } =
  userSlice.actions ///Why we export actions
                    // Used with dispatch()
export default userSlice.reducer
