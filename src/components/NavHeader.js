import React, { useState, useEffect } from 'react'
import NavCategoris from './NavCategoris'
import './NavHeader.css'
import { useSelector } from 'react-redux'
import { selectCat } from '../slices/categorySlice'
import NavSubmenu from './NavSubmenu'
const NavHeader = () => {
    const selectedCat = useSelector(selectCat)
    const [showSubmenu, setShowSubmenu] = useState(false)

    const handleSubmenu = (e) => {
        setShowSubmenu(!showSubmenu)
    }
    useEffect(() => {
        if (selectedCat) setShowSubmenu(true)
    }, [selectedCat])
    // console.log('selectedCat: ', selectedCat, showSubmenu)

    return (
        <div className='nav__header'>
            <div className='nav__menu'>
                <svg onClick={handleSubmenu} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.5 17.275v-1h17v1Zm0-4.775v-1h17v1Zm0-4.775v-1h17v1Z" /></svg>
                <span className='logo'>
                    LaLaSol
                    <span className='cat' dangerouslySetInnerHTML={{ __html: selectedCat && selectedCat.lists[selectedCat.id].replace(' ', '&nbsp;') }}></span>
                </span>
            </div>
            <NavCategoris />
            <div className='nav__user'>
                <i className="fa-regular fa-bell"></i>
                <button>M</button>
            </div>
            {selectedCat && <NavSubmenu className={showSubmenu && 'nav-open'} />}
        </div>
    )
}

export default NavHeader