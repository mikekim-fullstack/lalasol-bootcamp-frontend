import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    initialState: { user: null },
    name: 'user',
    reducers: {
        login: (state, action) => {
            // const [login, error, loading] = fetchData(action.payload.method, action.payload.url, action.payload.headers, action.payload.body)
            // console.log('userSlice: login-  ', action.payload)
            state.user = action.payload
            localStorage.setItem('userLogin', JSON.stringify(action.payload))
        },
        logout: (state, action) => {
            localStorage.removeItem('userLogin')
            localStorage.removeItem('navPath')
            state.user = null
            // console.log('logout')
        }
    }
})
export default userSlice.reducer

export const { login, logout } = userSlice.actions
// export const getUser = (state) => state.user.user
export const getUser = (state) => {
    // console.log('slice ---- getUser called ')
    return JSON.parse(localStorage.getItem('userLogin'))
}
