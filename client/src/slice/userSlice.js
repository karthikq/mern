import { createSlice } from "@reduxjs/toolkit";
import { BackendApi } from "../Api/backendApi";
const userSlice = createSlice({
  name: "users",
  initialState: { email: "", username: "" },
  reducers: {
    getUser(state, action) {
      return (state = action.payload);
    },
    logoutUser(state, action) {
      return (state = { username: "", email: "" });
    },
  },
});
export function getUserDetails() {
  return async function getUserDatathunk(dispatch) {
    try {
      const { data } = await BackendApi.get("/getuser");
      if (data) {
        dispatch(getUser(data.user));
      }
    } catch (error) {
      console.log(error);
    }
  };
}
export function loginUser(userData) {
  return async function getUserThunk(dispatch, getstate) {
    try {
      const { data } = await BackendApi.post("/login", userData);

      if (data) {
        await dispatch(getUser(data.user));
        localStorage.setItem("authToken", data.token);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
export function registerUser(userData) {
  return async function registerThunk(dispatch, getstate) {
    try {
      const { data } = await BackendApi.post("/register", userData);
      console.log(data.user);
      if (data) {
        await dispatch(getUser(data.user));
        localStorage.setItem("authToken", data.token);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
export function logout() {
  return async function logoutUserthunk(dispatch, getState) {
    try {
      const { data } = await BackendApi.post("/logout");
      if (data) {
        localStorage.removeItem("authToken");
        dispatch(logoutUser());
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export const { getUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
