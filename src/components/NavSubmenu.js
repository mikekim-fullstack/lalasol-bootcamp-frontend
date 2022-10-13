import React, { useEffect, useState } from 'react'
import './NavSubmenu.css'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentCat, setCat } from '../slices/categorySlice'
import { Link } from 'react-router-dom'
// -- This is temporary data set and later this data will be
//    fetched from server.
// --
const NavSubmenu = ({ className }) => {
    const allCoursesData = [
        {
            id: 0,
            cat_id: 8,
            title: 'HTML Intro',
            courses: [{ 'id': 1, 'title': 'Reading' }, { 'id': 2, 'title': 'Video #1' }, { 'id': 3, 'title': 'Video #2' }],
            quiz: [{ 'id': 1, 'title': 'Quiz' }],
            homeworks: [{ 'id': 1, 'title': 'Home Work #1' }],
            projects: [{ 'id': 1, 'title': 'Course Projects' }, { 'id': 2, 'title': 'Interview Projects' }],
            skills: [{ 'id': 1, 'title': 'Skills' }],
            reference: [{ 'id': 1, 'title': 'Reference' }],
        },
        {
            id: 1,
            cat_id: 8,
            title: 'HTML Level 1',
            courses: [{ 'id': 4, 'title': 'Reading' }, { 'id': 5, 'title': 'Video #1' }, { 'id': 6, 'title': 'Video #2' }],
            quiz: [{ 'id': 2, 'title': 'Quiz' }],
            homeworks: [{ 'id': 2, 'title': 'Home Work #1' }],
            projects: [{ 'id': 3, 'title': 'Course Projects' }, { 'id': 4, 'title': 'Interview Projects' }],
            skills: [{ 'id': 2, 'title': 'Skills #1' }],
            reference: [{ 'id': 2, 'title': 'Reference' }],
        },
        {
            id: 2,
            cat_id: 8,
            title: 'HTML Level 2',
            courses: [{ 'id': 7, 'title': 'Reading' }, { 'id': 8, 'title': 'Video #1' }, { 'id': 9, 'title': 'Video #2' }],
            quiz: [{ 'id': 3, 'title': 'Quiz' }],
            homeworks: [{ 'id': 3, 'title': 'Home Work #1' }],
            projects: [{ 'id': 5, 'title': 'Course Projects' }, { 'id': 6, 'title': 'Interview Projects' }],
            skills: [{ 'id': 3, 'title': 'Skills #1' }],
            reference: [{ 'id': 3, 'title': 'Reference' }],
        },
        {
            id: 3,
            cat_id: 8,
            title: 'HTML Level 3',
            courses: [{ 'id': 7, 'title': 'HTML Reading' }, { 'id': 8, 'title': 'Video #1' }, { 'id': 9, 'title': 'Video #2' }],
            quiz: [{ 'id': 4, 'title': 'Quiz' }],
            homeworks: [{ 'id': 4, 'title': 'Home Work #1' }],
            projects: [{ 'id': 7, 'title': 'Course Projects' }, { 'id': 8, 'title': 'Interview Projects' }],
            skills: [{ 'id': 4, 'title': 'Skills #1' }],
            reference: [{ 'id': 4, 'title': 'Reference' }],
        },
        {
            id: 4,
            cat_id: 6,
            title: 'CSS Intro',
            courses: [{ 'id': 10, 'title': 'CSS Reading' }, { 'id': 11, 'title': 'Video #1' }, { 'id': 12, 'title': 'Video #2' }],
            quiz: [{ 'id': 5, 'title': 'Quiz' }],
            homeworks: [{ 'id': 5, 'title': 'Home Work #1' }],
            projects: [{ 'id': 9, 'title': 'Course Projects' }, { 'id': 10, 'title': 'Interview Projects' }],
            skills: [{ 'id': 5, 'title': 'Skills #1' }],
            reference: [{ 'id': 5, 'title': 'Reference' }],
        },
        {
            id: 5,
            cat_id: 6,
            title: 'CSS Level 1',
            courses: [{ 'id': 13, 'title': 'CSS Reading' }, { 'id': 14, 'title': 'Video #1' }, { 'id': 15, 'title': 'Video #2' }],
            quiz: [{ 'id': 6, 'title': 'Quiz' }],
            homeworks: [{ 'id': 6, 'title': 'Home Work #1' }],
            projects: [{ 'id': 11, 'title': 'Course Projects' }, { 'id': 12, 'title': 'Interview Projects' }],
            skills: [{ 'id': 6, 'title': 'Skills #1' }],
            reference: [{ 'id': 6, 'title': 'Reference' }],
        },
        {
            id: 6,
            cat_id: 6,
            title: 'CSS Level 2',
            courses: [{ 'id': 16, 'title': 'CSS Reading' }, { 'id': 17, 'title': 'Video #1' }, { 'id': 18, 'title': 'Video #2' }],
            quiz: [{ 'id': 7, 'title': 'Quiz' }],
            homeworks: [{ 'id': 7, 'title': 'Home Work #1' }],
            projects: [{ 'id': 13, 'title': 'Course Projects' }, { 'id': 14, 'title': 'Interview Projects' }],
            skills: [{ 'id': 7, 'title': 'Skills #1' }],
            reference: [{ 'id': 7, 'title': 'Reference' }],
        },
        {
            id: 7,
            cat_id: 6,
            title: 'CSS Level 3',
            courses: [{ 'id': 19, 'title': 'CSS Reading' }, { 'id': 20, 'title': 'Video #1' }, { 'id': 21, 'title': 'Video #2' }],
            quiz: [{ 'id': 8, 'title': 'Quiz' }],
            homeworks: [{ 'id': 8, 'title': 'Home Work #1' }],
            projects: [{ 'id': 15, 'title': 'Course Projects' }, { 'id': 16, 'title': 'Interview Projects' }],
            skills: [{ 'id': 8, 'title': 'Skills #1' }],
            reference: [{ 'id': 8, 'title': 'Reference' }],
        },
        {
            id: 8,
            cat_id: 6,
            title: 'CSS Level 4',
            courses: [{ 'id': 22, 'title': 'CSS Reading' }, { 'id': 23, 'title': 'Video #1' }, { 'id': 24, 'title': 'Video #2' }],
            quiz: [{ 'id': 9, 'title': 'Quiz' }],
            homeworks: [{ 'id': 9, 'title': 'Home Work #1' }],
            projects: [{ 'id': 17, 'title': 'Course Projects' }, { 'id': 18, 'title': 'Interview Projects' }],
            skills: [{ 'id': 9, 'title': 'Skills #1' }],
            reference: [{ 'id': 9, 'title': 'Reference' }],
        },
        {
            id: 9,
            cat_id: 6,
            title: 'CSS Level 5',
            courses: [{ 'id': 25, 'title': 'CSS Reading' }, { 'id': 26, 'title': 'Video #1' }, { 'id': 27, 'title': 'Video #2' }],
            quiz: [{ 'id': 10, 'title': 'Quiz' }],
            homeworks: [{ 'id': 10, 'title': 'Home Work #1' }],
            projects: [{ 'id': 19, 'title': 'Course Projects' }, { 'id': 20, 'title': 'Interview Projects' }],
            skills: [{ 'id': 10, 'title': 'Skills #1' }],
            reference: [{ 'id': 10, 'title': 'Reference' }],
        },
        {
            id: 10,
            cat_id: 5,
            title: 'JavaScript  Intro',
            courses: [{ 'id': 28, 'title': 'JavaScript Reading' }, { 'id': 29, 'title': 'Video #1' }, { 'id': 30, 'title': 'Video #2' }],
            quiz: [{ 'id': 11, 'title': 'Quiz' }],
            homeworks: [{ 'id': 11, 'title': 'Home Work #1' }],
            projects: [{ 'id': 21, 'title': 'Course Projects' }, { 'id': 22, 'title': 'Interview Projects' }],
            skills: [{ 'id': 11, 'title': 'Skills #1' }],
            reference: [{ 'id': 11, 'title': 'Reference' }],
        },
        {
            id: 11,
            cat_id: 5,
            title: 'JavaScript  Level 1',
            courses: [{ 'id': 31, 'title': 'JavaScript Reading 1' }, { 'id': 32, 'title': 'Video #1' }, { 'id': 33, 'title': 'Video #2' }],
            quiz: [{ 'id': 12, 'title': 'Quiz' }],
            homeworks: [{ 'id': 12, 'title': 'Home Work #1' }],
            projects: [{ 'id': 23, 'title': 'Course Projects' }, { 'id': 24, 'title': 'Interview Projects' }],
            skills: [{ 'id': 12, 'title': 'Skills #1' }],
            reference: [{ 'id': 12, 'title': 'Reference' }],
        },
        {
            id: 12,
            cat_id: 5,
            title: 'JavaScript  Level 2',
            courses: [{ 'id': 34, 'title': 'JavaScript Reading 1' }, { 'id': 35, 'title': 'Video #1' }, { 'id': 36, 'title': 'Video #2' }],
            quiz: [{ 'id': 13, 'title': 'Quiz' }],
            homeworks: [{ 'id': 13, 'title': 'Home Work #1' }],
            projects: [{ 'id': 25, 'title': 'Course Projects' }, { 'id': 26, 'title': 'Interview Projects' }],
            skills: [{ 'id': 32, 'title': 'Skills #1' }],
            reference: [{ 'id': 13, 'title': 'Reference' }],
        },
        {
            id: 13,
            cat_id: 4,
            title: 'Data Structure Intro',
            courses: [{ 'id': 37, 'title': 'Data Structure Reading 1' }, { 'id': 38, 'title': 'Video #1' }, { 'id': 39, 'title': 'Video #2' }],
            quiz: [{ 'id': 14, 'title': 'Quiz' }],
            homeworks: [{ 'id': 14, 'title': 'Home Work #1' }],
            projects: [{ 'id': 27, 'title': 'Course Projects' }, { 'id': 28, 'title': 'Interview Projects' }],
            skills: [{ 'id': 14, 'title': 'Skills #1' }],
            reference: [{ 'id': 14, 'title': 'Reference' }],
        },
        {
            id: 14,
            cat_id: 4,
            title: 'Data Structure Level 1',
            courses: [{ 'id': 40, 'title': 'Data Structure Reading 1' }, { 'id': 41, 'title': 'Video #1' }, { 'id': 42, 'title': 'Video #2' }],
            quiz: [{ 'id': 15, 'title': 'Quiz' }],
            homeworks: [{ 'id': 15, 'title': 'Home Work #1' }],
            projects: [{ 'id': 29, 'title': 'Course Projects' }, { 'id': 30, 'title': 'Interview Projects' }],
            skills: [{ 'id': 15, 'title': 'Skills #1' }],
            reference: [{ 'id': 15, 'title': 'Reference' }],
        },
        {
            id: 15,
            cat_id: 4,
            title: 'Data Structure Level 2',
            courses: [{ 'id': 43, 'title': 'Data Structure Reading 2' }, { 'id': 44, 'title': 'Video #1' }, { 'id': 45, 'title': 'Video #2' }],
            quiz: [{ 'id': 16, 'title': 'Quiz' }],
            homeworks: [{ 'id': 16, 'title': 'Home Work #1' }],
            projects: [{ 'id': 31, 'title': 'Course Projects' }, { 'id': 32, 'title': 'Interview Projects' }],
            skills: [{ 'id': 16, 'title': 'Skills #1' }],
            reference: [{ 'id': 16, 'title': 'Reference' }],
        },
        {
            id: 18,
            cat_id: 3,
            title: 'React JS Intro',
            courses: [{ 'id': 46, 'title': 'React JS Reading' }, { 'id': 47, 'title': 'Video #1' }, { 'id': 48, 'title': 'Video #2' }],
            quiz: [{ 'id': 17, 'title': 'Quiz' }],
            homeworks: [{ 'id': 17, 'title': 'Home Work #1' }],
            projects: [{ 'id': 33, 'title': 'Course Projects' }, { 'id': 34, 'title': 'Interview Projects' }],
            skills: [{ 'id': 17, 'title': 'Skills #1' }],
            reference: [{ 'id': 17, 'title': 'Reference' }],
        },
        {
            id: 19,
            cat_id: 3,
            title: 'React JS Level 1',
            courses: [{ 'id': 49, 'title': 'React JS Reading 1' }, { 'id': 50, 'title': 'Video #1' }, { 'id': 51, 'title': 'Video #2' }],
            quiz: [{ 'id': 18, 'title': 'Quiz' }],
            homeworks: [{ 'id': 18, 'title': 'Home Work #1' }],
            projects: [{ 'id': 35, 'title': 'Course Projects' }, { 'id': 36, 'title': 'Interview Projects' }],
            skills: [{ 'id': 18, 'title': 'Skills #1' }],
            reference: [{ 'id': 18, 'title': 'Reference' }],
        },
        {
            id: 24,
            cat_id: 9,
            title: 'Practice 1',
            practices: [{ 'id': 1, 'title': 'Beginner' }, { 'id': 2, 'title': 'Intermediate' }, { 'id': 3, 'title': 'Advanced' }],
        },
        {
            id: 25,
            cat_id: 2,
            title: 'General 1',
            general: [{ 'id': 1, 'title': 'General' },],
        },
        {
            id: 25,
            cat_id: 1,
            title: 'HR 1',
            general: [{ 'id': 1, 'title': 'HR' },],
        },
        //-------------------------------


    ]
    const [selectedCourseId, setSelectedCourseId] = useState(null)
    const [selCourse, setSelCourse] = useState(null)
    let selectedCat = useSelector(getCurrentCat)

    //return object id, title
    selectedCat = selectedCat && selectedCat[0] && selectedCat[0][1]
    const dispatch = useDispatch()

    // console.log('selectedCat: ', selectedCat.title)

    //---------- Lists of course title which belong to selected category ------//
    const selCourses = allCoursesData
        .filter((courses) => courses.cat_id === selectedCat.id)


    const handleChaper = (e) => {
        // console.log(e.target.name)
        setSelectedCourseId(parseInt(e.target.name))
        const _selCourse = selCourses.filter((course) => {
            // console.log('----course.id-----', course.id, parseInt(e.target.name))
            return parseInt(course.id) === parseInt(e.target.name)
        })
        if (_selCourse) setSelCourse(_selCourse[0])
        else setSelCourse(null)

    }

    const handleChaperSubject = (e) => {
        // -- Get subject name and id to pass them to the page through 
        //    the Navigation and Route to fetch data from server. --
        const path = e.target.name?.split(',')
        const subject = path[0].trim()
        const subjectId = parseInt(path[1].trim())
        // console.log(subject, subjectId)



    }



    useEffect(() => {
        setSelCourse(null)
    }, [selectedCat])
    // console.log('selCourse: ', selCourse)


    return (
        <div className={`nav__submenu ${className}`}>
            <div className='submenu__title'>{selectedCat && selectedCat?.title}</div>
            <div className='submenu__chapters'>
                {selCourses?.map((course) => (
                    <button className='submenu__chapter_btn' onClick={handleChaper} key={course.id} name={course.id}>
                        {course.title}
                    </button>
                )
                )}
            </div>
            <div className='submenu__chapter_content'>
                {
                    selCourse && Object.entries(selCourse).map((courseEntry, index) => {
                        const keyTitle = courseEntry[0]
                        const courseValues = courseEntry[1]
                        // console.log('selectedChapter-entry:', courseValues)
                        return (keyTitle !== 'id' && keyTitle !== 'cat_id' ?
                            <div key={index}>
                                {/*  -- Display the title of sub-items from a course.. -- */}
                                <div className={`content__title ${keyTitle === 'title' && 'chapter'}`}>
                                    {keyTitle === 'title' ? 'CHAPTER' : keyTitle.toUpperCase()}
                                </div>
                                {keyTitle === 'title' ?
                                    <div>{courseValues}</div>
                                    :
                                    // -- Display sub items from a course.. --
                                    Object.entries(courseValues).map((valueEntry) => {
                                        // -- const index = valueEntry[0] // only array index. --
                                        const itemValues = valueEntry[1]
                                        // console.log('item: ', keyTitle, valueEntry)
                                        return <button onClick={handleChaperSubject} key={itemValues.id} name={` ${keyTitle}, ${itemValues.id}`} className='content__subject'>{itemValues.title}</button>
                                    })
                                }
                            </div>
                            : null)
                    })
                }
            </div>



        </div>
    )
}

