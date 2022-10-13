import React from 'react'
import './ContentScreen.css'
import { useSelector } from 'react-redux'
import { getCurrentCat } from '../slices/categorySlice'
// import Nav from '../components/Nav'
const ContentScreen = () => {
    const selectedCat = useSelector(getCurrentCat)
    return (
        <div>
            {/* <Nav /> */}
            <h1>ContentScreen</h1>
            {selectedCat && <h2>{selectedCat.lists[selectedCat.id]}</h2>}
            {selectedCat && <h2>{selectedCat?.course}</h2>}
        </div>
    )
}

export default ContentScreen