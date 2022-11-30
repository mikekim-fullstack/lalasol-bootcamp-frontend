import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getSelectedCat, setCat, getCats, setSelectedCat, getSelectedCatStatus, setSelectedCatStatus } from '../slices/categorySlice'
import { setCourses, getCourses, getCoursesEnrolledStatus } from '../slices/courseSlice'
import { setChapters, getChapters } from '../slices/chapterSlice'
import { setPathCourseID, setPathCatID, resetPathAll, setPathChapterID, getPathCourseID, getPathChapterID } from '../slices/pathSlice'
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

    // console.log('---HomeScreen ---categories: ', categories)
    // console.log('---HomeScreen ---courses: ', coursesEnrolled)

    const fetchEnrolledCourses = async (userId, selectedCatId) => {
        console.log('user info:', process.env.REACT_APP_DEBUG, process.env.REACT_APP_BASE_URL, userId, selectedCatId)
        // await axios.get(process.env.REACT_APP_BASE_URL + `/api/course/${subjectId}`,

        await axios.get(axios.defaults.baseURL + `/api/student-course-enrollment/${userId}/${selectedCatId}`,
            {
                headers: {
                    "Content-type": "Application/Json",
                }
            }
        )
            .then(res => {
                // console.log('--fetchEnrolledCourses:', res.data)
                dispatch(setCourses(res.data))
                console.log('done-homescreen')
            })
            .catch(err => console.log('error: ' + `/api/student-course-enrollment/${userId}/${selectedCatId}`, err))
    }

    const fetchChapters = async (course_id) => {
        await axios.get(axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course_id}`)
            .then(res => {
                // console.log('fetchChapters: ', res.data)
                dispatch(setChapters(res.data))
            })
            .catch(err => console.log('error: ' + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course_id}`, err))
    }



    const handleCourseClick = async (e, cat, course) => {
        const catId = course.category
        const courseid = course.id
        // console.log('handleCourseClick: ', cat, catId, courseid)

        // const _sortedCat = sortedCat[e.target.name]
        // console.log('handleSelectCategoryClick: ', _sortedCat)

        // -- For letting the submenu(sideBar) to only show the subject lists not showing 
        //    previous items of selected subject. --
        // const catId = _sortedCat[0]
        // const catTitle = _sortedCat[1]
        await fetchEnrolledCourses(user.id, catId)

        dispatch(setSelectedCat(cat))
        dispatch(resetPathAll())
        dispatch(setPathCatID(catId))
        dispatch(setChapters(null))

        await fetchChapters(courseid)
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
                                {
                                    coursesEnrolled && coursesEnrolled
                                        .filter((course) => course.category == cat[0])
                                        .sort((a, b) => a.course_no > b.course_no ? 1 : a.course_no < b.course_no ? -1 : 0)
                                        .map((course) => {
                                            // console.log('course: ', course)
                                            return <CourseCard id='id_course_card' key={course.id} cat={cat} course={course} handleCourseClick={handleCourseClick} />
                                        })
                                }
                            </div>
                            {/* <div className='courses'>
                                {
                                    coursesEnrolled && coursesEnrolled.filter((course) => course.category == cat[0]).map((course) => {
                                        // console.log('course: ', course)
                                        return <div key={course.id}
                                            className={`course_outline`}
                                            onClick={(e) => handleCourseClick(e, cat, course)}>
                                            <div className={`course_card`}>
                                                <div className='image'>
                                                    <img width='36px' height='36px' className={course.enrolled ? '' : 'svg_image_gray'} src={axios.defaults.baseURL + course.course_image}></img>
                                                </div>
                                                <div className='title'><span>{course.title}</span></div>
                                            </div>

                                        </div>
                                    })
                                }
                            </div> */}
                        </div>

                    })
                }
            </div>
        </div>

    )
}

export default HomeScreen