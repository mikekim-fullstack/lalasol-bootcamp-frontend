import React from 'react'
import './ProjectScreen.css'
import { useParams } from 'react-router-dom'
const ProjectScreen = () => {
    const { project_id } = useParams()
    return (
        <div className='project__screen'>ProjectScreen {project_id}</div>
    )
}

export default ProjectScreen