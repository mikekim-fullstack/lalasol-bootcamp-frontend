import React from 'react'
import { useParams } from 'react-router-dom'
import './HomeworkScreen.css'
const HomeworkScreen = () => {
    const { homework_id } = useParams()
    return (
        <div className='homework__screen'>HomeworkScreen {homework_id}</div>
    )
}

export default HomeworkScreen