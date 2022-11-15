import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { setCourses, getCourses, getCoursesEnrolledStatus, setCoursesEnrolledStatus } from '../slices/courseSlice'
import axios from 'axios'
import './AddUpdateCourse.css'
const AddUpdateCourse = ({ showLabel, category_id, teacher_id, course_no, handleSuccessUploading }) => {
    const navigate = useNavigate()
    const [inputData, setInputData] = useState({
        category: category_id,
        teacher: teacher_id,
        title: '',
        description: '',
        course_image: '',
        course_no: course_no,
    })
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const fileRef = useRef(null)
    const onSubmitAddUpdateCourseForm = (e) => {
        e.preventDefault()
        // setInputData({...inputData, course_no:})
        let formData = new FormData()
        // 
        // Object.entries(inputData).forEach((input, index) => console.log(input, index))
        Object.entries(inputData).forEach((input, index) => formData.append(input[0], input[1]))
        // console.log('onSubmitAddUpdateCourseForm--:', formData)
        axios({
            method: 'POST',
            url: axios.defaults.baseURL + '/api/courses-create/',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                // --- Reset input fields. ---
                setInputData({ ...inputData, title: '', description: '' })
                fileRef.current.value = "";//Resets the file name of the file input 
                setUploadSuccess(true)
                handleSuccessUploading(true)
                // window.location.reload()
            })
            .catch(res => { setUploadSuccess(false); console.log('onSubmitAddUpdateCourseForm--error: ', res.response.data); })
        // axios.post(axios.defaults.baseURL + '/api/courses-create/',
        //     formData,
        //     {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     })
        //     .then(res => console.log(res))
        //     .catch(res => console.log('onSubmitAddUpdateCourseForm--error: ', res.response.data))
    }
    console.log('category_id: ', category_id)
    const onHandleInputChange = (e) => {
        if (e.target.name == 'course_image') {
            setInputData({ ...inputData, [e.target.name]: e.target.files[0] })
        }
        else {
            setInputData({ ...inputData, [e.target.name]: e.target.value })
        }
    }
    return (
        <div className='add_update_course__form'>
            <form onSubmit={onSubmitAddUpdateCourseForm}>
                <div className='group-1'>
                    <div className='input'>
                        {showLabel && <label>Title</label>}
                        <input onChange={onHandleInputChange} value={inputData?.title} required type='text' name='title' placeholder='Enter Title*' />
                    </div>
                    <div>
                        {showLabel && <label>Description</label>}
                        <textarea onChange={onHandleInputChange} value={inputData?.description} row='1' required name='description' placeholder='Enter Description*' />
                    </div>
                </div>
                <div className='group-2'>
                    <div className='input_file'>
                        <input onChange={onHandleInputChange} ref={fileRef} required name='course_image' type='file' accept="image/*" />
                        <label>*Image</label>
                    </div>

                    <button type='submit'>Add</button>
                </div>
            </form>
        </div>
    )
}

export default AddUpdateCourse