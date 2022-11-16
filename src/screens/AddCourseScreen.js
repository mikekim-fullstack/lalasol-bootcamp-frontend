import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { getAllCategories, setAllCategories, getSelectedCat, setCat, getCats, setSelectedCat, getSelectedCatStatus, setSelectedCatStatus } from '../slices/categorySlice'
import { setCourses, getCourses, getCoursesEnrolledStatus, setCoursesEnrolledStatus } from '../slices/courseSlice'
import { setChapters, getChapters, setClickedChapter } from '../slices/chapterSlice'
import { setPathCourseID, setPathCatID, resetPathAll, setPathChapterID, getPathCourseID, getPathChapterID } from '../slices/pathSlice'
import { getUser } from '../slices/userSlices'
import axios from 'axios'
import './AddCourseScreen.css'
import '../components/CourseEditCard.css'
import CourseEditCard from '../components/CourseEditCard'
import AddUpdateCourse from '../components/AddUpdateCourse'
import AddChapter from '../components/AddChapter'
import DialogBox from '../components/DialogBox'
import { current } from '@reduxjs/toolkit'

const AddCourseScreen = () => {

    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const categories = useSelector(getCats)
    const allCategories = useSelector(getAllCategories)
    const courses = useSelector(getCourses)
    const coursesEnrolled = useSelector(getCoursesEnrolledStatus)
    const chapters = useSelector(getChapters)


    const [selCatID, setSelCatID] = useState([])
    const [isUpdatedCourse, setIsUpdatedCourse] = useState(false)
    const [clickedCourseInfo, setClickedCourseInfo] = useState({ catId: null, courseId: null, foundCard: null, course: null })
    const [dialogDeleteCourse, setDialogDeleteCourse] = useState({
        message: "",
        isLoading: false,
        itemName: "",
        course: null,
        catId: null,
    });
    const [lastCourseNum, setLastCourseNum] = useState([])

    // console.log('---add_courseScreen ---categories: ', categories)
    // console.log('---add_courseScreen ---courses: ', coursesEnrolled)

    const fetchAllCourses = async () => {
        await axios({
            method: 'GET',
            url: `/api/courses-enrolled-status/${user?.id}`,
            headers: {
                'Content-Type': 'Application/Json'
            },
        })
            .then(res => {

                console.log('----- setCoursesEnrolledStatus', res.data, categories)
                dispatch(setCoursesEnrolledStatus({ 'categories': allCategories, 'courses': res.data }))
                setIsUpdatedCourse(false)

            })
            .catch(error => console.log('error-/api/courses-enrolled-status/: ', user?.id, error))
    }
    const updateCourseSequenceInCategory = async (catID, seqCatData) => {
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
                axios({
                    method: 'GET',
                    url: '/api/course-category/',
                    headers: {
                        'Content-Type': 'Application/Json'
                    },

                }).then(res => {
                    dispatch(setAllCategories(res.data))
                    console.log('Refresh /api/course-category/:', res.data)
                }).catch(err => console.log('error: - /api/course-category/', err))
                console.log('Successfully patched -  /api/course-category-detail/ ', res.data)
            })
            .catch(err => console.log('error: api/course-category-detail/<int:pk>', err))
    }
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
                // console.log('--fetchEnrolledCourses:', res.data.sort((a, b) => a.course_no >= b.course ? -1 : 1))
                const _courses = [...res.data]
                const _sortedCourses = _courses?.sort((a, b) => a.course_no > b.course_no ? 1 : a.course_no < b.course_no ? -1 : 0)
                dispatch(setCourses(_sortedCourses, res.data))
                console.log('done:', _sortedCourses)
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
    const handleDeleteCourse = (e, catId, index) => {
        setDialogDeleteCourse({
            message: "Are you sure you want to delete?",
            isLoading: true,
            itemName: clickedCourseInfo?.course?.title + ' Course',
            course: clickedCourseInfo?.course,
            catId: catId,
        });
        console.log('handleDeleteCourse', clickedCourseInfo.course)
    }
    const successfullyDeleted = (res, messageData) => {
        setClickedCourseInfo({ catId: null, courseId: null, foundCard: null, course: null })
        // setClickedCourseInfo(null)
        setIsUpdatedCourse(true)
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
                    const seqCatData = { "course_list_sequence": {} }
                    const courseID = messageData.course.id
                    const selectedCat = allCategories?.filter(cat => cat.id == messageData.catId)[0]
                    if (selectedCat?.course_list_sequence) {
                        // -- Copy all current courseID:order into seqCatData{}. --
                        Object.keys(selectedCat.course_list_sequence)
                            .forEach(key => {
                                if (courseID != key) {

                                    const val = Number(selectedCat.course_list_sequence[key])
                                    seqCatData.course_list_sequence[key] = Number(val)
                                }
                            })
                        updateCourseSequenceInCategory(messageData.catId, seqCatData)
                    }

                    successfullyDeleted(res, messageData)

                })
                .catch(err => console.log(err.reponse.data))
            console.log('delete course', messageData.course)
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
        const catid = cat[0]
        const catEle = document.getElementById('add_update_category_' + catid + '_' + index)
        _selCatID[index] ? catEle.style.background = 'rgb(0, 86, 89)' : catEle.style.background = 'rgb(0, 46, 49)'

        // console.log('add_courseScreen-cat:', _selCatID, cat, index, catEle, _selCatID[index])
    }
    const handleAddCourse = (e, cat, index) => {
        /** -- [setCatID] stores boolean showing which category clicked(true) in array [true, false, ...]. --*/
        const _selCatID = [...selCatID]
        _selCatID[index] = !_selCatID[index]
        setSelCatID([..._selCatID])

        /** -- Change color targeting the clicked category + sign. -- */
        const catid = cat[0]
        const catEle = document.getElementById('add_update_category_' + catid + '_' + index)
        _selCatID[index] ? catEle.style.background = 'rgb(0, 86, 89)' : catEle.style.background = 'rgb(0, 46, 49)'

        // const sortedCourses = [...courses]
        // sortedCourses?.sort((a, b) => a.course_no > b.course_no ? 1 : a.course_no < b.course_no ? -1 : 0)
        // // courses && courses.forEeach(course => {
        //     console.log('course-no', course)
        // })
        Object.keys(courses).map((key) => {
            console.log(courses[key].course_no, courses[key].title)
        })

        console.log('add_courseScreen-cat:', typeof (courses), courses, _selCatID, cat, index, catEle, _selCatID[index],)

        // const courseID = 91
        // const addedCat = allCategories?.filter(cat => cat.id == 1)[0]
        // const seqCatData = { "course_list_sequence": {} }
        // let maxVal = -1
        // if (addedCat?.course_list_sequence) {
        //     // -- Copy all current courseID:order into seqCatData{}. --
        //     Object.keys(addedCat.course_list_sequence)
        //         .forEach(key => {
        //             const val = Number(addedCat.course_list_sequence[key])
        //             seqCatData.course_list_sequence[key] = Number(val)
        //             maxVal = (maxVal > val) ? maxVal : val
        //         })
        //     // -- Add new key:value pair which is created by new one. --
        //     seqCatData.course_list_sequence[String(courseID)] = Number(maxVal + 1)
        // }
        // else {
        //     seqCatData.course_list_sequence[String(courseID)] = Number(1)
        // }
        // console.log('handleSuccessUploading: -seqCatData', seqCatData, JSON.stringify(seqCatData))
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
        console.log('handleCourseClick: ', catId, courseId, e.target, foundCard, (course__edit_card_outline))
    }
    const handleSuccessUploading = (status, courseID, catID, teacherID) => {
        if (status) {
            const addedCat = allCategories?.filter(cat => cat.id == catID)[0]
            const seqCatData = { "course_list_sequence": {} }
            let maxVal = -1
            if (addedCat?.course_list_sequence) {
                // -- Copy all current courseID:order into seqCatData{}. --
                Object.keys(addedCat.course_list_sequence)
                    .forEach(key => {
                        const val = Number(addedCat.course_list_sequence[key])
                        seqCatData.course_list_sequence[key] = Number(val)
                        maxVal = (maxVal > val) ? maxVal : val
                    })
                // -- Add new key:value pair which is created by new one. --
                seqCatData.course_list_sequence[String(courseID)] = Number(maxVal + 1)
            }
            else {
                seqCatData.course_list_sequence[String(courseID)] = Number(1)
            }
            console.log('handleSuccessUploading: -seqCatData', seqCatData, JSON.stringify(seqCatData))
            updateCourseSequenceInCategory(catID, seqCatData)
            // axios({
            //     method: 'PATCH',
            //     url: axios.defaults.baseURL + '/api/course-category-detail/' + catID,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     data: JSON.stringify(seqCatData)
            // })
            //     .then(res => {
            //         // -- Updating categories needed. --
            //         axios({
            //             method: 'GET',
            //             url: '/api/course-category/',
            //             headers: {
            //                 'Content-Type': 'Application/Json'
            //             },

            //         }).then(res => {
            //             dispatch(setAllCategories(res.data))
            //             console.log('Refresh /api/course-category/:', res.data)
            //         }).catch(err => console.log('error: - /api/course-category/', err))
            //         console.log('Successfully patched -  /api/course-category-detail/ ', res.data)
            //     })
            //     .catch(err => console.log('error: api/course-category-detail/<int:pk>', err))
        }
        setIsUpdatedCourse(status)
    }

    useEffect(() => {
        // console.log('categories', categories, categories.length, selCatID)
        console.log('--fetchEnrolledCourses:', courses, ', categories: ', categories, categories?.filter(cat => cat[0] == 1)[0][4].course_list_sequence)// && courses?.sort((a, b) => a.course_no >= b.course_no ? -1 : 1))
        if (categories)
            setSelCatID(new Array(categories.length).fill(false))
    }, [categories, isUpdatedCourse, coursesEnrolled])

    // useEffect(() => {
    //     if (isUpdatedCourse) {
    //         fetchAllCourses()
    //     }
    //     // console.log('-----useEffect-isUpdatedCourse ----:', isUpdatedCourse)
    // }, [isUpdatedCourse])

    useEffect(() => {
        console.log('useEffect - allCategories', allCategories)
        if (allCategories) {
            fetchAllCourses()
        }
    }, [allCategories])
    console.log('AddCourseScreen --- clickedCourseInfo', clickedCourseInfo)
    return (

        <div className='add_update_course__screen'>
            <div className='add_update_course__screen_content'>
                <h1>Add Courses</h1>
                {
                    categories && categories.map((cat, index) => {
                        // console.log('add_courseScreen-cat:', cat)
                        const catId = cat[0]
                        const catTitle = cat[2]
                        return <div key={catId}>
                            <div className='categories' id={`add_update_category_${catId}_${index}`} style={{ backgroundColor: 'rgb(0, 46, 49)' }}>
                                <div className='title'>
                                    <div><span>{cat[1]}</span>&nbsp;-&nbsp;{cat[2]}</div>
                                    <div className='svg_icon'>
                                        {/* -- delete sign -- */}
                                        {selCatID[index] || clickedCourseInfo?.catId == catId && <svg onClick={e => handleDeleteCourse(e, catId, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.3 20.5q-.75 0-1.275-.525Q5.5 19.45 5.5 18.7V6h-1V4.5H9v-.875h6V4.5h4.5V6h-1v12.7q0 .75-.525 1.275-.525.525-1.275.525ZM17 6H7v12.7q0 .125.088.213.087.087.212.087h9.4q.1 0 .2-.1t.1-.2ZM9.4 17h1.5V8H9.4Zm3.7 0h1.5V8h-1.5ZM7 6V19v-.3Z" /></svg>}
                                        {/* -- edit sign -- */}
                                        {selCatID[index] || clickedCourseInfo?.catId == catId && <svg onClick={e => handleUpdateCourse(e, cat, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.15 19H6.4l9.25-9.25-1.225-1.25-9.275 9.275Zm13.7-10.35L15.475 5.3l1.3-1.3q.45-.425 1.088-.425.637 0 1.062.425l1.225 1.225q.425.45.45 1.062.025.613-.425 1.038Zm-1.075 1.1L7.025 20.5H3.65v-3.375L14.4 6.375Zm-2.75-.625-.6-.625 1.225 1.25Z" /></svg>}
                                        {/*-- add expend + sign --*/}
                                        {selCatID[index] || <svg onClick={e => handleAddCourse(e, cat, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M10.85 19.15v-6h-6v-2.3h6v-6h2.3v6h6v2.3h-6v6Z" /></svg>}
                                        {/* close add - sign */}
                                        {selCatID[index] && <svg onClick={e => handleAddCourse(e, cat, index)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.25 12.75v-1.5h13.5v1.5Z" /></svg>}
                                    </div>
                                </div>
                                {selCatID[index] && <AddUpdateCourse category_id={catId} teacher_id={1} course_no={1} handleSuccessUploading={handleSuccessUploading} />}
                            </div>
                            <div className='courses'>
                                {
                                    coursesEnrolled && coursesEnrolled
                                        .filter((course) => course.category == catId)
                                        // .sort((a, b) => a.course_no > b.course_no ? 1 : a.course_no < b.course_no ? -1 : 0)
                                        .map((course) => {
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

                            {dialogDeleteCourse.isLoading && <DialogBox
                                dialogData={dialogDeleteCourse}
                                // message={dialogDeleteCourse.message}
                                // itemName={dialogDeleteCourse.itemName}
                                onDialog={handleDeleteCourseResponse}
                            />
                            }
                        </div>

                    })
                }
            </div>
        </div>

    )
}

export default AddCourseScreen