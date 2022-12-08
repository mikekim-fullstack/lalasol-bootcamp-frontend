import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NavSubmenu.css'
import { useSelector, useDispatch } from 'react-redux'
import { getSelectedCat, setCat, setSelectedCat, getSelectedCatStatus, getAllCategories } from '../slices/categorySlice'
import { setCourses, getCourses } from '../slices/courseSlice'
import { setChapters, getChapters, setChapterCategory } from '../slices/chapterSlice'
import { setPathCourseID, setPathChapterID, getPathCourseID, getPathCatID, getPathChapterID } from '../slices/pathSlice'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getUser } from '../slices/userSlices'

const NavSubmenu = ({ className, clickedCat }) => {

    const navigate = useNavigate()
    // const [selectedChapter, setSelectedChapter] = useState(null)
    const dispatch = useDispatch()
    const selectedCat = useSelector(getSelectedCat)
    const courses = useSelector(getCourses)
    const chapters = useSelector(getChapters)
    const pathCatID = useSelector(getPathCatID)
    const pathCourseID = useSelector(getPathCourseID)
    const pathChapterID = useSelector(getPathChapterID)
    const user = useSelector(getUser)
    const categories = useSelector(getAllCategories)

    const [toggleRender, setToggleRender] = useState(false)

    const fetchEnrolledCourses = async (userId, selectedCatId) => {
        // console.log('user info:', process.env.REACT_APP_DEBUG, process.env.REACT_APP_BASE_URL, userId, selectedCatId)
        const url = user.role == 'student' ? `/api/student-course-enrollment/${userId}/${selectedCatId}`
            : `/api/courses-all-by-teacher-cat/${userId}/${selectedCatId}`
        await axios.get(url,
            {
                headers: {
                    "Content-type": "Application/Json",
                }
            }
        )
            .then(res => {
                // console.log('--fetchEnrolledCourses:', res.data)
                const sortedCourses = []
                const seq = categories.filter(cat => cat.id == selectedCatId)[0].course_list_sequence
                const sortedSeqKeys = Object.keys(seq).sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                sortedSeqKeys.forEach(key => {
                    const foundCourse = res.data.filter(course => course.id == Number(key))
                    if (foundCourse.length > 0) {
                        sortedCourses.push(foundCourse[0])
                    }
                })

                dispatch(setCourses(sortedCourses))
                // dispatch(setCourses(res.data))
                // console.log('done-NavCategories:', sortedCourses, res.data)
            })
            .catch(err => console.log('error: ', err))
    }
    const fetchChapters = async (course) => {
        const url = user?.role == 'teacher' ? axios.defaults.baseURL + `/api/course-chapter/${course.id}`
            : axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course.id}`
        await axios.get(url)
            .then(res => {
                // console.log('fetchChapters: ', res.data, ', course.chapter_list_sequence', course.chapter_list_sequence)
                dispatch(setChapters({ chapter_list_sequence: course.chapter_list_sequence, res_data: res.data }))

                const seq = course.chapter_list_sequence
                if (seq) {
                    const sortedKeys = Object.keys(seq).sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                    if (sortedKeys.length > 0) {
                        const chapterId = Number(sortedKeys[0])
                        dispatch(setPathChapterID(chapterId))
                        if (res.data?.length > 0) navigate(`chapter/${chapterId}/${user.id}`)
                        else navigate('screen404')
                    }
                }

                setToggleRender(!toggleRender)
            })
            .catch(err => console.log('error: ' + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course.id}`, err))
    }


    const handleCourseClick = async (e, course) => {
        // console.log('handleCourseClick:-course ', course)
        if (course?.chapter_list_sequence == null ||
            Object.keys(course.chapter_list_sequence).length < 1) {
            return
        }
        await fetchChapters(course)
        dispatch(setPathCourseID(course.id))
        // if (selectedCourse?.length == 1) navigate(`${subject}/${subjectId}`)
        // else navigate('screen404')

    }

    const handleSelectedChapter = (e) => {
        // -- Get subject name and id to pass them to the page through 
        //    the Navigation and Route to fetch data from server. --
        const path = e.target.name?.split(',')
        const chapter = 'chapter'//path[0].trim()
        const chapterId = parseInt(path[1].trim())
        dispatch(setPathChapterID(chapterId))
        // fetchCourse(chapter, chapterId)
        // const selectedCourse = courses?.filter((course) => course.id == chapterId)
        if (chapters?.length > 0) navigate(`${chapter}/${chapterId}/${user.id}`)
        else navigate('screen404')
        // console.log('handleSelectedChapter--click: ', chapter, chapterId)
    }
    const handleAddCourse = (e) => {
        // console.log('handleAddCourse-clicked')
        navigate('/add-course', { replace: true })
        // navigate(0)
        // window.location.reload()
    }
    useEffect(() => {
        if (user?.id && pathCatID) {
            fetchEnrolledCourses(user.id, pathCatID)
        }
        // console.log('------- refreshed --------')
    }, [pathCatID])
    useEffect(() => {
        // console.log('useEffectchapters', chapters)
    }, [toggleRender])
    // console.log('--NavSubmenu - ', pathChapterID, ', selectedCat=', selectedCat)
    return (
        // -- Display courses. --
        <div className={`nav__submenu ${className}`}>
            {user.role == 'teacher' &&
                <div className='add_course' onClick={handleAddCourse}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.25 3.25h7.5v7.5h-7.5Zm1.5 1.5v4.5Zm8.5-1.5h7.5v7.5h-7.5Zm1.5 1.5v4.5Zm-11.5 8.5h7.5v7.5h-7.5Zm1.5 1.5v4.5Zm11.5-1.5h1.5v3h3v1.5h-3v3h-1.5v-3h-3v-1.5h3Zm-1.5-8.5v4.5h4.5v-4.5Zm-10 0v4.5h4.5v-4.5Zm0 10v4.5h4.5v-4.5Z" /></svg>
                    <span>Manage Course</span>
                </div>
            }
            <div className='submenu__title'>Courses - {selectedCat && selectedCat[1]}</div>
            <div className='submenu__courses'>
                {courses?.map((course) => (
                    <div key={course.id}>
                        <div

                            className={`submenu__course_btn ${pathCourseID == course.id && 'btn_selected'}`}
                            onClick={(e) => handleCourseClick(e, course)}>
                            <img width='30px' height='30px' src={course.course_image.includes('http') ? course.course_image : axios.defaults.baseURL + course.course_image}></img>
                            <span>{course.title}</span>

                        </div>
                        {/* -- Display chapters from selected chaper. -- */}

                        {!selectedCat.status && pathCourseID == course.id && (
                            <div className='submenu__course_content'>
                                {

                                    chapters && chapters.length > 0 ? chapters.map((chapter, index) => {
                                        return <button onClick={handleSelectedChapter}
                                            key={chapter.id}
                                            name={` ${chapter.name}, ${chapter.id}`}
                                            // className={`content__subject btn_chapter_selected`}>
                                            className={`content__subject ${pathChapterID == chapter.id && 'btn_selected'}`}>
                                            {chapter.name}:{chapter.viewed}/{chapter.content.length}
                                        </button>

                                    }) : <div></div>
                                }
                            </div>
                        )}
                    </div>
                )
                )}
            </div>

            {/* -- Display chapters from selected chaper. --
            {!selectedCat.status && (
                <div className='submenu__course_content'>
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
            )} */}


        </div>
    )
}

export default NavSubmenu
