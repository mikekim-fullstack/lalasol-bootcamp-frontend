import React, { useState, useEffect } from 'react'
import './ProgressBarChapter.css'
import { useSelector, useDispatch } from 'react-redux'
import { getClickedCourse, setClickedCourse } from '../slices/courseSlice'
import { getChapters, setChapters, setClickedChapter } from '../slices/chapterSlice'
import { setPathCatID } from '../slices/pathSlice'
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
    const clickedCourse = useSelector(getClickedCourse)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(getUser)
    // const pathChapterID = useSelector(getPathChapterID)

    const handleSelectedChapter = (e) => {
        // -- Get subject name and id to pass them to the page through 
        //    the Navigation and Route to fetch data from server. --
        // const path = e.target.name?.split(',')
        const chapter = 'chapter'//path[0].trim()
        const chapterId = e.target.name;//parseInt(path[1].trim())
        dispatch(setPathChapterID(chapterId))
        // fetchCourse(chapter, chapterId)
        // const selectedCourse = courses?.filter((course) => course.id == chapterId)
        if (chapters?.length > 0) navigate(`/${chapter}/${chapterId}/${user.id}`, { replace: true })
        else navigate('screen404')


        // console.log('handleSelectedChapter--click: ', chapter, chapterId)
    }


    // -----------------------------------
    const fetchCourse = async (course_id) => {
        if (!course_id) return
        const url = axios.defaults.baseURL + `/api/course/${course_id}`
        await axios({
            method: 'GET',
            url,
        })
            .then(res => {
                const course = res.data
                // console.log('fetchCourse:  course-', clickedCourse?.course, ', response: ', course, ', endpoint-', url)
                dispatch(setClickedCourse({ catId: course.category, courseId: course.id, course: course }))
                dispatch(setPathCatID(course.category))
                dispatch(setPathCourseID(course.id))

                const seq = course.chapter_list_sequence
                if (seq) {
                    const keyChapters = Object.keys(seq)
                    if (keyChapters.length > 0) {
                        // select the first chapter
                        const sortedChapterKeys = keyChapters.sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                        dispatch(setPathChapterID(Number(sortedChapterKeys[0])))
                    }
                    else {
                        dispatch(setPathChapterID(null))
                    }
                }
                else {
                    dispatch(setPathChapterID(null))
                }
                dispatch(setClickedChapter(null))


                //setIsCompleteFetchChapter(!isCompleteFetchChapter)
                fetchChapters(course)
            })
            .catch(err => console.log('error: ' + url, err))
    }

    // -----------------------------------
    const fetchChapters = async (course) => {
        const url = user?.role == 'teacher' ? axios.defaults.baseURL + `/api/course-chapter/${pathCourseID}`
            : axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${pathCourseID}`
        await axios.get(url)
            // await axios.get(axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${pathCourseID}`)
            .then(res => {
                console.log('fetchChapters: ', res.data, ', clickedCourse', course)
                // dispatch(setChapters(res.data))
                // if (selectedCourse?.length == 1) navigate(`${subject}/${subjectId}`)
                // else navigate('screen404')
                // return axios.get(axios.defaults.baseURL + `/api/chapters-viewed/?student_id=${}&chapter_id=${course_id}/`)
                dispatch(setChapters({ chapter_list_sequence: course?.chapter_list_sequence, res_data: res.data }))
            })
            // .then(res=>{
            //     console.log('chapter Viewed: ', res.data)
            // })
            .catch(err => console.log('error: ' + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${pathCourseID}`, err))
    }
    useEffect(() => {
        if (!chapters && user.id && pathCourseID && pathChapterID) {
            // console.log('---------- ProgressBarChapter-useEffect - ', JSON.parse(window.localStorage.getItem('navPath'))?.catID,
            //     JSON.parse(window.localStorage.getItem('navPath'))?.courseID,
            //     JSON.parse(window.localStorage.getItem('navPath'))?.chapterID)
            if (pathCourseID) fetchCourse(pathCourseID)

        }
        else if (!pathCourseID || !pathChapterID) {
            navigate('/', { replace: true })
        }
        console.log('--- ProgressBarChapter-useEffect - chapters=', chapters, ', userid: ', user.id, ', courseId:', pathCourseID, ', chapterid', pathChapterID)
    }, [])



    // console.log('ProgressBarChapter - chapters: ', chapters)
    return (
        <div className='progressbar_chapters'>
            {
                chapters && chapters.length > 0 && chapters.map((chapter, index) => {
                    return <button onClick={handleSelectedChapter}
                        key={chapter.id}
                        name={`${chapter.id}`}
                        // className={`content__subject btn_chapter_selected`}>
                        style={pathChapterID == chapter.id ? { backgroundColor: 'rgb(355, 212, 0)' } : { backgroundColor: 'rgb(212, 255, 0)' }}
                        className={`content__subject ${pathChapterID == chapter.id && 'btn_selected'}`}>
                        {chapter.name}
                    </button>
                })
            }
        </div>
    )
}

export default ProgressBarChapter