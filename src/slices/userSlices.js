import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    initialState: { user: null },
    name: 'user',
    reducers: {
        login: (state, action) => {
            state.user = action.payload
        },
        logout: (state, action) => {
            state.user = null
        }
    }
})
export default userSlice.reducer

export const { login, logout } = userSlice.actions
export const selecUser = (state) => state.user.user
