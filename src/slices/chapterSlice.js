import { createSlice } from "@reduxjs/toolkit"

const chapterSlice = createSlice({
    initialState: { data: null, clickedData: null, category: null },
    name: 'chapters',
    reducers: {
        setChapters: (state, action) => {
            // console.log('setChapter-slice:', action.payload)

            // --- sort chapters by chapter_no in the ascending order. --- 
            if (action.payload && action.payload.length > 1) {

                const unSortedChapters = action.payload
                state.data = unSortedChapters.sort((a, b) => a.chapter_no > b.chapter_no ? 1 : (a.chapter_no < b.chapter_no) ? -1 : 0)
            }
            else {
                state.data = action.payload
            }

        },
        setClickedChapter: (state, action) => {
            state.clickedData = action.payload
            // console.log('slice - setClickedChapter: ', action.payload)
        },
        setChapterCategory: (state, action) => {
            state.category = action.payload
        },

    }
})


export default chapterSlice.reducer

export const { setChapters, setClickedChapter, setChapterCategory } = chapterSlice.actions
export const getChapters = (state) => state.chapters.data
export const getChapter = (state, id) => {
    if (state.chapters?.data) {
        const chapter = state.chapters.data.filter(data => data.id == id)
        // console.log('slice -- getChapter: ', id, state.chapters.data, chapter)
        if (chapter.length == 1) return chapter[0]
        else return null
    }
    return null
}
export const getClickedChapter = (state) => state.chapters.clickedData
export const getChapterCategory = (state) => state.chapters.category



