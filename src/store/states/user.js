import { createSlice } from '@reduxjs/toolkit'
// import { useDispatch } from "react-redux";

// const dispatcher = useDispatch();

export const initialUser = null

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: initialUser,
  reducers: {
    loginSuccess: (state, action) => {
      // Expecting action.payload to be the serializable user object
      return action.payload
    },
    signupSuccess: (state, action) => {
      return action.payload
    },
    modifyUser: (state, action) => {
      return { ...state, ...action.payload }
    },
    logoutSuccess: (state, action) => {
      return null
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
