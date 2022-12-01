import { createSlice } from "@reduxjs/toolkit";
const initialState = { catID: null, courseID: null, chapterID: null, contentID: null }
const pathSlice = createSlice({
    initialState: initialState,
    name: 'navpath',
    reducers: {
        setPathCatID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            data.catID = action.payload
            window.localStorage.setItem('navPath', JSON.stringify(data))
        },
        setPathCourseID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            data.courseID = action.payload
            window.localStorage.setItem('navPath', JSON.stringify(data))
        },

        setPathChapterID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            data.chapterID = action.payload
            window.localStorage.setItem('navPath', JSON.stringify(data))
        },
        setPathContentID: (state, action) => {
            const data = JSON.parse(window.localStorage.getItem('navPath'))
            data.contentID = action.payload
            window.localStorage.setItem('navPath', JSON.stringify(data))
        },
        resetPathAll: (state, action) => {
            window.localStorage.setItem('navPath', JSON.stringify(initialState))
        },
    }

})
export default pathSlice.reducer

export const { setPathCatID, setPathCourseID, setPathChapterID, setPathContentID, resetPathAll } = pathSlice.actions

export const getPathCatID = state => JSON.parse(window.localStorage.getItem('navPath'))?.catID
export const getPathCourseID = state => JSON.parse(window.localStorage.getItem('navPath'))?.courseID
export const getPathChapterID = state => JSON.parse(window.localStorage.getItem('navPath'))?.chapterID
export const getPathCourseCardIndex = state => JSON.parse(window.localStorage.getItem('navPath'))?.courseCardIndex
export const getPathID = state => (JSON.parse(window.localStorage.getItem('navPath')))

// export const getPathID = state => ([JSON.parse(window.localStorage.getItem('navPath'))?.catID,
// JSON.parse(window.localStorage.getItem('navPath'))?.courseID,
// JSON.parse(window.localStorage.getItem('navPath'))?.chapterID,
// ])
// export const getPathCatID = state => state.navpath.catID
// export const getPathCourseID = state => state.navpath.courseID
// export const getPathChapterID = state => state.navpath.chapterID