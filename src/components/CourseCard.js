import React from 'react'
import './CourseCard.css'
import axios from 'axios'

const CourseCard = ({ cat, course, handleCourseClick }) => {
    return (
        <div
            className={`course__card_outline`}
            onClick={(e) => handleCourseClick(e, cat, course)}>
            <div className={`course__card`}>
                <div className='image'>
                    <img width='36px' height='36px' className={course.enrolled ? '' : 'svg_image_gray'} src={axios.defaults.baseURL + course.course_image}></img>
                </div>
                <div className='title'><span>{course.title}</span></div>
            </div>

        </div>
    )
}

export default CourseCard