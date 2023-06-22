import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  detail: {}, 
}

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearState: (state, initialState) => {
      state = initialState
      return state;
    },

    loginUser: (state, action) => {
      state.detail = action.payload?.user;
      state.token = action.payload?.token;
    },

  }
});

export default userReducer.reducer;
export const { loginUser, clearState, } = userReducer.actions;

