import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClickedChapter, setClickedChapter } from '../slices/chapterSlice'
import axios from 'axios'
import './EditChapter.css'

const EditChapter = ({ createChapter }) => {
    const titleRef = useRef(null)
    const subTitleRef = useRef(null)
    const descriptionRef = useRef(null)
    const clickedChapter = useSelector(getClickedChapter)
    const [inputData, setInputData] = useState({ title: null, sub_title: null, description: null })
    const handleValueChanged = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
        // console.log(e.target.value)
    }
    const dispatchChapter = async (method) => {
        await axios({
            method,
            url: axios.defaults.baseURL + ''
        })
    }
    const handleSubmitForm = (e) => {
        e.preventDefault()
        console.log('handleSubmitForm - ', e.target.innerText.toLowerCase())
        if (e.target.innerText.toLowerCase() == 'update') {


        }
        else if (e.target.innerText.toLowerCase() == 'create') {

        }
    }

    useEffect(() => {
        // clickedChapter && setInputData({
        //     title: clickedChapter.title,
        //     sub_title: clickedChapter.sub_title,
        //     description: clickedChapter.description
        // })

        /** Set input initial values */

        if (createChapter) {
            titleRef.current.value = ''
            subTitleRef.current.value = ''
            descriptionRef.current.value = ''
        }
        else if (clickedChapter) {
            titleRef.current.value = clickedChapter?.title
            subTitleRef.current.value = clickedChapter?.sub_title
            descriptionRef.current.value = clickedChapter?.description
        }
        console.log('clickedChapter: ', clickedChapter, ', createChapter: ', createChapter)
    }, [clickedChapter?.id, createChapter])
    // console.log('EditChapter: ', clickedChapter)
    return (
        <div className='chapter_editor__component'>
            <div className='form'>
                <form onSubmit={handleSubmitForm}>
                    {/* {console.log('inputData', inputData)} */}

                    <input ref={titleRef} type='text' name='title' valule={inputData.title} onChange={handleValueChanged} placeholder='Title*' />
                    <input ref={subTitleRef} type='text' name='sub_title' valule={inputData.sub_title} onChange={handleValueChanged} placeholder='Sub Title*' />
                    <textarea ref={descriptionRef} name='description' rows='8' valule={inputData.description} onChange={handleValueChanged} placeholder='Description*' />

                    {createChapter ? <button type='submit' name='create'>Create</button>
                        : <button type='submit' name='upate'>Update</button>}
                </form>
            </div>

        </div>
    )
}

export default EditChapter

{/* <div className='chapter_editor__component'>

<form onSubmit={handleSubmitForm}>
    {console.log('inputData', inputData)}
    <div key={1}>
        <input type='text' name='title' defaultValue={clickedChapter.title} valule={inputData.title} onChange={handleValueChanged} placeholder='Title*' />
    </div>
    <input type='text' name='sub_title' valule={clickedChapter.sub_title} onChange={handleValueChanged} placeholder='Sub Title*' />
    <textarea name='description' rows='4' valule={clickedChapter.description} onChange={handleValueChanged} placeholder='Description*' />
    <button type='submit'></button>
</form>
</div> */}