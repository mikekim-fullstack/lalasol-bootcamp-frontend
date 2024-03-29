import React, { useState, useEffect } from 'react'
import { FaBars } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { animateScroll as scroll } from 'react-scroll'
import { MobileIcon, Nav, NavbarContainer, NavBtnLink, NavItem, NavLinks, NavLogo, NavMenu, NavBtn } from './NavbarElements'
const Navbar = ({ toggle }) => {
    const [scrollNav, setScrollNav] = useState(false)
    const changeNav = () => {
        // console.log('scrollY: ', window.scrollY)
        const state = (window.scrollY >= 80) ? true : false
        setScrollNav(state)
    }
    const toggleHome = () => {
        scroll.scrollToTop()
    }
    useEffect(() => {
        window.addEventListener('scroll', changeNav)
        // if remove it then not working...
        // return window.removeEventListener('scroll', changeNav)
    }, [])
    return (
        <>
            <IconContext.Provider value={{ color: '#eee' }}>
                <Nav scrollNav={scrollNav}>
                    <NavbarContainer>
                        <NavLogo to='/' onClick={toggleHome}>LaLaSol</NavLogo>
                        <MobileIcon onClick={toggle}><FaBars /></MobileIcon>
                        <NavMenu>
                            <NavItem>
                                <NavLinks to='about' smooth={true} duration={500} spy={true} exact='true' offset={-80}>About</NavLinks>
                            </NavItem>
                            <NavItem>
                                <NavLinks to='discover' smooth={true} duration={500} spy={true} exact='true' offset={-80}>Discover</NavLinks>
                            </NavItem>
                            <NavItem>
                                <NavLinks to='services' smooth={true} duration={500} spy={true} exact='true' offset={-80}>Services</NavLinks>
                            </NavItem>
                            <NavItem>
                                <NavLinks to='signup' smooth={true} duration={500} spy={true} exact='true' offset={-80}>Sign Up</NavLinks>
                            </NavItem>
                        </NavMenu>
                        <NavBtn>
                            <NavBtnLink to='/signin'>Sign In</NavBtnLink>
                        </NavBtn>
                    </NavbarContainer>
                </Nav>
            </IconContext.Provider>
        </>
    )
}

export default Navbar