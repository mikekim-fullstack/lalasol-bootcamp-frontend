import React from 'react'
import { useParams } from 'react-router-dom'
import './CourseScreen.css'
const CourseScreen = () => {
    const { course_id } = useParams()
    return (

        <div className='course__screen'>
            CourseScreen {course_id}
            <h1>CourseScreen 1</h1>
            <h1>CourseScreen 2</h1>
            <h1>CourseScreen 3</h1>
            <h1>CourseScreen 4</h1>
            <h1>CourseScreen 5</h1>
            <h1>CourseScreen 5</h1>
        </div>

    )
}

export default CourseScreen