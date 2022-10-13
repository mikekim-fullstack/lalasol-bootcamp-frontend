import React, { useEffect, useState } from 'react'
import './NavSubmenu.css'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentCat, setCat } from '../slices/categorySlice'
import { Link } from 'react-router-dom'
const NavSubmenu = ({ className }) => {
    const allCoursesData = [
        {
            id: 0,
            cat_id: 8,
            title: 'HTML Intro',
            courses: ['Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 1,
            cat_id: 8,
            title: 'HTML Level 1',
            courses: ['Reading', 'Video #1'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        }, {
            id: 2,
            cat_id: 8,
            title: 'HTML Level 2',
            courses: ['HTML Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 3,
            cat_id: 8,
            title: 'HTML Level 3',
            courses: ['HTML Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        }
        ,
        {
            id: 4,
            cat_id: 6,
            title: 'CSS Intro',
            courses: ['CSS Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 5,
            cat_id: 6,
            title: 'CSS Level 1',
            courses: ['CSS Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 6,
            cat_id: 6,
            title: 'CSS Level 2',
            courses: ['CSS Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 7,
            cat_id: 6,
            title: 'CSS Level 3',
            courses: ['CSS Reading 3', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 8,
            cat_id: 6,
            title: 'CSS Level 4',
            courses: ['CSS Reading 4', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 9,
            cat_id: 6,
            title: 'CSS Level 5',
            courses: ['CSS Reading 5', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },


        {
            id: 10,
            cat_id: 5,
            title: 'JavaScript  Intro',
            courses: ['JavaScript Reading', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 11,
            cat_id: 5,
            title: 'JavaScript Level 1',
            courses: ['JavaScript Reading 1', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 12,
            cat_id: 5,
            title: 'JavaScript Level 2',
            courses: ['JavaScript Reading 2', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        }

        ,

        {
            id: 13,
            cat_id: 4,
            title: 'Data Structure Intro',
            courses: ['Data Structure Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 14,
            cat_id: 4,
            title: 'Data Structure Level ',
            courses: ['Data Structure Reading 1', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 15,
            cat_id: 4,
            title: 'Data Structure Level 2',
            courses: ['Data Structure Reading 2', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        }, {
            id: 16,
            cat_id: 4,
            title: 'Data Structure Level 3',
            courses: ['Data Structure Reading 3', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 17,
            cat_id: 4,
            title: 'Data Structure Level 4',
            courses: ['Data Structure Reading 4', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        }
        ,
        {
            id: 18,
            cat_id: 3,
            title: 'React JS Intro',
            courses: ['React JS Reading', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 19,
            cat_id: 3,
            title: 'React JS Level 1',
            courses: ['React JS Reading 1', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 20,
            cat_id: 3,
            title: 'React JS Level 2',
            courses: ['React JS Reading 2', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 21,
            cat_id: 3,
            title: 'React JS Level 3',
            courses: ['React JS Reading 3', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 22,
            cat_id: 3,
            title: 'React JS Level 4',
            courses: ['React JS Reading 4', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 23,
            cat_id: 3,
            title: 'React JS Level 5',
            courses: ['React JS Reading 5', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },

        ,

        {
            id: 24,
            cat_id: 9,
            title: 'Practice 1',
            practices: ['Beginner', 'Intermediate', 'Advanced'],
        }

        ,
        {
            id: 25,
            cat_id: 2,
            title: 'General 1',
            general: ['General'],
        }
        ,
        {
            id: 26,
            cat_id: 1,
            title: 'HR 1',
            hr: ['HR'],
        }
        ,

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
                    selCourse && Object.entries(selCourse).map((entry, index) => {
                        const key = entry[0]
                        const values = entry[1]
                        // console.log('selectedChapter-entry:', entry)
                        return (key !== 'id' && key !== 'cat_id' ?
                            <div key={index}>
                                {/*  -- Display the title of sub-items from a course.. -- */}
                                <div className={`content__title ${key === 'title' && 'chapter'}`}>{key === 'title' ? 'CHAPTER' : key.toUpperCase()}</div>
                                {key === 'title' ?
                                    <div>{values}</div>
                                    :
                                    // -- Display sub items from a course.. --
                                    values.map((value, index2) => {
                                        return <button onClick={handleChaperSubject} name={index2} key={index2} className='content__subject'>{value}</button>
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