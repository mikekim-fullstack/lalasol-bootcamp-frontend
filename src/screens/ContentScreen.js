import React from 'react'
import './ContentScreen.css'
import { useSelector } from 'react-redux'
import { selectCat } from '../slices/categorySlice'
import Nav from '../components/Nav'
const ContentScreen = () => {
    const selectedCat = useSelector(selectCat)
    return (
        <div>
            <Nav />
            <h1>ContentScreen</h1>
            {selectedCat && <h2>{selectedCat.lists[selectedCat.id]}</h2>}
        </div>
    )
}

export default ContentScreen