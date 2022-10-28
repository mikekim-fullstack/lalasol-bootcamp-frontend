import { createSlice } from "@reduxjs/toolkit";

const pathSlice = createSlice({
    initialState: { catID: null, courseID: null, chapterID: null },
    name: 'navpath',
    reducers: {
        setPathCatID: (state, action) => {
            window.localStorage.setItem('navPath', JSON.stringify({ catID: action.payload, courseID: null, chapterID: null }))
            state.catID = action.payload
            state.courseID = null
            state.chapterID = null
        },
        setPathCourseID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            window.localStorage.setItem('navPath', JSON.stringify({ catID: data.catID, courseID: action.payload, chapterID: null }))
            state.courseID = action.payload
            state.chapterID = null
        },
        setPathChapterID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            window.localStorage.setItem('navPath', JSON.stringify({ catID: data.catID, courseID: data.courseID, chapterID: action.payload }))
            state.chapterID = action.payload
        },
        // resetPathAll: (state, action) => {
        //     state.chapterID = null
        // },
    }

})
export default pathSlice.reducer

export const { setPathCatID, setPathCourseID, setPathChapterID } = pathSlice.actions

export const getPathCatID = state => JSON.parse(window.localStorage.getItem('navPath'))?.catID
export const getPathCourseID = state => JSON.parse(window.localStorage.getItem('navPath'))?.courseID
export const getPathChapterID = state => JSON.parse(window.localStorage.getItem('navPath'))?.chapterID
// export const getPathCatID = state => state.navpath.catID
// export const getPathCourseID = state => state.navpath.courseID
// export const getPathChapterID = state => state.navpath.chapterID