export default NavSubmenu

/* {
                    selectedChapter && Object.entries(selectedChapter).map((entry, index) => {
                        const key = entry[0]
                        const values = entry[1]
                        // console.log('selectedChapter-entry:', entry)
                        return key !== 'id' ? (
                            <div>
                                <div className='content__title' key={index}>{key.toUpperCase()}</div>
                                {key === 'title' ?
                                    <div>{values}</div>
                                    :
                                    values.map((value, index) => {
                                        return <div>{value}</div>
                                    })
                                }
                            </div>
                        ) : null
                    })
                } */
/* {subMenu && subMenu.length > 0 && Object.entries(subMenu[selectedCat?.id]).map((arr, index) => {
    return (arr[0] !== 'id' && (
        <div key={index}>

            <h3 className='submenu__title'>{arr[0].toUpperCase()}</h3>
            {arr[1].map((course, index) => (
                // <Link key={index} to={`/${selectedCat.lists[selectedCat.id].toLowerCase().replace(' ', '_')}/${course.toLowerCase().replace(' ', '_')}`}><h4 className='sub__submenu'>{course}</h4></Link>
                <Link onClick={() => dispatch(setCat({ ...selectedCat, course }))} key={index} to='/content'><h4 className='sub__submenu'>{course}</h4></Link>
            ))}
        </div>


    ))
})} */