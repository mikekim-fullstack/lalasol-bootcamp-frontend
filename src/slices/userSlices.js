import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    initialState: { user: null },
    name: 'user',
    reducers: {
        login: (state, action) => {
            // const [login, error, loading] = fetchData(action.payload.method, action.payload.url, action.payload.headers, action.payload.body)
            console.log('userSlice: login-  ', action.payload)
            state.user = action.payload
        },
        logout: (state, action) => {
            state.user = null
        }
    }
})
export default userSlice.reducer

export const { login, logout } = userSlice.actions
export const getUser = (state) => state.user.user
