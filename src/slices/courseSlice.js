import { createSlice } from "@reduxjs/toolkit"

const courseSlice = createSlice({
    initialState: { data: null },
    name: 'courses',
    reducers: {
        setCourses: (state, action) => {
            // console.log('setCourse-slice:', action.payload)
            state.data = action.payload
        },
        setTest: (state, action) => {
            console.log('setCourse-slice: setTest-', action.payload)
        },
    }
})


export default courseSlice.reducer

export const { setCourses, setTest } = courseSlice.actions
export const getCourses = (state) => state.courses.data


