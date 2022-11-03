import React, { useState, useEffect } from 'react'
import './AddCourse.css'
const AddCourse = ({ showLabel }) => {
    return (
        <div className='add_course__form'>
            <form>
                <div className='input'>
                    {showLabel && <label>Title</label>}
                    <input required type='text' name='add_course' placeholder='Enter Title*' />
                </div>
                <div>
                    {showLabel && <label>Description</label>}
                    <textarea required name='add_course' placeholder='Enter Description*' />
                </div>
                <div className='input_file'>
                    <label>Image</label>
                    <input required name='add_course' type='file' accept="image/*" />
                </div>
                {/* <label className="file">
                    <input type="file" id="file" aria-label="File browser example" />
                    <span class="file-custom"></span>
                </label> */}

                {/* <div>
                    <label>Course Number</label>
                    <input type='number' min='0' placeholder='Enter Course Number' />
                </div> */}
                <button type='submit'>Add</button>
            </form>
        </div>
    )
}

export default AddCourse