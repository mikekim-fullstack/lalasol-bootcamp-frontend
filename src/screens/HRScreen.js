import React from 'react'
import { useParams } from 'react-router-dom'
import './HRScreen.css'
const HRScreen = () => {
    const { hr_id } = useParams()
    return (
        <div className='hr__screen'>HRScreen {hr_id}</div>
    )
}

export default HRScreen