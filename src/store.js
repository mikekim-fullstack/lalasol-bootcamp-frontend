import { configureStore, createReducer } from "@reduxjs/toolkit";
import userReducer from './slices/userSlices'
import catReducer from './slices/categorySlice'
import chapterReducer from './slices/chapterSlice'
const store = configureStore({
    reducer: {
        user: userReducer,
        category: catReducer,
        chapters: chapterReducer,
    }
})

export default store