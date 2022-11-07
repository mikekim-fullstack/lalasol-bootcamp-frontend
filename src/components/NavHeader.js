import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavCategories from './NavCategories'
import './NavHeader.css'
import './NavSubmenu.css'
import './CourseCard.css'
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
        // dispatch(setCat(null))
        dispatch(setSelectedCatStatus(false))
        console.log('click Home button')
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

        const courseCards = document.querySelectorAll('.course__card')
        let clickedCard = false
        // console.log('mouse position: ', e.clientX, e.clientY, ', clientHeight:', navBar.clientHeight, ', courseCard=', courseCards, ', side-menu=', sideMenu,)
        if (sideMenu && sideMenu.className.includes('nav-open')) {
            // -- exclude the areas in sideMenu and navbar. -- 

            if (sideMenu && (e.clientX > sideMenu.clientWidth) && e.clientY > navBar.clientHeight) {
                for (let i = 0; i < courseCards.length; i++) {
                    if (courseCards[i].contains(e.target)) {
                        clickedCard = true
                        break
                    }
                }
                // console.log('_courseCard: ', clickedCard, courseCards[0])
                if (!clickedCard)
                    dispatch(setSelectedCatStatus(false))
            }
        }
    }

    // // -- Dynamically screen move to right when the  side menu presences. ---
    useEffect(() => {
        window.focus()
        if (selectedCatStatus) {
            const val = getComputedStyle(document.documentElement).getPropertyValue('--side-menu-width')
            console.log('useEffect - css val: ', val, selectedCatStatus)
            document.documentElement.style.setProperty('--side-menu-width-on-off', val)
        }
        else {
            console.log('useEffect - css val: off', selectedCatStatus)

            document.documentElement.style.setProperty('--side-menu-width-on-off', '0')
        }
        //
    }, [selectedCatStatus])


    useEffect(() => {
        // -- When mouse is clicked on iframe
        //    close side menu. Because iframe doesn't have onClick event--
        // 
        window.focus()
        window.addEventListener("blur", () => {
            setTimeout(() => {
                if (document.activeElement.tagName === "IFRAME") {
                    dispatch(setSelectedCatStatus(false))
                }
            });
        }, { once: false })
        console.log('---- NavHeader::selectedCat: ', selectedCatStatus, document.activeElement.tagName)

        document.addEventListener('click', mouseListener)

        return () => {
            document.removeEventListener('click', mouseListener)
        }
    }, [])



    // console.log('---- NavHeader::selectedCat: ', selectedCat[1], selectedCatStatus)
    return (

        <nav className='nav__header'>
            <div className='nav__container'>
                <div className='nav__menu'>
                    <svg className={selectedCat && 'active'} onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg>
                    {/* <svg className={'active'} onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg> */}
                    <span className='logo'>
                        <Link onClick={handleHome} to='/'>LaLaSol</Link>
                        {selectedCat && selectedCat[1] && <span className='cat' dangerouslySetInnerHTML={{ __html: selectedCat[1].replace(' ', '&nbsp;') }}></span>}
                    </span>
                </div>
                <NavCategories />
                <div className='nav__user'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -6 50 50" height="40" width="40"><path d="M7.083 31.458v-2.125H10.5V16.75q0-3.417 2.083-6.042Q14.667 8.083 18 7.375V6.208q0-.833.583-1.396.584-.562 1.417-.562.833 0 1.417.562.583.563.583 1.396v1.167q3.333.708 5.438 3.333 2.104 2.625 2.104 6.042v12.583h3.375v2.125Zm12.917-12Zm0 16.875q-1.208 0-2.104-.875Q17 34.583 17 33.333h6q0 1.25-.875 2.125T20 36.333Zm-7.417-7h14.834V16.75q0-3.125-2.146-5.292Q23.125 9.292 20 9.292q-3.083 0-5.25 2.166-2.167 2.167-2.167 5.292Z" /></svg>
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