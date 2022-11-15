import { createSlice } from "@reduxjs/toolkit"

const courseSlice = createSlice({
    initialState: { data: null, enrolledData: null },
    name: 'courses',
    reducers: {
        setCourses: (state, action) => {
            // console.log('setCourse-slice:', action.payload)
            state.data = action.payload
        },
        // setCoursesEnrolledStatus: (state, action) => {
        //     // console.log('setCourse-slice:', action.payload)
        //     state.enrolledData = action.payload
        // },
        setCoursesEnrolledStatus: (state, action) => {
            const _coursesEnrolled = []
            action.payload?.categories?.sort((a, b) => a.id > b.id ? 1 : a.id < a.id ? -1 : 0)
                .forEach(cat => {
                    // const r = getSortedCourseID(cat.id)
                    const seq = cat.course_list_sequence
                    // console.log('catID:', cat.id, ', seq: ', seq)
                    let keyCourseID = null
                    if (seq) {
                        keyCourseID = Object.keys(seq).sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                        // console.log('keyCourseID: ', keyCourseID)
                    }
                    if (seq != null && keyCourseID != null) {
                        for (let i = 0; i < keyCourseID.length; i++) {

                            const res = action.payload?.courses.filter(course => (course.category == cat.id && course.id == Number(keyCourseID[i])))[0]
                            // console.log('newCourse: ', res)
                            _coursesEnrolled.push(res)
                        }

                    }
                    else {
                        const res = action.payload?.courses.filter(course => (course.category == cat.id))
                        res.forEach(course => _coursesEnrolled.push(course))

                    }
                })
            console.log('courseSlice _coursesEnrolled: ', _coursesEnrolled)
            // console.log('setCourse-slice:', action.payload)
            state.enrolledData = _coursesEnrolled
        },
    }
})


export default courseSlice.reducer

export const { setCourses, setCoursesEnrolledStatus } = courseSlice.actions
export const getCourses = (state) => state.courses.data
export const getCoursesEnrolledStatus = (state) => state.courses.enrolledData


