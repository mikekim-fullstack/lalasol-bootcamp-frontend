import React from 'react'
import './SkillScreen.css'
import { useParams } from 'react-router-dom'
const SkillScreen = () => {
    const { skill_id } = useParams()
    return (

        <div className='skill__screen'>SkillScreen {skill_id}</div>
    )
}

export default SkillScreen