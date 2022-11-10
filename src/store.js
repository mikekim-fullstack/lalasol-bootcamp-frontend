import { configureStore, createReducer, } from "@reduxjs/toolkit";
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
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            // {
            //     // Ignore these action types
            //     ignoredActions: ['chapters/action/type'],
            //     // Ignore these field paths in all actions
            //     // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            //     // Ignore these paths in the state
            //     // ignoredPaths: ['items.dates'],
            // },
        }),
})

export default store