import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NavCategoris from './NavCategoris'
import './NavHeader.css'
import './NavSubmenu.css'
import { useSelector, useDispatch } from 'react-redux'
import { setCat, getCurrentCat, getCatIdByName } from '../slices/categorySlice'
import NavSubmenu from './NavSubmenu'
const NavHeader = () => {
    const dispatch = useDispatch()
    let selectedCat = useSelector(getCurrentCat)
    selectedCat = selectedCat && selectedCat[0] && selectedCat[0][1]
    const [showSubmenu, setShowSubmenu] = useState(false)

    const handleSubmenu = (e) => {
        setShowSubmenu(!showSubmenu)
    }
    const handleHome = (e) => {
        dispatch(setCat(null))
        console.log('click Home button')
    }
    useEffect(() => {
        if (selectedCat) setShowSubmenu(true)
    }, [selectedCat])




    // -- When mouse is clicked outside of side menu,
    //    close side menu. --
    const mouseListener = (e) => {
        const navBar = document.querySelector('.nav__header')
        const sideMenu = document.querySelector('.nav__submenu')
        // console.log('mouse position: ', e.clientX, e.clientY, ', clientHeight:', navBar.clientHeight, sideMenu)

        if (sideMenu && sideMenu.className.includes('nav-open')) {
            if (sideMenu && (e.clientX > sideMenu.clientWidth) && e.clientY > navBar.clientHeight) {
                setShowSubmenu(false)
            }
        }

        // if (sideMenu && (e.clientX > sideMenu.clientWidth)) {

        //     sideMenu.clickOutsideThisElement(() => {
        //     setShowSubmenu(false)
        //     console.log('out of side menu')
        // });
        // if (isClickInsideElement) {
        //     //Do something click is outside specified element
        //     setShowSubmenu(false)
        //     console.log('out of side menu')
        // }

        // if (sideMenu && (e.clientX > 200)) {
        //     setShowSubmenu(false)
        //     console.log('out of side menu')
        // }
    }
    useEffect(() => {
        // const sideMenu = document.querySelector('.nav__submenu')
        // console.log(sideMenu)
        document.addEventListener('click', (e) => mouseListener(e))
        return () => document.removeEventListener('click', mouseListener)
    }, [])



    // console.log('selectedCat: ', selectedCat?.title, showSubmenu)

    return (

        <div className='nav__header'>
            <div className='nav__container'>
                <div className='nav__menu'>
                    {/* {selectedCat && <svg onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg>} */}
                    <svg className={selectedCat && 'active'} onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg>
                    <span className='logo'>
                        <Link onClick={handleHome} to='/'>LaLaSol</Link>
                        {selectedCat && selectedCat.title && <span className='cat' dangerouslySetInnerHTML={{ __html: selectedCat.title.replace(' ', '&nbsp;') }}></span>}
                    </span>
                </div>
                <NavCategoris />
                <div className='nav__user'>
                    <i className="fa-regular fa-bell"></i>
                    <button>M</button>
                </div>
                {selectedCat && <NavSubmenu className={showSubmenu && 'nav-open'} />}
            </div>
        </div>

    )
}

export default NavHeader