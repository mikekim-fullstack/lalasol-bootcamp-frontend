import { configureStore, createReducer } from "@reduxjs/toolkit";
import userReducer from './slices/userSlices'
import catReducer from './slices/categorySlice'
import courseReducer from './slices/courseSlice'
const store = configureStore({
    reducer: {
        user: userReducer,
        category: catReducer,
        courses: courseReducer,
    }
})

export default store