import React from 'react'
import './CourseEditCard.css'
import axios from 'axios'

const CourseEditCard = ({ cat, course, handleCourseClick, isTeacher }) => {
    return (
        <div
            draggable
            className={`course__edit_card_outline`}
            onClick={(e) => handleCourseClick(e, cat, course)}>
            <div className={`course__edit_card`}>
                <div className='image'>
                    <img width='36px' height='36px' className={course.enrolled || isTeacher ? '' : 'svg_image_gray'} src={axios.defaults.baseURL + course.course_image}></img>
                </div>
                <div className='title'><span>{course.title}</span></div>
            </div>

        </div>
    )
}

export default CourseEditCard