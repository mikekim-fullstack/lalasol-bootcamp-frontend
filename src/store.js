import { configureStore, createReducer } from "@reduxjs/toolkit";
import userReducer from './slices/userSlices'
import catReducer from './slices/categorySlice'
const store = configureStore({
    reducer: {
        user: userReducer,
        category: catReducer,
    }
})

export default store