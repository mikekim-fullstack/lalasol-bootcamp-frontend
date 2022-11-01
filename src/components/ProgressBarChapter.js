import React, { useState, useEffect } from 'react'
import './ProgressBarChapter.css'
import { useSelector, useDispatch } from 'react-redux'
import { getChapters, setChapters } from '../slices/chapterSlice'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../slices/userSlices'
import axios from 'axios'
import { setPathCourseID, setPathChapterID, getPathCatID, getPathCourseID, getPathChapterID, getPathID } from '../slices/pathSlice'
const ProgressBarChapter = () => {
    // const [pathCatID, pathCourseID, pathChapterID] = useSelector(getPathID)
    const pathCatID = useSelector(getPathCatID)
    const pathCourseID = useSelector(getPathCourseID)
    const pathChapterID = useSelector(getPathChapterID)
    const chapters = useSelector(getChapters)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(getUser)
    // const pathChapterID = useSelector(getPathChapterID)

    const handleSelectedChapter = (e) => {
        // -- Get subject name and id to pass them to the page through 
        //    the Navigation and Route to fetch data from server. --
        const path = e.target.name?.split(',')
        const chapter = 'chapter'//path[0].trim()
        const chapterId = parseInt(path[1].trim())
        dispatch(setPathChapterID(chapterId))
        // fetchCourse(chapter, chapterId)
        // const selectedCourse = courses?.filter((course) => course.id == chapterId)
        if (chapters?.length > 0) navigate(`/${chapter}/${chapterId}/${user.id}`, { replace: true })
        else navigate('screen404')


        console.log('handleSelectedChapter--click: ', chapter, chapterId)
    }

    // -----------------------------------
    const fetchChapters = async () => {
        await axios.get(axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${pathCourseID}`)
            .then(res => {
                // console.log('fetchChapters: ', res.data)
                dispatch(setChapters(res.data))
                // if (selectedCourse?.length == 1) navigate(`${subject}/${subjectId}`)
                // else navigate('screen404')
                // return axios.get(axios.defaults.baseURL + `/api/chapters-viewed/?student_id=${}&chapter_id=${course_id}/`)
            })
            // .then(res=>{
            //     console.log('chapter Viewed: ', res.data)
            // })
            .catch(err => console.log('error: ', err))
    }
    useEffect(() => {
        if (!chapters && user.id && pathCourseID && pathChapterID) {
            // console.log('---------- ProgressBarChapter-useEffect - ', JSON.parse(window.localStorage.getItem('navPath'))?.catID,
            //     JSON.parse(window.localStorage.getItem('navPath'))?.courseID,
            //     JSON.parse(window.localStorage.getItem('navPath'))?.chapterID)
            fetchChapters()
        }
        else if (!pathCourseID || !pathChapterID) {
            navigate('/', { replace: true })
        }
        // console.log('--- ProgressBarChapter-useEffect - chapters=', chapters, ', userid: ', user.id, ', courseId:', pathCourseID, ', chapterid', pathChapterID)
    }, [])



    // console.log('ProgressBarChapter - chapters: ', chapters)
    return (
        <div className='progressbar_chapters'>
            {
                chapters && chapters.length > 0 && chapters.map((chapter, index) => {
                    return <button onClick={handleSelectedChapter}
                        key={chapter.id}
                        name={` ${chapter.title}, ${chapter.id}`}
                        // className={`content__subject btn_chapter_selected`}>
                        className={`content__subject ${pathChapterID == chapter.id && 'btn_selected'}`}>
                        {chapter.title}:{chapter.viewed}/{chapter.content.length}
                    </button>
                })
            }
        </div>
    )
}

export default ProgressBarChapter