import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NavSubmenu.css'
import { useSelector, useDispatch } from 'react-redux'
import { getSelectedCat, setCat, setSelectedCat, getSelectedCatStatus } from '../slices/categorySlice'
import { setCourses, getCourses } from '../slices/courseSlice'
import { setChapters, getChapters, setChapterCategory } from '../slices/chapterSlice'
import { setPathCourseID, setPathChapterID, getPathCourseID, getPathChapterID } from '../slices/pathSlice'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getUser } from '../slices/userSlices'

const NavSubmenu = ({ className, clickedCat }) => {
    // -- This is temporary data set and later this data will be
    //    fetched from server.
    // --

    // const allCoursesData = [
    //     {
    //         id: 0,
    //         cat_id: 8,
    //         title: 'HTML Intro',
    //         courses: [{ 'id': 1, 'title': 'Reading' }, { 'id': 2, 'title': 'Video #1' }, { 'id': 3, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 1, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 1, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 1, 'title': 'Course Projects' }, { 'id': 2, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 1, 'title': 'Skills' }],
    //         references: [{ 'id': 1, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 1,
    //         cat_id: 8,
    //         title: 'HTML Level 1',
    //         courses: [{ 'id': 4, 'title': 'Reading' }, { 'id': 5, 'title': 'Video #1' }, { 'id': 6, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 2, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 2, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 3, 'title': 'Course Projects' }, { 'id': 4, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 2, 'title': 'Skills #1' }],
    //         references: [{ 'id': 2, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 2,
    //         cat_id: 8,
    //         title: 'HTML Level 2',
    //         courses: [{ 'id': 7, 'title': 'Reading' }, { 'id': 8, 'title': 'Video #1' }, { 'id': 9, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 3, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 3, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 5, 'title': 'Course Projects' }, { 'id': 6, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 3, 'title': 'Skills #1' }],
    //         references: [{ 'id': 3, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 3,
    //         cat_id: 8,
    //         title: 'HTML Level 3',
    //         courses: [{ 'id': 7, 'title': 'HTML Reading' }, { 'id': 8, 'title': 'Video #1' }, { 'id': 9, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 4, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 4, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 7, 'title': 'Course Projects' }, { 'id': 8, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 4, 'title': 'Skills #1' }],
    //         references: [{ 'id': 4, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 4,
    //         cat_id: 6,
    //         title: 'CSS Intro',
    //         courses: [{ 'id': 10, 'title': 'CSS Reading' }, { 'id': 11, 'title': 'Video #1' }, { 'id': 12, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 5, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 5, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 9, 'title': 'Course Projects' }, { 'id': 10, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 5, 'title': 'Skills #1' }],
    //         references: [{ 'id': 5, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 5,
    //         cat_id: 6,
    //         title: 'CSS Level 1',
    //         courses: [{ 'id': 13, 'title': 'CSS Reading' }, { 'id': 14, 'title': 'Video #1' }, { 'id': 15, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 6, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 6, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 11, 'title': 'Course Projects' }, { 'id': 12, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 6, 'title': 'Skills #1' }],
    //         references: [{ 'id': 6, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 6,
    //         cat_id: 6,
    //         title: 'CSS Level 2',
    //         courses: [{ 'id': 16, 'title': 'CSS Reading' }, { 'id': 17, 'title': 'Video #1' }, { 'id': 18, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 7, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 7, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 13, 'title': 'Course Projects' }, { 'id': 14, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 7, 'title': 'Skills #1' }],
    //         references: [{ 'id': 7, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 7,
    //         cat_id: 6,
    //         title: 'CSS Level 3',
    //         courses: [{ 'id': 19, 'title': 'CSS Reading' }, { 'id': 20, 'title': 'Video #1' }, { 'id': 21, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 8, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 8, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 15, 'title': 'Course Projects' }, { 'id': 16, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 8, 'title': 'Skills #1' }],
    //         references: [{ 'id': 8, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 8,
    //         cat_id: 6,
    //         title: 'CSS Level 4',
    //         courses: [{ 'id': 22, 'title': 'CSS Reading' }, { 'id': 23, 'title': 'Video #1' }, { 'id': 24, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 9, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 9, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 17, 'title': 'Course Projects' }, { 'id': 18, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 9, 'title': 'Skills #1' }],
    //         references: [{ 'id': 9, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 9,
    //         cat_id: 6,
    //         title: 'CSS Level 5',
    //         courses: [{ 'id': 25, 'title': 'CSS Reading' }, { 'id': 26, 'title': 'Video #1' }, { 'id': 27, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 10, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 10, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 19, 'title': 'Course Projects' }, { 'id': 20, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 10, 'title': 'Skills #1' }],
    //         references: [{ 'id': 10, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 10,
    //         cat_id: 5,
    //         title: 'JavaScript  Intro',
    //         courses: [{ 'id': 28, 'title': 'JavaScript Reading' }, { 'id': 29, 'title': 'Video #1' }, { 'id': 30, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 11, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 11, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 21, 'title': 'Course Projects' }, { 'id': 22, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 11, 'title': 'Skills #1' }],
    //         references: [{ 'id': 11, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 11,
    //         cat_id: 5,
    //         title: 'JavaScript  Level 1',
    //         courses: [{ 'id': 31, 'title': 'JavaScript Reading 1' }, { 'id': 32, 'title': 'Video #1' }, { 'id': 33, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 12, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 12, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 23, 'title': 'Course Projects' }, { 'id': 24, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 12, 'title': 'Skills #1' }],
    //         references: [{ 'id': 12, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 12,
    //         cat_id: 5,
    //         title: 'JavaScript  Level 2',
    //         courses: [{ 'id': 34, 'title': 'JavaScript Reading 1' }, { 'id': 35, 'title': 'Video #1' }, { 'id': 36, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 13, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 13, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 25, 'title': 'Course Projects' }, { 'id': 26, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 32, 'title': 'Skills #1' }],
    //         references: [{ 'id': 13, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 13,
    //         cat_id: 4,
    //         title: 'Data Structure Intro',
    //         courses: [{ 'id': 37, 'title': 'Data Structure Reading 1' }, { 'id': 38, 'title': 'Video #1' }, { 'id': 39, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 14, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 14, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 27, 'title': 'Course Projects' }, { 'id': 28, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 14, 'title': 'Skills #1' }],
    //         references: [{ 'id': 14, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 14,
    //         cat_id: 4,
    //         title: 'Data Structure Level 1',
    //         courses: [{ 'id': 40, 'title': 'Data Structure Reading 1' }, { 'id': 41, 'title': 'Video #1' }, { 'id': 42, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 15, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 15, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 29, 'title': 'Course Projects' }, { 'id': 30, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 15, 'title': 'Skills #1' }],
    //         references: [{ 'id': 15, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 15,
    //         cat_id: 4,
    //         title: 'Data Structure Level 2',
    //         courses: [{ 'id': 43, 'title': 'Data Structure Reading 2' }, { 'id': 44, 'title': 'Video #1' }, { 'id': 45, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 16, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 16, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 31, 'title': 'Course Projects' }, { 'id': 32, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 16, 'title': 'Skills #1' }],
    //         references: [{ 'id': 16, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 18,
    //         cat_id: 3,
    //         title: 'React JS Intro',
    //         courses: [{ 'id': 46, 'title': 'React JS Reading' }, { 'id': 47, 'title': 'Video #1' }, { 'id': 48, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 17, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 17, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 33, 'title': 'Course Projects' }, { 'id': 34, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 17, 'title': 'Skills #1' }],
    //         references: [{ 'id': 17, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 19,
    //         cat_id: 3,
    //         title: 'React JS Level 1',
    //         courses: [{ 'id': 49, 'title': 'React JS Reading 1' }, { 'id': 50, 'title': 'Video #1' }, { 'id': 51, 'title': 'Video #2' }],
    //         quiz: [{ 'id': 18, 'title': 'Quiz' }],
    //         homeworks: [{ 'id': 18, 'title': 'Home Work #1' }],
    //         projects: [{ 'id': 35, 'title': 'Course Projects' }, { 'id': 36, 'title': 'Interview Projects' }],
    //         skills: [{ 'id': 18, 'title': 'Skills #1' }],
    //         references: [{ 'id': 18, 'title': 'Reference' }],
    //     },
    //     {
    //         id: 24,
    //         cat_id: 9,
    //         title: 'Practice 1',
    //         practices: [{ 'id': 1, 'title': 'Beginner' }, { 'id': 2, 'title': 'Intermediate' }, { 'id': 3, 'title': 'Advanced' }],
    //     },
    //     {
    //         id: 25,
    //         cat_id: 2,
    //         title: 'General 1',
    //         general: [{ 'id': 1, 'title': 'General' },],
    //     },
    //     {
    //         id: 26,
    //         cat_id: 1,
    //         title: 'HR 1',
    //         hr: [{ 'id': 1, 'title': 'HR' },],
    //     },
    //     //-------------------------------


    // ]
    const navigate = useNavigate()
    // const [selectedChapter, setSelectedChapter] = useState(null)
    const dispatch = useDispatch()
    const selectedCat = useSelector(getSelectedCat)
    const courses = useSelector(getCourses)
    const chapters = useSelector(getChapters)
    const pathCourseID = useSelector(getPathCourseID)
    const pathChapterID = useSelector(getPathChapterID)
    const user = useSelector(getUser)

    const fetchChapters = async (course) => {
        const url = user?.role == 'teacher' ? axios.defaults.baseURL + `/api/course-chapter/${course.id}`
            : axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course.id}`
        await axios.get(url)
            .then(res => {
                console.log('fetchChapters: ', res.data)
                dispatch(setChapters({ chapter_list_sequence: course.chapter_list_sequence, res_data: res.data }))
                // if (selectedCourse?.length == 1) navigate(`${subject}/${subjectId}`)
                // else navigate('screen404')
                // return axios.get(axios.defaults.baseURL + `/api/chapters-viewed/?student_id=${}&chapter_id=${course_id}/`)
            })
            // .then(res=>{
            //     console.log('chapter Viewed: ', res.data)
            // })
            .catch(err => console.log('error: ' + `/api/fetch-viewed-chapters-bycourse/?user_id=${user.id}&course_id=${course.id}`, err))
    }


    const handleCourseClick = async (e, course) => {
        // console.log('handleCourseClick: ', courseid)
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


        console.log('handleSelectedChapter--click: ', chapter, chapterId)
    }
    const handleAddCourse = (e) => {
        console.log('handleAddCourse-clicked')
        navigate('/add-course', { replace: true })
        // navigate(0)
        // window.location.reload()
    }
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
                                    chapters && chapters.length > 0 && chapters.map((chapter, index) => {
                                        return <button onClick={handleSelectedChapter}
                                            key={chapter.id}
                                            name={` ${chapter.name}, ${chapter.id}`}
                                            // className={`content__subject btn_chapter_selected`}>
                                            className={`content__subject ${pathChapterID == chapter.id && 'btn_selected'}`}>
                                            {chapter.name}:{chapter.viewed}/{chapter.content.length}
                                        </button>

                                    })
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
