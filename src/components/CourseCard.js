import React from 'react'
import './CourseCard.css'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { getUser } from '../slices/userSlices'


const CourseCard = ({ cat, course, handleCourseClick, isTeacher }) => {
    const user = useSelector(getUser)
    return (
        <div
            className={`course__card_outline`}
            onClick={(e) => handleCourseClick(e, cat, course)}>
            <div className={`course__card`}>
                <div className='image'>
                    {/* {console.log('course: ', course)} */}
                    {/* <img width='36px' height='36px' className={course.enrolled || isTeacher ? '' : 'svg_image_gray'} src={axios.defaults.baseURL + course.course_image}></img> */}
                    <img width='36px' height='36px' className={course.enrolled || user.role == 'teacher' ? '' : 'svg_image_gray'} src={course.course_image.includes('http') ? course.course_image : axios.defaults.baseURL + course.course_image}></img>
                </div>
                <div className='title'><span>{course.title}</span></div>
            </div>

        </div>
    )
}

export default CourseCard