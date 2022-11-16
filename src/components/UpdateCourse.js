import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { setCourses, getCourses, getCoursesEnrolledStatus, setCoursesEnrolledStatus } from '../slices/courseSlice'
import axios from 'axios'
import './AddCourse.css'
const UpdateCourse = ({ showLabel, clickedCourseInfo, handleSuccessUploading }) => {
    const navigate = useNavigate()
    const [inputData, setInputData] = useState({
        category: clickedCourseInfo?.catId,

        title: clickedCourseInfo?.course?.title,
        description: clickedCourseInfo?.course?.description,
        course_image: '',
    })
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const fileRef = useRef(null)
    const onSubmitUpdateCourseForm = (e) => {
        e.preventDefault()
        // setInputData({...inputData, course_no:})
        let formData = new FormData()
        // 
        // Object.entries(inputData).forEach((input, index) => console.log(input, index))
        Object.entries(inputData).forEach((input, index) => {
            if (input[1])
                formData.append(input[0], input[1])
        })
        console.log('onSubmitUpdateCourseForm: ', inputData, formData)
        // return
        axios({
            method: 'PATCH',
            url: axios.defaults.baseURL + '/api/course-update/' + clickedCourseInfo?.course?.id,
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
                handleSuccessUploading(true, res.data.id, res.data.category, res.data.teacher)
                console.log('onSubmitUpdateCourseForm:', res)

            })

            .catch(res => { setUploadSuccess(false); console.log('onSubmitUpdateCourseForm--error: ', res.response.data); })
        // axios.post(axios.defaults.baseURL + '/api/courses-create/',
        //     formData,
        //     {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     })
        //     .then(res => console.log(res))
        //     .catch(res => console.log('onSubmitUpdateCourseForm--error: ', res.response.data))
    }
    console.log('clickedCourseInfo: ', clickedCourseInfo)
    const onHandleInputChange = (e) => {
        if (e.target.name == 'course_image') {
            setInputData({ ...inputData, [e.target.name]: e.target.files[0] })
        }
        else {
            setInputData({ ...inputData, [e.target.name]: e.target.value })
        }
    }
    return (
        <div className='add_course__form'>
            <form onSubmit={onSubmitUpdateCourseForm}>
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
                        <input onChange={onHandleInputChange} ref={fileRef} name='course_image' type='file' accept="image/*" />
                        <label >{inputData?.course_image ? '*Image' : clickedCourseInfo?.course?.course_image?.split('/').pop().length > 6 ? clickedCourseInfo?.course?.course_image?.split('/').pop().substr(0, 6) + '...' : clickedCourseInfo?.course?.course_image?.split('/').pop()}</label>
                    </div>

                    <button type='submit'>Update</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateCourse