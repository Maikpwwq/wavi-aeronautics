import { createSlice } from '@reduxjs/toolkit'
// import { useDispatch } from "react-redux";

// const dispatcher = useDispatch();

export const initialUser = {
  username: 'test',
  password: 'test*123'
}

// localStorage.getItem("user")
//   ? JSON.parse(localStorage.getItem("user"))
//   : null;

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: initialUser,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload
      // localStorage.setItem("user", JSON.stringify(action.payload));
    },
    signupSuccess: (state, action) => {
      state.user = action.payload
      // localStorage.setItem("user", JSON.stringify(action.payload));
    },
    modifyUser: (state, action) => {
      return { ...state, ...action.payload }
    },
    logoutSuccess: (state, action) => {
      state.user = initialUser
      // localStorage.removeItem("user");
    }
  }
})
export default userSlice.reducer

// export actions
export const { loginSuccess, signupSuccess, modifyUser, logoutSuccess } =
  userSlice.actions

// export const signup = ({ username, password }) => {
//   try {
//     dispatcher(signupSuccess({ username, password }));
//   } catch (e) {
//     return console.error(e.message);
//   }
// };

// export const updateUser = ({ username, password }) => {
//   try {
//     dispatcher(modifyUser({ username, password }));
//   } catch (e) {
//     return console.error(e.message);
//   }
// };

// export const login = ({ username, password }) => {
//   try {
//     dispatcher(loginSuccess({ username, password }));
//   } catch (e) {
//     return console.error(e.message);
//   }
// };

// export const logout = () => {
//   try {
//     return dispatcher(logoutSuccess());
//   } catch (e) {
//     return console.error(e.message);
//   }
// };
