import React from 'react'
import './PracticeScreen.css'
import { useParams } from 'react-router-dom'
const PracticeScreen = () => {
    const { practice_id } = useParams()
    return (
        <div className='practice__screen'>PracticeScreen {practice_id}</div>
    )
}

export default PracticeScreen