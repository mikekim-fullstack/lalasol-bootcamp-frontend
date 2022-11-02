import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getSelectedCat, setCat, getCats, setSelectedCat, getSelectedCatStatus } from '../slices/categorySlice'
import { setCourses, getCourses, getCoursesEnrolledStatus } from '../slices/courseSlice'
import { setChapters, getChapters } from '../slices/chapterSlice'
import axios from 'axios'
import './HomeScreen.css'

const HomeScreen = () => {
    const dispatch = useDispatch()
    const categories = useSelector(getCats)
    // const courses = useSelector(getCourses)
    const coursesEnrolled = useSelector(getCoursesEnrolledStatus)
    const chapters = useSelector(getChapters)

    console.log('---HomeScreen ---categories: ', categories)
    console.log('---HomeScreen ---courses: ', coursesEnrolled)
    const handleCourseClick = (e, category_id, course_id) => {
        console.log('handleCourseClick: ', category_id, course_id)
    }
    return (

        <div className='home__screen'>
            <div className='content'>
                {
                    categories && categories.map((cat) => {
                        console.log(cat)
                        return <div key={cat[0]}>
                            <div className='categories' >
                                <span>{cat[1]}</span>&nbsp;-&nbsp;{cat[2]}
                            </div>
                            <div className='courses'>
                                {
                                    coursesEnrolled && coursesEnrolled.filter((course) => course.category == cat[0]).map((course) => {
                                        // console.log('course: ', course)
                                        return <div key={course.id}
                                            className={`course_outline`}
                                            onClick={(e) => handleCourseClick(e, course.category, course.id)}>
                                            <div className={`course_card`}>
                                                <div className='image'>
                                                    <img width='36px' height='36px' className={course.enrolled ? '' : 'svg_image_gray'} src={axios.defaults.baseURL + course.course_image}></img>
                                                </div>
                                                <div className='title'><span>{course.title}</span></div>
                                            </div>

                                        </div>
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