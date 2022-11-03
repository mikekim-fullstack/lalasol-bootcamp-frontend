import React, { useState, useEffect } from 'react'
import './AddCourse.css'
const AddCourse = () => {
    return (
        <div className='add_course__form'>
            <form>
                <div>
                    <label>Title</label>
                    <input type='text' placeholder='Enter Title' />
                </div>
                <div>
                    <label>Description</label>
                    <input type='textarea' placeholder='Enter Description' />
                </div>
                <div>
                    <label>Course Image</label>
                    <input type='file' accept="image/*" placeholder='Enter Title' />
                </div>
                <div>
                    <label>Course Number</label>
                    <input type='number' min='0' placeholder='Enter Course Number' />
                </div>
                <button type='submit'>Add</button>
            </form>
        </div>
    )
}

export default AddCourse