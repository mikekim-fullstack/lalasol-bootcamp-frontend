import React from 'react'
import NavCategoris from './NavCategoris'
import './NavHeader.css'
const NavHeader = () => {
    return (
        <div className='nav__header'>
            <div className='nav__menu'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg>
                {/* <i className="fa-solid fa-bars"></i> */}
                <span className='logo'>LaLaSol<span className='cat'></span></span>
            </div>
            <NavCategoris />
            <div className='nav__user'>
                <i className="fa-regular fa-bell"></i>
                <button>M</button>
            </div>
        </div>
    )
}

export default NavHeader