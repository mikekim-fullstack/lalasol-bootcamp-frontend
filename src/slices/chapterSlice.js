import { createSlice } from "@reduxjs/toolkit"

const chapterSlice = createSlice({
    initialState: { data: null },
    name: 'chapters',
    reducers: {
        setChapters: (state, action) => {
            console.log('setChapter-slice:', action.payload)
            state.data = action.payload
        },
        setTest: (state, action) => {
            console.log('setChapter-slice: setTest-', action.payload)
        },
    }
})


export default chapterSlice.reducer

export const { setChapters, setTest } = chapterSlice.actions
export const getChapters = (state) => state.chapters.data


