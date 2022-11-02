import { createSlice } from "@reduxjs/toolkit"

const courseSlice = createSlice({
    initialState: { data: null, enrolledData: null },
    name: 'courses',
    reducers: {
        setCourses: (state, action) => {
            // console.log('setCourse-slice:', action.payload)
            state.data = action.payload
        },
        setCoursesEnrolledStatus: (state, action) => {
            // console.log('setCourse-slice:', action.payload)
            state.enrolledData = action.payload
        },
    }
})


export default courseSlice.reducer

export const { setCourses, setCoursesEnrolledStatus } = courseSlice.actions
export const getCourses = (state) => state.courses.data
export const getCoursesEnrolledStatus = (state) => state.courses.enrolledData


