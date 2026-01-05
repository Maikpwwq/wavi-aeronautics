import { createSlice } from '@reduxjs/toolkit'
// import { useDispatch } from "react-redux";

// const dispatcher = useDispatch();

// Try to load from session storage for initial state to prevent flicker
const loadUserFromSession = () => {
    if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('wavi_user')
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch (e) {
                console.error("Failed to parse user session", e)
            }
        }
    }
    return null
}

export const initialUser = loadUserFromSession()

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
