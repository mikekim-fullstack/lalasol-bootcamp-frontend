import React from 'react'
import './CourseEditCard.css'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { getUser } from '../slices/userSlices'
const CourseEditCard = ({ cat, course, handleClickCourse, isTeacher }) => {
    const user = useSelector(getUser)
    return (
        <div
            draggable
            className={`course__edit_card_outline`}
            onClick={(e) => handleClickCourse(e, cat, course)}>
            <div className={`course__edit_card`}>
                <div className='image'>
                    {/* <img width='36px' height='36px' className={course.enrolled || isTeacher ? '' : 'svg_image_gray'} src={axios.defaults.baseURL + course.course_image}></img> */}
                    {/* {console.log('course.course_image: ', course.course_image)} */}
                    <img width='36px' height='36px' className={course.enrolled || user.role == 'teacher' ? '' : 'svg_image_gray'} src={course.course_image.includes('http') ? course.course_image : axios.defaults.baseURL + course.course_image}></img>
                </div>
                <div className='title'><span>{course.title}</span></div>
            </div>

        </div>
    )
}

export default CourseEditCard