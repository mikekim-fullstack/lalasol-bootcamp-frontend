import React from 'react'
import './ReferenceScreen.css'
import { useParams } from 'react-router-dom'
const ReferenceScreen = () => {
    const { reference_id } = useParams()
    return (
        <div className='reference__screen'>ReferenceScreen {reference_id}</div>
    )
}

export default ReferenceScreen