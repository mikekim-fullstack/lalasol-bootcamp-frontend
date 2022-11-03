import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { getSelectedCat, setCat, getCats, setSelectedCat, getSelectedCatStatus, setSelectedCatStatus } from '../slices/categorySlice'
import { setCourses, getCourses, getCoursesEnrolledStatus, setCoursesEnrolledStatus } from '../slices/courseSlice'
import { setChapters, getChapters } from '../slices/chapterSlice'
import { setPathCourseID, setPathCatID, resetPathAll, setPathChapterID, getPathCourseID, getPathChapterID } from '../slices/pathSlice'
import { getUser } from '../slices/userSlices'
import axios from 'axios'
import './AddCourseScreen.css'
import CourseCard from '../components/CourseCard'
import AddCourse from '../components/AddCourse'

const AddCourseScreen = () => {

    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const categories = useSelector(getCats)
    // const courses = useSelector(getCourses)
    const coursesEnrolled = useSelector(getCoursesEnrolledStatus)
    const chapters = useSelector(getChapters)


    const [selCatID, setSelCatID] = useState([])
    const [isUpdatedCourse, setIsUpdatedCourse] = useState(false)

    // console.log('---add_courseScreen ---categories: ', categories)
    // console.log('---add_courseScreen ---courses: ', coursesEnrolled)

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
                console.log('done')
            })
            .catch(err => console.log('error: ', err))
    }

    const fetchChapters = async (course_id) => {
        await axios.get(axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course_id}`)
            .then(res => {
                // console.log('fetchChapters: ', res.data)
                dispatch(setChapters(res.data))
            })
            .catch(err => console.log('error: ', err))
    }



    const handleCourseClick = async (e, cat, course) => {
        const catId = course.category
        const courseid = course.id

        await fetchEnrolledCourses(user.id, catId)

        dispatch(setSelectedCat(cat))
        dispatch(resetPathAll())
        dispatch(setPathCatID(catId))
        dispatch(setChapters(null))

        await fetchChapters(courseid)
        dispatch(setPathCourseID(courseid))
        dispatch(setSelectedCatStatus(true))
    }
    const handleAddCourse = (e, cat, index) => {
        const _selCatID = [...selCatID]
        _selCatID[index] = !_selCatID[index]
        setSelCatID([..._selCatID])
        // console.log('add_courseScreen-cat:', _selCatID, cat[0], index)
    }

    const handleSuccessUploading = (status) => {
        setIsUpdatedCourse(status)
    }
    useEffect(() => {
        // console.log('categories', categories, categories.length, selCatID)
        if (categories)
            setSelCatID(new Array(categories.length).fill(false))
    }, [categories, isUpdatedCourse, coursesEnrolled])

    useEffect(() => {
        if (isUpdatedCourse) {
            axios({
                method: 'GET',
                url: `/api/courses-enrolled-status/${user?.id}`,
                headers: {
                    'Content-Type': 'Application/Json'
                },
            })
                .then(res => {
                    dispatch(setCoursesEnrolledStatus(res.data))
                    setIsUpdatedCourse(false)
                    // console.log('----- successfully course uploaded', res.data)

                })
                .catch(error => console.log(error.response.data))
        }
        // console.log('-----useEffect-isUpdatedCourse ----:', isUpdatedCourse)
    }, [isUpdatedCourse])
    return (

        <div className='add_course__screen'>
            <div className='add_course__screen_content'>
                <h1>Add Courses</h1>
                {
                    categories && categories.map((cat, index) => {
                        // console.log('add_courseScreen-cat:', cat)
                        return <div key={cat[0]}>
                            <div className='categories' >
                                <div className='title'>
                                    <div><span>{cat[1]}</span>&nbsp;-&nbsp;{cat[2]}</div>
                                    <svg onClick={e => handleAddCourse(e, cat, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M10.85 19.15v-6h-6v-2.3h6v-6h2.3v6h6v2.3h-6v6Z" /></svg>
                                </div>
                                {selCatID[index] && <AddCourse category_id={cat[0]} teacher_id={1} handleSuccessUploading={handleSuccessUploading} />}
                            </div>
                            <div className='courses'>
                                {
                                    coursesEnrolled && coursesEnrolled.filter((course) => course.category == cat[0]).map((course) => {
                                        // console.log('course: ', course)
                                        return <CourseCard key={course.id} cat={cat} course={course} handleCourseClick={handleCourseClick} />
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

export default AddCourseScreen