import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { getSelectedCat, setCat, getCats, setSelectedCat, getSelectedCatStatus, setSelectedCatStatus } from '../slices/categorySlice'
import { setCourses, getCourses, getCoursesEnrolledStatus, setCoursesEnrolledStatus } from '../slices/courseSlice'
import { setChapters, getChapters, setClickedChapter } from '../slices/chapterSlice'
import { setPathCourseID, setPathCatID, resetPathAll, setPathChapterID, getPathCourseID, getPathChapterID } from '../slices/pathSlice'
import { getUser } from '../slices/userSlices'
import axios from 'axios'
import './AddCourseScreen.css'
import '../components/CourseEditCard.css'
import CourseEditCard from '../components/CourseEditCard'
import AddCourse from '../components/AddCourse'
import AddChapter from '../components/AddChapter'

const AddCourseScreen = () => {

    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const categories = useSelector(getCats)
    // const courses = useSelector(getCourses)
    const coursesEnrolled = useSelector(getCoursesEnrolledStatus)
    const chapters = useSelector(getChapters)


    const [selCatID, setSelCatID] = useState([])
    const [isUpdatedCourse, setIsUpdatedCourse] = useState(false)
    const [clickedCourseInfo, setClickedCourseInfo] = useState({ catId: null, courseId: null, foundCard: null, course: null })


    // console.log('---add_courseScreen ---categories: ', categories)
    // console.log('---add_courseScreen ---courses: ', coursesEnrolled)

    const fetchEnrolledCourses = async (userId, selectedCatId) => {
        console.log('user info:', process.env.REACT_APP_DEBUG, process.env.REACT_APP_BASE_URL, userId, selectedCatId)
        // await axios.get(process.env.REACT_APP_BASE_URL + `/api/course/${subjectId}`,

        await axios.get(axios.defaults.baseURL + `/api/student-course-enrollment/${userId}/${selectedCatId}`,
            {
                headers: {
                    "Content-type": "Application/Json",
                }
            }
        )
            .then(res => {
                // console.log('--fetchEnrolledCourses:', res.data)
                dispatch(setCourses(res.data))
                console.log('done')
            })
            .catch(err => console.log('error: ', err))
    }




    /**
     * Handling when the add category sign(+)
     * 1. setSelCatID: storing which the category is clicked (boolean array).
     * 2. Change the color whoes category is selected .
     * @param {*} e 
     * @param {*} cat 
     * @param {*} index 
     */
    const handleAddCourse = (e, cat, index) => {
        /** -- [setCatID] stores boolean showing which category clicked(true) in array [true, false, ...]. --*/
        const _selCatID = [...selCatID]
        _selCatID[index] = !_selCatID[index]
        setSelCatID([..._selCatID])

        /** -- Change color targeting the clicked category + sign. -- */
        const catid = cat[0]
        const catEle = document.getElementById('add_category_' + catid + '_' + index)
        _selCatID[index] ? catEle.style.background = 'rgb(0, 86, 89)' : catEle.style.background = 'rgb(0, 46, 49)'


        // console.log('add_courseScreen-cat:', _selCatID, cat, index, catEle, _selCatID[index])
    }


    const handleCourseClick = async (e, cat, course) => {
        const catId = course.category
        const courseId = course.id

        /** Reset previous outline to nothing */
        if (clickedCourseInfo.foundCard) {
            clickedCourseInfo.foundCard.style['box-shadow'] = ''
            clickedCourseInfo.foundCard.style['-webkit-box-shadow'] = ''
            clickedCourseInfo.foundCard.style['-moz-box-shadow'] = ''
        }

        /** Find all .course__edit_card_outline class names and select only one which contains the 
         *  clicked element (e.target)
         */
        const course__edit_card_outline = document.querySelectorAll('.course__edit_card_outline')
        let foundCard = null
        for (let i = 0; i < course__edit_card_outline.length; i++) {
            if (course__edit_card_outline[i].contains(e.target)) {
                foundCard = course__edit_card_outline[i]
                break
            }
        }

        /** Once find the clicled element and highlight outline(box-shadow) */
        if (foundCard) {

            const shadowColor = '0px 0px 0px 6px rgba(0, 200,200 , 0.95)'//'0px 0px 0px 6px rgba(255, 0, 0, 0.5)'

            foundCard.style['border-radius'] = '5px'
            foundCard.style['box-shadow'] = shadowColor
            foundCard.style['-webkit-box-shadow'] = shadowColor
            foundCard.style['-moz-box-shadow'] = shadowColor
        }
        dispatch(setClickedChapter(null))
        /** Save catId, courseId, foundCard info and use it in rendering <div> */
        setClickedCourseInfo({ catId, courseId, foundCard, course })
        // console.log('handleCourseClick: ', catId, courseId, e.target, foundCard, (course__edit_card_outline))
    }
    const handleSuccessUploading = (status) => {
        setIsUpdatedCourse(status)
    }
    useEffect(() => {
        // console.log('categories', categories, categories.length, selCatID)
        if (categories)
            setSelCatID(new Array(categories.length).fill(false))
    }, [categories, isUpdatedCourse, coursesEnrolled])

    useEffect(() => {
        if (isUpdatedCourse) {
            axios({
                method: 'GET',
                url: `/api/courses-enrolled-status/${user?.id}`,
                headers: {
                    'Content-Type': 'Application/Json'
                },
            })
                .then(res => {
                    dispatch(setCoursesEnrolledStatus(res.data))
                    setIsUpdatedCourse(false)
                    // console.log('----- successfully course uploaded', res.data)

                })
                .catch(error => console.log(error.response.data))
        }
        // console.log('-----useEffect-isUpdatedCourse ----:', isUpdatedCourse)
    }, [isUpdatedCourse])
    return (

        <div className='add_course__screen'>
            <div className='add_course__screen_content'>
                <h1>Add Courses</h1>
                {
                    categories && categories.map((cat, index) => {
                        // console.log('add_courseScreen-cat:', cat)
                        const catId = cat[0]
                        const catTitle = cat[2]
                        return <div key={catId}>
                            <div className='categories' id={`add_category_${catId}_${index}`} style={{ backgroundColor: 'rgb(0, 46, 49)' }}>
                                <div className='title'>
                                    <div><span>{cat[1]}</span>&nbsp;-&nbsp;{cat[2]}</div>
                                    {/*-- + sign --*/}
                                    <svg onClick={e => handleAddCourse(e, cat, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M10.85 19.15v-6h-6v-2.3h6v-6h2.3v6h6v2.3h-6v6Z" /></svg>
                                </div>
                                {selCatID[index] && <AddCourse category_id={catId} teacher_id={1} handleSuccessUploading={handleSuccessUploading} />}
                            </div>
                            <div className='courses'>
                                {
                                    coursesEnrolled && coursesEnrolled.filter((course) => course.category == catId).map((course) => {
                                        // console.log('course: ', course)
                                        return (
                                            <div key={course.id}>
                                                <CourseEditCard cat={cat} course={course} isTeacher={true} handleCourseClick={handleCourseClick} />

                                            </div>
                                        )
                                    })

                                }
                            </div>
                            <div>
                                { /** Whenn the course card clicked, this div element populates for adding and modifying chapter. */
                                    (catId == clickedCourseInfo.catId) && (<div >
                                        {/* <h1>{clickedCourseInfo.catId}, {clickedCourseInfo.courseId}</h1> */}
                                        <AddChapter catTitle={catTitle} userId={user.id} catId={clickedCourseInfo.catId} course={clickedCourseInfo.course} teacherId={1} />
                                    </div>)
                                }
                            </div>


                        </div>

                    })
                }
            </div>
        </div>

    )
}

export default AddCourseScreen