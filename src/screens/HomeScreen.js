import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getSelectedCat, setCat, getCats, setSelectedCat, getSelectedCatStatus, setSelectedCatStatus } from '../slices/categorySlice'
import { setCoursesEnrolledStatus, getCourses, getCoursesEnrolledStatus, getClickedCourse, setClickedCourse } from '../slices/courseSlice'
import { setChapters, getChapters, getChapterLists } from '../slices/chapterSlice'
import { setPathCourseID, setPathCatID, resetPathAll, setPathChapterID, getPathCatID, getPathCourseID, getPathChapterID } from '../slices/pathSlice'
import { getUser } from '../slices/userSlices'
import axios from 'axios'
import './HomeScreen.css'
import CourseCard from '../components/CourseCard'

const HomeScreen = () => {
    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const categories = useSelector(getCats)
    // const courses = useSelector(getCourses)
    const coursesEnrolled = useSelector(getCoursesEnrolledStatus)
    const chapters = useSelector(getChapters)
    const chapterLists = useSelector(getChapterLists)
    const clickedCourse = useSelector(getClickedCourse)
    const catID = useSelector(getPathCatID)
    const courseID = useSelector(getPathCourseID)


    // console.log('---HomeScreen ---courses: ', coursesEnrolled)


    const fetchEnrolledCourses = async (userId, course) => {
        const catId = course.category
        const courseid = course.id
        // console.log('user info:', process.env.REACT_APP_DEBUG, process.env.REACT_APP_BASE_URL, userId, selectedCatId)
        // await axios.get(process.env.REACT_APP_BASE_URL + `/api/course/${subjectId}`,
        const url = user.role == 'teacher' ? `/api/courses-all-by-teacher/${user?.id}` :
            axios.defaults.baseURL + `/api/student-course-enrollment/${userId}/${catId}`
        await axios.get(url,
            {
                headers: {
                    "Content-type": "Application/Json",
                }
            }
        )
            .then(res => {
                console.log('--fetchEnrolledCourses:-categories', categories, ', res.data', res.data)
                // dispatch(setCourses(res.data))
                // dispatch(setCoursesEnrolledStatus({ 'categories': categories, 'courses': res.data }))

                dispatch(setClickedCourse({ catId: catId, courseId: courseid, course }))


                dispatch(setSelectedCat(catId))
                dispatch(resetPathAll())
                dispatch(setPathCatID(catId))

                fetchChapters(course)
                dispatch(setPathCourseID(courseid))
                dispatch(setSelectedCatStatus(true))
            })
            .catch(err => console.log('error: ' + `/api/student-course-enrollment/${userId}/${catId}`, err))
    }

    const fetchChapters = async (course) => {
        const url = user?.role == 'teacher' ? axios.defaults.baseURL + `/api/course-chapter/${course.id}`
            : axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course.id}`
        await axios.get(url)
            .then(res => {
                // console.log('fetchChapters: ', res.data)
                // dispatch(setChapters(res.data))
                dispatch(setChapters({ chapter_list_sequence: course?.chapter_list_sequence, res_data: res.data }))
            })
            .catch(err => console.log('error: ' + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course.id}`, err))
    }

    const selectCategory = async (_sortedCat, openSideMenu = true) => {
        if (!catID) return
        // const _sortedCat = sortedCat[cat_id]
        // console.log('handleSelectCategoryClick: ', _sortedCat)

        // -- For letting the submenu(sideBar) to only show the subject lists not showing 
        //    previous items of selected subject. --

        await fetchEnrolledCourses(user.id, catID)

        // dispatch(setSelectedCat(_sortedCat))
        // openSideMenu && dispatch(setSelectedCatStatus(true))
        // dispatch(resetPathAll())
        // dispatch(setPathCatID(catID))
        // dispatch(setChapters(null))
        // dispatch(setChapters({ chapter_list_sequence: null, res_data: null }))

    }

    const handleCourseClick = async (e, cat, course) => {
        const catId = course.category
        const courseid = course.id
        console.log('handleCourseClick: cat-', cat, ', catID', catId, ', courseid', courseid)
        // fetchEnrolledCourses(user.id, course)

        dispatch(setClickedCourse({ catId: catId, courseId: courseid, course }))


        dispatch(setSelectedCat(cat))
        dispatch(resetPathAll())
        dispatch(setPathCatID(catId))

        await fetchChapters(course)
        dispatch(setPathCourseID(courseid))
        dispatch(setSelectedCatStatus(true))
    }
    return (

        <div className='home__screen'>
            <div className='home__screen_content'>
                <h1>All Courses</h1>
                {
                    categories && categories.map((cat) => {
                        // console.log('HomeScreen-cat:', cat)
                        return <div key={cat[0]}>
                            <div className='categories' >
                                <span>{cat[1]}</span>&nbsp;-&nbsp;{cat[2]}
                            </div>
                            <div className='courses'>
                                {/* {console.log('-------- courses:coursesEnrolled -------', coursesEnrolled)} */}
                                {

                                    coursesEnrolled && coursesEnrolled
                                        .filter((course) => course.category == cat[0])
                                        // .sort((a, b) => a.course_no > b.course_no ? 1 : a.course_no < b.course_no ? -1 : 0)
                                        .map((course) => {
                                            // console.log('course: ', course)
                                            return <CourseCard id='id_course_card' key={course.id} cat={cat} course={course} handleCourseClick={handleCourseClick} />
                                        })
                                }
                            </div>
                        </div>

                    })
                }
            </div>
        </div>

    )
}

export default HomeScreen