import React, { useState } from 'react'
import Sidebar from '../../components/LandingView/SideBar'
import Navbar from '../../components/LandingView/NavBar'
import HeroSection from '../../components/LandingView/HeroSection'
import InfoSection from '../../components/LandingView/InfoSection'
import { HomeObjOne, HomeObjTwo, HomeObjThree } from '../../components/LandingView/InfoSection/Data'
import Services from '../../components/LandingView/Services'
import Footer from '../../components/LandingView/Footer'

const LandingPage = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDesc2, setDesc2] = useState(false)
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const onClick = (e, id) => {
        // console.log('clicked', e, id)
        setDesc2(!isDesc2)
    }
    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle} />
            <Navbar toggle={toggle} />
            <HeroSection />
            <InfoSection {...HomeObjOne} onClick={onClick} />
            <InfoSection {...HomeObjTwo} onClick={onClick} isDesc2={isDesc2} />
            <Services />
            <InfoSection {...HomeObjThree} onClick={onClick} />
            <Footer />
        </>
    )
}

export default LandingPage