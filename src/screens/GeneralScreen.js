import React from 'react'
import './GeneralScreen.css'
import { useParams } from 'react-router-dom'
const GeneralScreen = () => {
    const { general_id } = useParams()
    return (
        <div className='general__screen'>GeneralScreen {general_id}</div>
    )
}

export default GeneralScreen