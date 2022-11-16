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
            /**
             * Sorting all courses by course_list_sequence in categories.
             */
            // console.log('setCoursesEnrolledStatus----', action.payload?.categories)
            // return;
            if (action.payload?.categories == null) return
            const _categories = [...action.payload?.categories]


            const _coursesEnrolled = []
            const _sorted = _categories.sort((a, b) => (a.id > b.id) ? 1 : ((a.id < a.id) ? -1 : 0))
            // console.log('_sorted: ', _sorted)
            _sorted.forEach(cat => {
                // const r = getSortedCourseID(cat.id)
                const seq = cat.course_list_sequence
                // console.log('catID:', cat.id, ', seq: ', seq)
                let keyCourseID = null
                if (seq) {
                    keyCourseID = Object.keys(seq).sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                    // console.log('[keyCourseID]: ', keyCourseID)
                }
                if (seq != null && keyCourseID != null) {
                    for (let i = 0; i < keyCourseID.length; i++) {

                        const res = action.payload?.courses.filter(course => (course.category == cat.id && course.id == Number(keyCourseID[i])))[0]
                        // console.log('cat.id', cat.id, 'orderedCourse: ', res)
                        _coursesEnrolled.push(res)
                    }

                }
                if (seq == null || Object.keys(seq).length == 0) {
                    const res = action.payload?.courses.filter(course => (course.category == cat.id))
                    // console.log('cat.id', cat.id, 'no order seq: ', res)
                    res?.forEach(course => _coursesEnrolled.push(course))

                }
            })
            // console.log('courseSlice _coursesEnrolled: ', _coursesEnrolled)
            state.enrolledData = _coursesEnrolled
        },
    }
})


export default courseSlice.reducer

export const { setCourses, setCoursesEnrolledStatus } = courseSlice.actions
export const getCourses = (state) => state.courses.data
export const getCoursesEnrolledStatus = (state) => state.courses.enrolledData


