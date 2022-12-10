import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { getAllCategories, setAllCategories, getSelectedCat, setCat, getCats, setSelectedCat, getSelectedCatStatus, setSelectedCatStatus } from '../slices/categorySlice'
import { setCourses, getCourses, getCoursesEnrolledStatus, setCoursesEnrolledStatus, setClickedCourse, getClickedCourse } from '../slices/courseSlice'
import { setChapters, getChapters, setClickedChapter, setChapterUpdatedStatus, getChapterUpdatedStatus, getChapterLists } from '../slices/chapterSlice'
import { setPathCourseID, setPathCatID, getPathID, getPathCatID, setPathCourseCardIndex, getPathCourseCardIndex, resetPathAll, setPathChapterID, getPathCourseID, getPathChapterID } from '../slices/pathSlice'
import { getUser } from '../slices/userSlices'
import axios from 'axios'
import './AddCourseScreen.css'
import '../components/CourseEditCard.css'
import CourseEditCard from '../components/CourseEditCard'
import AddCourse from '../components/AddCourse'
import UpdateCourse from '../components/UpdateCourse'
import AddChapter from '../components/AddChapter'
import DialogBox from '../components/DialogBox'
import { current } from '@reduxjs/toolkit'

const AddCourseScreen = () => {

    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const pathID = useSelector(getPathID)
    const categories = useSelector(getCats)
    const allCategories = useSelector(getAllCategories)
    const courses = useSelector(getCourses)
    const coursesEnrolled = useSelector(getCoursesEnrolledStatus)
    const chapters = useSelector(getChapters)
    const clickedCourse = useSelector(getClickedCourse)
    const chapterUpdatedStatus = useSelector(getChapterUpdatedStatus)
    const courseID = useSelector(getPathCourseID)
    const catID = useSelector(getPathCatID)
    const chapterLists = useSelector(getChapterLists)


    const [selCatID, setSelCatID] = useState([])
    const [isUpdatedCourse, setIsUpdatedCourse] = useState(false)
    // const [clickedCourse, setClickedCourseInfo] = useState({ catId: null, courseId: null, foundCard: null, course: null })
    const [dialogDeleteCourse, setDialogDeleteCourse] = useState({
        message: "",
        isLoading: false,
        itemName: "",
        course: null,
        catId: null,
    });
    const [isEditMode, setIsEditMode] = useState(false)
    const [isAddMode, setIsAddMode] = useState(false)
    const [previousIndex, setPreviousIndex] = useState(null)


    // test...
    // console.log('---AddCourseScreen ---chapterLists: ', chapterLists)
    // useEffect(() => {

    // }, [chapterLists])

    // console.log('---add_courseScreen ---categories: ', categories)
    // console.log('---add_courseScreen ---courses: ', coursesEnrolled)

    const fetchAllCourses = async () => {
        const url = `/api/courses-all-by-teacher/${user?.id}`
        await axios({
            method: 'GET',
            url,// user id should be teacher id
            headers: {
                'Content-Type': 'Application/Json'
            },
        })
            .then(res => {

                // console.log('----- AddCourseScreen-fetchAllCourses', res.data, categories)
                dispatch(setCoursesEnrolledStatus({ 'categories': allCategories, 'courses': res.data }))
                setIsUpdatedCourse(false)

            })
            .catch(error => console.log('error: ' + url, user?.id, error))
    }
    const fetchAllCategories = async () => {
        axios({
            method: 'GET',
            url: '/api/course-category/',
            headers: {
                'Content-Type': 'Application/Json'
            },

        }).then(res => {
            dispatch(setAllCategories(res.data))
            // console.log('Refresh /api/course-category/:', res.data)
        }).catch(err => console.log('error: - /api/course-category/', err))

    }
    const updateCourseSequenceInCategory = async (catID, seqCatData) => {
        // console.log('updateCourseSequenceInCategory: ', catID, seqCatData, ', url:', axios.defaults.baseURL + '/api/course-category-detail/' + catID)
        axios({
            method: 'PATCH',
            url: axios.defaults.baseURL + '/api/course-category-detail/' + catID,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(seqCatData)
        })
            .then(res => {
                // -- Updating categories needed. --
                fetchAllCategories()
                // console.log('Successfully patched -  /api/course-category-detail/ ', res.data)

            })
            .catch(err => console.log('error: api/course-category-detail/<int:pk>', err))
    }





    /**
     * Handling when the add category sign(+)
     * 1. setSelCatID: storing which the category is clicked (boolean array).
     * 2. Change the color whoes category is selected .
     * @param {*} e 
     * @param {*} cat 
     * @param {*} index 
     */
    const handleDeleteCourse = (e, catId, index) => {
        setDialogDeleteCourse({
            message: "Are you sure you want to delete?",
            isLoading: true,
            itemName: clickedCourse?.course?.title + ' Course',
            course: clickedCourse?.course,
            catId: catId,
        });
        // console.log('handleDeleteCourse', clickedCourse.course)
    }
    const successfullyDeleted = (res, messageData) => {
        const _selCatID = selCatID.map(sel => false)
        setSelCatID([..._selCatID])
        dispatch(setClickedCourse({ catId: null, courseId: null, course: null }))
        dispatch(resetPathAll())
        setIsUpdatedCourse(true)
        setIsAddMode(false)
        setIsEditMode(true)
        // console.log('fisuccessfullyDeletedrst ---', _selCatID)
    }
    const handleDeleteCourseResponse = (choose, messageData) => {
        if (choose) {
            //   setProducts(products.filter((p) => p.id !== idProductRef.current));
            // -- Delete course by dispatch it to server. --
            axios({
                method: 'DELETE',
                url: axios.defaults.baseURL + '/api/course-delete/' + messageData.course.id
            })
                .then(res => {

                    // -- Remove map(deletedCourseID:orderNumber) from course_list_sequence. ---
                    const seqCatData = { "course_list_sequence": { "seq": [] } }
                    const courseID = messageData.course.id
                    const selectedCat = allCategories?.filter(cat => cat.id == messageData.catId)[0]
                    if (selectedCat?.course_list_sequence?.seq) {
                        // -- Copy all current courseID:order into seqCatData{}. --
                        const seq = [...selectedCat.course_list_sequence.seq]
                        const index = seq.findIndex(ele => ele == courseID)
                        seq.splice(index, 1)
                        seqCatData.course_list_sequence['seq'] = seq
                        // console.log('handleDeleteCourseResponse- seqCatData', seqCatData, courseID)
                        updateCourseSequenceInCategory(messageData.catId, seqCatData)
                    }

                    successfullyDeleted(res, messageData)

                })
                .catch(err => console.log(err))
            // console.log('delete course', messageData.course)
        } else {
        }
        setDialogDeleteCourse({ message: "", isLoading: false, itemName: '', course: null, catId: null });
    };
    const handleUpdateCourse = (e, cat, index) => {
        /** -- [setCatID] stores boolean showing which category clicked(true) in array [true, false, ...]. --*/
        const _selCatID = [...selCatID]
        _selCatID[index] = !_selCatID[index]
        setSelCatID([..._selCatID])

        /** -- Change color targeting the clicked category + sign. -- */
        // const catid = cat[0]
        // const catEle = document.getElementById('add_update_category_' + catid + '_' + index)
        // _selCatID[index] ? catEle.style.background = 'rgb(0, 86, 89)' : catEle.style.background = 'rgb(0, 46, 49)'

        setPreviousIndex(index)
        setIsAddMode(false)
        setIsEditMode(true)
        // console.log('add_courseScreen-cat:', _selCatID, cat, index, catEle, _selCatID[index])
    }
    const handleAddCourse = (e, cat, index) => {
        /** -- [setCatID] stores boolean showing which category clicked(true) in array [true, false, ...]. --*/
        const _selCatID = selCatID.map(sel => false)
        _selCatID[index] = true
        setSelCatID([..._selCatID])
        dispatch(setPathCatID(cat[0]))

        /** -- Change color targeting the clicked category + sign. -- */
        // const catid = cat[0]
        // const catEle = document.getElementById('add_update_category_' + catid + '_' + index)
        // _selCatID[index] ? catEle.style.background = 'rgb(0, 86, 89)' : catEle.style.background = 'rgb(0, 46, 49)'
        setIsEditMode(false)
        setIsAddMode(true)

        // Object.keys(courses).map((key) => {
        //     console.log(courses[key].course_no, courses[key].title)
        // })

        // console.log('add_courseScreen-courses:', courses, ', _selCatID', _selCatID, ', cat:', cat, ', coursesEnrolled', coursesEnrolled)
    }
    const handleClickCloseCourse = (e, cat, index) => {
        const _selCatID = selCatID.map(sel => false)
        // const _selCatID = [...selCatID]
        _selCatID[index] = false//!_selCatID[index]
        setSelCatID([..._selCatID])

        /** -- Change color targeting the clicked category + sign. -- */
        const catid = cat[0]
        const catEle = document.getElementById('add_update_category_' + catid + '_' + index)
        _selCatID[index] ? catEle.style.background = 'rgb(0, 86, 89)' : catEle.style.background = 'rgb(0, 46, 49)'
        setIsEditMode(false)
        setIsAddMode(false)
    }

    /** Find current Course Card by the card index and cat ID */
    const outlinedCourseCard = (courseID) => {

        const course__edit_card_outline = document.querySelectorAll('.course__edit_card_outline')
        const shadowColor = '0px 0px 0px 6px rgba(0, 200,200 , 0.95)'
        for (let i = 0; i < course__edit_card_outline.length; i++) {

            const card = course__edit_card_outline[i]
            const id = card.className.split(' ').pop()
            /** Once find the clicled element and highlight outline(box-shadow) */
            if (Number(id) == courseID) {
                card.style['border-radius'] = '5px'
                card.style['box-shadow'] = shadowColor
                card.style['-webkit-box-shadow'] = shadowColor
                card.style['-moz-box-shadow'] = shadowColor
            }
            /** Reset previous outline to nothing */
            else {
                card.style['border-radius'] = '0px'
                card.style['box-shadow'] = ''
                card.style['-webkit-box-shadow'] = ''
                card.style['-moz-box-shadow'] = ''
            }
        }
    }
    /** -- After added/deleted chapter, reload course info especially sequence data*/
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
                outlinedCourseCard(course.id)
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
            })
            .catch(err => console.log('error: ' + url, err))
    }
    const handleClickCourse = (e, course, index) => {
        const catId = course.category
        const courseId = course.id

        /** -- Change color targeting the clicked category + sign. -- */
        const _selCatID = selCatID.map(sel => false)
        setSelCatID([..._selCatID])


        fetchCourse(course.id)// -- Update Course infomation... --

        setIsEditMode(false)
        setIsAddMode(false)

        // console.log('handleClickCourse: catid:', catId, 'courseid:', courseId, ', course: ', course)// e.target, foundCard, (course__edit_card_outline))



    }

    const handleSuccessUpdated = (status, courseID, catID, teacherID) => {
        // console.log('....handleSuccessUpdated: ', previousIndex)
        /** -- Change color targeting the clicked category + sign. -- */
        if (previousIndex != null) {
            const _selCatID = [...selCatID]
            _selCatID[previousIndex] = false
            setSelCatID([..._selCatID])

            const catEle = document.getElementById('add_update_category_' + catID + '_' + previousIndex)
            _selCatID[previousIndex] ? catEle.style.background = 'rgb(0, 86, 89)' : catEle.style.background = 'rgb(0, 46, 49)'
            // console.log('previousIndex=', previousIndex, _selCatID)
        }
        if (status) {
            const addedCat = allCategories?.filter(cat => cat.id == catID)[0]
            updateCourseSequenceInCategory(catID, addedCat?.course_list_sequence)

        }
        setIsUpdatedCourse(status)
        setIsEditMode(false)
        setIsAddMode(false)
    }

    const handleSuccessCreatedCourse = (status, courseID, catID, teacherID) => {

        // const currentCourse = coursesEnrolled.filter((course) => course.category == catID && course.id == courseID)
        // console.log('....handleSuccessUpdated: ', previousIndex)
        /** -- Change color targeting the clicked category + sign. -- */
        if (previousIndex != null) {
            const _selCatID = [...selCatID]
            _selCatID[previousIndex] = false
            setSelCatID([..._selCatID])

            const catEle = document.getElementById('add_update_category_' + catID + '_' + previousIndex)
            if (catEle) _selCatID[previousIndex] ? catEle.style.background = 'rgb(0, 86, 89)' : catEle.style.background = 'rgb(0, 46, 49)'
            // console.log('previousIndex=', previousIndex, _selCatID)
        }

        dispatch(setPathCourseID(courseID))
        setIsUpdatedCourse(true)

        if (status) {
            const addedCat = allCategories?.filter(cat => cat.id == catID)[0]
            const seqCatData = { "course_list_sequence": { "seq": [] } }
            let maxVal = -1
            if (addedCat?.course_list_sequence?.seq) {
                const seq = [...addedCat?.course_list_sequence?.seq]
                seq.push(courseID)
                seqCatData.course_list_sequence.seq = seq
            }
            else {
                seqCatData.course_list_sequence['seq'] = [courseID]
            }
            // console.log('handleSuccessUploading: -seqCatData', seqCatData, JSON.stringify(seqCatData))
            updateCourseSequenceInCategory(catID, seqCatData)

        }
        setIsUpdatedCourse(status)
        setIsEditMode(false)
        setIsAddMode(false)

    }
    /** --------------------------- */
    useEffect(() => {
        // console.log('categories', categories, categories.length, selCatID)
        // console.log('--fetchEnrolledCourses:', courses, ', categories: ', categories, categories?.filter(cat => cat[0] == 1)[0][4].course_list_sequence)// && courses?.sort((a, b) => a.course_no >= b.course_no ? -1 : 1))
        if (categories)
            setSelCatID(new Array(categories.length).fill(false))
        if (courseID && catID && coursesEnrolled) {

            outlinedCourseCard(courseID)
            const foundCourse = coursesEnrolled.filter(course => course.id == courseID)
            dispatch(setClickedCourse({ catId: catID, courseId: courseID, course: foundCourse[0] }))
        }
    }, [categories, coursesEnrolled])

    // useEffect(() => {
    //     if (isUpdatedCourse) {
    //         fetchAllCourses()
    //     }
    //     // console.log('-----useEffect-isUpdatedCourse ----:', isUpdatedCourse)
    // }, [isUpdatedCourse])

    useEffect(() => {
        // console.log('useEffect - allCategories -- updating', allCategories)
        if (allCategories) {
            fetchAllCourses()
        }
    }, [allCategories])
    // console.log('<<< Refresh - AddCourseScreen: clickedCourse', clickedCourse, ',coursesEnrolled:', coursesEnrolled, ', selCatID:', selCatID, ', categories:', categories, ', PathID', pathID)
    return (

        <div className='add_update_course__screen'>
            <div className='add_update_course__screen_content'>
                <h1>Course Management Panel</h1>
                {
                    categories && categories.map((cat, index) => {
                        // console.log('add_courseScreen-cat:', cat)
                        const catId = cat[0]
                        const catTitle = cat[2]
                        return <div key={catId}>
                            {/* -- Show all course Bars for  each categories for delete, edit and add course. -- */}
                            <div className='categories' id={`add_update_category_${catId}_${index}`} style={{ backgroundColor: 'rgb(0, 46, 49)' }}>
                                <div className='title'>
                                    <div><span>{cat[1]}</span>&nbsp;-&nbsp;{cat[2]}</div>
                                    <div className='svg_icon'>
                                        {/* -- delete sign -- */}
                                        {selCatID[index] || clickedCourse?.catId == catId && <svg onClick={e => handleDeleteCourse(e, catId, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.3 20.5q-.75 0-1.275-.525Q5.5 19.45 5.5 18.7V6h-1V4.5H9v-.875h6V4.5h4.5V6h-1v12.7q0 .75-.525 1.275-.525.525-1.275.525ZM17 6H7v12.7q0 .125.088.213.087.087.212.087h9.4q.1 0 .2-.1t.1-.2ZM9.4 17h1.5V8H9.4Zm3.7 0h1.5V8h-1.5ZM7 6V19v-.3Z" /></svg>}
                                        {/* -- edit sign -- */}
                                        {selCatID[index] || clickedCourse?.catId == catId && <svg onClick={e => handleUpdateCourse(e, cat, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.15 19H6.4l9.25-9.25-1.225-1.25-9.275 9.275Zm13.7-10.35L15.475 5.3l1.3-1.3q.45-.425 1.088-.425.637 0 1.062.425l1.225 1.225q.425.45.45 1.062.025.613-.425 1.038Zm-1.075 1.1L7.025 20.5H3.65v-3.375L14.4 6.375Zm-2.75-.625-.6-.625 1.225 1.25Z" /></svg>}
                                        {/*-- add expend + sign --*/}
                                        {selCatID[index] || <svg onClick={e => handleAddCourse(e, cat, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.25 16.75h1.5v-4h4v-1.5h-4v-4h-1.5v4h-4v1.5h4ZM5.3 20.5q-.75 0-1.275-.525Q3.5 19.45 3.5 18.7V5.3q0-.75.525-1.275Q4.55 3.5 5.3 3.5h13.4q.75 0 1.275.525.525.525.525 1.275v13.4q0 .75-.525 1.275-.525.525-1.275.525Zm0-1.5h13.4q.1 0 .2-.1t.1-.2V5.3q0-.1-.1-.2t-.2-.1H5.3q-.1 0-.2.1t-.1.2v13.4q0 .1.1.2t.2.1ZM5 5v14V5Z" /></svg>}
                                        {/* close add - sign */}
                                        {selCatID[index] && <svg onClick={e => handleClickCloseCourse(e, cat, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.25 12.75v-1.5h13.5v1.5Z" /></svg>}
                                    </div>
                                </div>
                                {selCatID[index] && isAddMode && <AddCourse category_id={catId} teacher_id={user.id} course_no={1} handleSuccessCreatedCourse={handleSuccessCreatedCourse} />}
                                {selCatID[index] && isEditMode && <UpdateCourse clickedCourse={clickedCourse} handleSuccessUploading={handleSuccessUpdated} />}
                            </div>
                            {/** When delete button clicked on course it pops up */}
                            {
                                dialogDeleteCourse.isLoading && <DialogBox
                                    dialogData={dialogDeleteCourse} onDialog={handleDeleteCourseResponse}
                                />
                            }
                            {/* -- Under categories it shows all courses in card. -- */}
                            <div className='courses'>
                                {
                                    coursesEnrolled && coursesEnrolled
                                        ?.filter((course) => course.category == catId)
                                        ?.map((course, index) => {
                                            // console.log('catId:', catId, ', course: ', course)
                                            return (
                                                <div key={course.id} className='item'>
                                                    <CourseEditCard course={course} index={index} handleClickCourse={handleClickCourse} />
                                                </div>
                                            )
                                        })
                                }
                            </div>
                            {/** * When the course card clicked, this div element populates for adding and modifying chapter. */}
                            <div>
                                {
                                    (catId == clickedCourse.catId) && (<div >
                                        {/* <h1>{clickedCourse.catId}, {clickedCourse.courseId}</h1> */}
                                        <AddChapter catTitle={catTitle} userId={user.id} teacherId={user.id} />
                                    </div>)
                                }
                            </div>

                        </div>

                    })
                }
            </div>
        </div >

    )
}

export default AddCourseScreen