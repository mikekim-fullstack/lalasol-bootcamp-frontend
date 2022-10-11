import React from 'react'
import User from './User'
import './Nav.css'
import NavHeader from './NavHeader'
// import NavCategoris from './NavCategoris'
const Nav = () => {
    return (
        <nav className='nav'>
            <NavHeader />
            {/* <NavCategoris /> */}
        </nav>
    )
}

export default Nav