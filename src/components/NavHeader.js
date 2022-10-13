import React, { useState, useEffect } from 'react'
import NavCategoris from './NavCategoris'
import './NavHeader.css'
import { useSelector } from 'react-redux'
import { getCats, getCurrentCat, getCatIdByName } from '../slices/categorySlice'
import NavSubmenu from './NavSubmenu'
const NavHeader = () => {
    let selectedCat = useSelector(getCurrentCat)
    selectedCat = selectedCat && selectedCat[0] && selectedCat[0][1]
    const [showSubmenu, setShowSubmenu] = useState(false)

    const handleSubmenu = (e) => {
        setShowSubmenu(!showSubmenu)
    }
    useEffect(() => {
        if (selectedCat) setShowSubmenu(true)
    }, [selectedCat])
    // console.log('selectedCat: ', selectedCat?.title, showSubmenu)

    return (
        <div className='nav__top'>
            <div className='nav__header'>
                <div className='nav__menu'>
                    <svg onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg>
                    <span className='logo'>
                        LaLaSol
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