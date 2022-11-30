import { createSlice } from "@reduxjs/toolkit";
const initialState = { catID: null, courseID: null, chapterID: null }
const pathSlice = createSlice({
    initialState: initialState,
    name: 'navpath',
    reducers: {
        setPathCatID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            // Object.keys(data).forEach(key=>)

            // window.localStorage.setItem('navPath', JSON.stringify({ catID: action.payload, courseID: data.courseID, chapterID: data.chapterID }))
            data.catID = action.payload
            window.localStorage.setItem('navPath', JSON.stringify(data))
            // state.catID = action.payload
        },
        setPathCourseID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            // window.localStorage.setItem('navPath', JSON.stringify({ catID: data.catID, courseID: action.payload, chapterID: data.chapterID }))
            data.courseID = action.payload
            window.localStorage.setItem('navPath', JSON.stringify(data))
            // state.courseID = action.payload
            // state.chapterID = null
        },
        setPathCourseCardIndex: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            // window.localStorage.setItem('navPath', JSON.stringify({ catID: data.catID, courseID: data.courseID, chapterID: data.chapterID , }))
            // state.courseID = action.payload
            // state.chapterID = null
            data.courseCardIndex = action.payload
            window.localStorage.setItem('navPath', JSON.stringify(data))
        },
        setPathChapterID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            // window.localStorage.setItem('navPath', JSON.stringify({ catID: data.catID, courseID: data.courseID, chapterID: action.payload }))
            // state.chapterID = action.payload
            data.chapterID = action.payload
            window.localStorage.setItem('navPath', JSON.stringify(data))
        },
        resetPathAll: (state, action) => {
            // window.localStorage.setItem('navPath', JSON.stringify({ catID: null, courseID: null, chapterID: null }))
            // state.chapterID = null
            window.localStorage.setItem('navPath', JSON.stringify(initialState))
        },
    }

})
export default pathSlice.reducer

export const { setPathCatID, setPathCourseID, setPathCourseCardIndex, setPathChapterID, resetPathAll } = pathSlice.actions

export const getPathCatID = state => JSON.parse(window.localStorage.getItem('navPath'))?.catID
export const getPathCourseID = state => JSON.parse(window.localStorage.getItem('navPath'))?.courseID
export const getPathChapterID = state => JSON.parse(window.localStorage.getItem('navPath'))?.chapterID
export const getPathCourseCardIndex = state => JSON.parse(window.localStorage.getItem('navPath'))?.courseCardIndex
export const getPathID = state => ([JSON.parse(window.localStorage.getItem('navPath'))?.catID,
JSON.parse(window.localStorage.getItem('navPath'))?.courseID,
JSON.parse(window.localStorage.getItem('navPath'))?.chapterID,
])
// export const getPathCatID = state => state.navpath.catID
// export const getPathCourseID = state => state.navpath.courseID
// export const getPathChapterID = state => state.navpath.chapterID