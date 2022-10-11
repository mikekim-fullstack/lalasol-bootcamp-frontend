import React from 'react'
import './NavCategories.css'
const NavCategoris = () => {
    const categories = ['HTML', 'CSS', 'JS', 'Data Structure', 'ReactJS', 'Practice', 'General', 'HR']
    const handleBtnClick = (e) => {
        console.log(e.target.name)
    }
    return (
        <div className='nav__categories'>
            {categories.map((category, index) => <button key={index} className='nav__btn_category' onClick={handleBtnClick} name={category} dangerouslySetInnerHTML={{ __html: (category.replace(' ', '&nbsp;')) }}></button>)}
        </div>
    )
}

export default NavCategoris