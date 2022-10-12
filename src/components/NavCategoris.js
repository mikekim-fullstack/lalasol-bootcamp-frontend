import React from 'react'
import './NavCategories.css'
import { useDispatch } from 'react-redux'
import { setCat } from '../slices/categorySlice'
const NavCategoris = () => {
    const categories = ['HTML', 'CSS', 'JavaScript', 'Data Structure', 'ReactJS', 'Practices', 'General', 'HR']
    const dispatch = useDispatch()
    const handleBtnClick = (e) => {
        console.log(e.target.name)
        dispatch(setCat({ id: e.target.name, lists: categories }))

    }
    return (
        <div className='nav__categories'>
            {categories.map((category, index) => <button key={index} className='nav__btn_category' onClick={handleBtnClick} name={index} dangerouslySetInnerHTML={{ __html: (category.replace(' ', '&nbsp;')) }}></button>)}
        </div>
    )
}

export default NavCategoris