import { configureStore, createReducer } from "@reduxjs/toolkit";
import userReducer from './slices/userSlices'
import catReducer from './slices/categorySlice'
import courseReducer from './slices/courseSlice'
import chapterReducer from './slices/chapterSlice'
import pathReducer from './slices/pathSlice'
const store = configureStore({
    reducer: {
        user: userReducer,
        category: catReducer,
        courses: courseReducer,
        chapters: chapterReducer,
        navpath: pathReducer,
    }
})

export default store