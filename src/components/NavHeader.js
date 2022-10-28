import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavCategories from './NavCategories'
import './NavHeader.css'
import './NavSubmenu.css'
import { useSelector, useDispatch } from 'react-redux'
import { setCat, setSelectedCatStatus, getSelectedCat, getSelectedCatStatus } from '../slices/categorySlice'
import NavSubmenu from './NavSubmenu'
import { getUser, logout } from '../slices/userSlices'


const NavHeader = () => {
    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const navigate = useNavigate()

    const selectedCat = useSelector(getSelectedCat)
    const selectedCatStatus = useSelector(getSelectedCatStatus)


    const handleSubmenu = (e) => {
        dispatch(setSelectedCatStatus(!selectedCatStatus))
        // console.log('-------handleSubmenu clicked')

    }

    const handleHome = (e) => {
        dispatch(setCat(null))
        // console.log('click Home button')
    }
    const handleLogout = () => {
        dispatch(logout())
        navigate('/', { replace: true })
        window.location.reload()
        // navigate(0) // -- to refresh forcefully. --
    }
    // -- When mouse is clicked outside of side menu,
    //    close side menu. --
    const mouseListener = (e) => {
        const navBar = document.querySelector('.nav__header')
        const sideMenu = document.querySelector('.nav__submenu')

        // console.log('mouse position: ', e.clientX, e.clientY, ', clientHeight:', navBar.clientHeight, sideMenu,)

        if (sideMenu && sideMenu.className.includes('nav-open')) {
            // -- exclude the areas in sideMenu and navbar. -- 
            if (sideMenu && (e.clientX > sideMenu.clientWidth) && e.clientY > navBar.clientHeight) {
                dispatch(setSelectedCatStatus(false))
                // console.log("clicked");
            }
        }
    }

    useEffect(() => {
        // -- When mouse is clicked on iframe
        //    close side menu. Because iframe doesn't have onClick event--
        window.focus()
        window.addEventListener("blur", () => {
            setTimeout(() => {
                if (document.activeElement.tagName === "IFRAME") {
                    dispatch(setSelectedCatStatus(false))
                }
            });
        }, { once: false })


        document.addEventListener('click', mouseListener)
        return () => document.removeEventListener('click', mouseListener)
    }, [])
    // console.log('---- NavHeader::selectedCat: ', selectedCat, selectedCat[1], selectedCatStatus)
    return (

        <nav className='nav__header'>
            <div className='nav__container'>
                <div className='nav__menu'>
                    {/* {selectedCat && <svg onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg>} */}
                    {/* <svg className={'active'} onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg> */}
                    <svg className={selectedCat && 'active'} onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg>
                    <span className='logo'>
                        <Link onClick={handleHome} to='/'>LaLaSol</Link>
                        {selectedCat && selectedCat[1] && <span className='cat' dangerouslySetInnerHTML={{ __html: selectedCat[1].replace(' ', '&nbsp;') }}></span>}
                    </span>
                </div>
                <NavCategories />
                <div className='nav__user'>
                    {/* <div className='logout' onClick={handleLogout}>Logout</div> */}
                    <i className="fa-regular fa-bell"></i>
                    {/* <button className='btn_user_profile' onClick={handleLogout}>VS</button> */}
                    <button className='btn_user_profile' onClick={handleLogout}>{user && `${user?.first_name[0]?.toUpperCase()}${user?.last_name[0]?.toUpperCase()}`}</button>
                </div>
                {/* --- Show on/off the Side submenu. --- */}
                {selectedCat && <NavSubmenu className={selectedCatStatus && 'nav-open'} />}
            </div>
        </nav>

    )
}

export default NavHeader