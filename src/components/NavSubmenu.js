import React, { useEffect } from 'react'
import './NavSubmenu.css'
import { useSelector, useDispatch } from 'react-redux'
import { selectCat, setCat } from '../slices/categorySlice'
import { Link } from 'react-router-dom'
const NavSubmenu = ({ className }) => {
    const subMenu = [
        {
            id: 0,
            courses: ['HTML Intro', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 1,
            courses: ['CSS Intro', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },

        {
            id: 2,
            courses: ['Java Script', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 3,
            courses: ['Data Structure', 'Video #1', 'Video #2'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },
        {
            id: 4,
            courses: ['React JS', 'Video #1', 'Video #2', 'Video #3'],
            quiz: ['Quiz'],
            homework: ['Home Work #1'],
            reference: ['Reference'],
            projects: ['Course Projects', 'Interview Projects'],
            skills: ['Skills'],
        },

        {
            id: 5,
            practices: ['Beginner', 'Intermediate', 'Advanced'],
        },

        {
            id: 6,
            general: ['General'],
        },
        {
            id: 7,
            hr: ['HR'],
        },

    ]
    useEffect(() => {

        // console.log('submenu: ', Object.entries(subMenu[selectedCat?.id]))
    }, [subMenu])

    const selectedCat = useSelector(selectCat)
    const dispatch = useDispatch()
    return (
        <div className={`nav__submenu ${className}`}>
            <h2>{selectedCat && selectedCat.lists[selectedCat.id]}</h2>
            {subMenu && subMenu.length > 0 && Object.entries(subMenu[selectedCat?.id]).map((arr, index) => {
                return (arr[0] !== 'id' && (
                    <div key={index}>

                        <h3 className='submenu__title'>{arr[0].toUpperCase()}</h3>
                        {arr[1].map((course, index) => (
                            // <Link key={index} to={`/${selectedCat.lists[selectedCat.id].toLowerCase().replace(' ', '_')}/${course.toLowerCase().replace(' ', '_')}`}><h4 className='sub__submenu'>{course}</h4></Link>
                            <Link onClick={() => dispatch(setCat({ ...selectedCat, course }))} key={index} to='/content'><h4 className='sub__submenu'>{course}</h4></Link>
                        ))}
                    </div>


                ))
            })}


        </div>
    )
}

export default NavSubmenu