import React, { useEffect, useState } from 'react'
import './NavSubmenu.css'
import { useSelector, useDispatch } from 'react-redux'
import { selectCat, setCat } from '../slices/categorySlice'
import { Link } from 'react-router-dom'
const NavSubmenu = ({ className }) => {
    const subMenu = {
        'HTML': [{
            id: 0,
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
            title: 'HTML Level 1',
            courses: ['Reading', 'Video #1'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        }, {
            id: 2,
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
            title: 'HTML Level 3',
            courses: ['HTML Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        }]
        ,
        'CSS': [{
            id: 1,
            title: 'CSS Intro',
            courses: ['CSS Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 2,
            title: 'CSS Level 1',
            courses: ['CSS Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 3,
            title: 'CSS Level 2',
            courses: ['CSS Reading', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 4,
            title: 'CSS Level 3',
            courses: ['CSS Reading 3', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 6,
            title: 'CSS Level 4',
            courses: ['CSS Reading 4', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 7,
            title: 'CSS Level 5',
            courses: ['CSS Reading 5', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        ],
        'JavaScript': [
            {
                id: 2,
                title: 'JavaScript  Intro',
                courses: ['JavaScript Reading', 'Video #1', 'Video #2', 'Video #3'],
                quiz: ['Quiz'],
                homework: ['Home Work #1'],
                reference: ['Reference'],
                projects: ['Course Projects', 'Interview Projects'],
                skills: ['Skills'],
            },
            {
                id: 3,
                title: 'JavaScript Level 1',
                courses: ['JavaScript Reading 1', 'Video #1', 'Video #2', 'Video #3'],
                quiz: ['Quiz'],
                homework: ['Home Work #1'],
                reference: ['Reference'],
                projects: ['Course Projects', 'Interview Projects'],
                skills: ['Skills'],
            },
            {
                id: 4,
                title: 'JavaScript Level 2',
                courses: ['JavaScript Reading 2', 'Video #1', 'Video #2', 'Video #3'],
                quiz: ['Quiz'],
                homework: ['Home Work #1'],
                reference: ['Reference'],
                projects: ['Course Projects', 'Interview Projects'],
                skills: ['Skills'],
            }
        ]
        ,
        'Data Structure': [
            {
                id: 3,
                title: 'Data Structure Intro',
                courses: ['Data Structure Reading', 'Video #1', 'Video #2'],
                quiz: ['Quiz'],
                homework: ['Home Work #1'],
                reference: ['Reference'],
                projects: ['Course Projects', 'Interview Projects'],
                skills: ['Skills'],
            },
            {
                id: 4,
                title: 'Data Structure Level ',
                courses: ['Data Structure Reading 1', 'Video #1', 'Video #2'],
                quiz: ['Quiz'],
                homework: ['Home Work #1'],
                reference: ['Reference'],
                projects: ['Course Projects', 'Interview Projects'],
                skills: ['Skills'],
            },
            {
                id: 5,
                title: 'Data Structure Level 2',
                courses: ['Data Structure Reading 2', 'Video #1', 'Video #2'],
                quiz: ['Quiz'],
                homework: ['Home Work #1'],
                reference: ['Reference'],
                projects: ['Course Projects', 'Interview Projects'],
                skills: ['Skills'],
            }, {
                id: 6,
                title: 'Data Structure Level 3',
                courses: ['Data Structure Reading 3', 'Video #1', 'Video #2'],
                quiz: ['Quiz'],
                homework: ['Home Work #1'],
                reference: ['Reference'],
                projects: ['Course Projects', 'Interview Projects'],
                skills: ['Skills'],
            },
            {
                id: 7,
                title: 'Data Structure Level 4',
                courses: ['Data Structure Reading 4', 'Video #1', 'Video #2'],
                quiz: ['Quiz'],
                homework: ['Home Work #1'],
                reference: ['Reference'],
                projects: ['Course Projects', 'Interview Projects'],
                skills: ['Skills'],
            }

        ]
        ,
        'ReactJS': [{
            id: 4,
            title: 'React JS Intro',
            courses: ['React JS Reading', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 5,
            title: 'React JS Level 1',
            courses: ['React JS Reading 1', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 6,
            title: 'React JS Level 2',
            courses: ['React JS Reading 2', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 7,
            title: 'React JS Level 3',
            courses: ['React JS Reading 3', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 8,
            title: 'React JS Level 4',
            courses: ['React JS Reading 4', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 9,
            title: 'React JS Level 5',
            courses: ['React JS Reading 5', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        ]
        ,
        'Practices': [
            {
                id: 5,
                title: 'Practice 1',
                practices: ['Beginner', 'Intermediate', 'Advanced'],
            }
        ]
        ,
        'General': [{
            id: 6,
            title: 'General 1',
            general: ['General'],
        }]
        ,
        'HR': [{
            id: 7,
            title: 'HR 1',
            hr: ['HR'],
        }]
        ,

    }
    const [selectedChapter, setSelectedChapter] = useState(null)
    const selectedCat = useSelector(selectCat)
    const dispatch = useDispatch()
    const selectedMenuName = selectedCat?.lists[selectedCat.id]

    const selectedSubMenu = Object.entries(subMenu).filter((entry) => entry[0] === selectedMenuName)[0]
    const subjectTitle = selectedSubMenu && selectedSubMenu[0]
    const subjects = selectedSubMenu && selectedSubMenu[1]?.map((subject) => subject.title)
    const chapter = selectedSubMenu && selectedSubMenu[1]
    const handleChaper = (e) => {
        console.log(e.target.name)
        setSelectedChapter(chapter[parseInt(e.target.name)])

    }

    useEffect(() => {
        /*
        console.log('submenu: ', Object.keys(subMenu))
        Object.entries(subMenu).map((entity, index) => {
            const key = entity[0]
            const value = entity[1]
            console.log('key:value = ', key, value, ', length of value: ', value.length)

        })
        */
        console.log('selectedSubMenu: ', selectedSubMenu, subjectTitle, subjects)

        // console.log('submenu: ', Object.entries(subMenu[selectedCat?.id]))
    }, [subMenu])

    useEffect(() => {
        if (selectedChapter) {

            console.log('selectedChapter: ', selectedChapter, Object.entries(selectedChapter).map((entry, index) => entry[0]))


        }
    }, [selectedChapter])

    useEffect(() => {
        setSelectedChapter(chapter[0])
    }, [selectedMenuName])


    return (
        <div className={`nav__submenu ${className}`}>
            <div className='submenu__title'>{selectedMenuName && selectedMenuName}</div>
            <div className='submenu__chapters'>
                {subjects?.map((sub, index) => (
                    <button className='submenu__chapter_btn' onClick={handleChaper} key={index} name={index}>
                        {sub}
                    </button>
                )
                )}
            </div>
            <div className='submenu__chapter_content'>
                {
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
                }
            </div>
            {/* {subMenu && subMenu.length > 0 && Object.entries(subMenu[selectedCat?.id]).map((arr, index) => {
                return (arr[0] !== 'id' && (
                    <div key={index}>

                        <h3 className='submenu__title'>{arr[0].toUpperCase()}</h3>
                        {arr[1].map((course, index) => (
                            // <Link key={index} to={`/${selectedCat.lists[selectedCat.id].toLowerCase().replace(' ', '_')}/${course.toLowerCase().replace(' ', '_')}`}><h4 className='sub__submenu'>{course}</h4></Link>
                            <Link onClick={() => dispatch(setCat({ ...selectedCat, course }))} key={index} to='/content'><h4 className='sub__submenu'>{course}</h4></Link>
                        ))}
                    </div>


                ))
            })} */}


        </div>
    )
}

export default NavSubmenu