import React from 'react'
import './QuizScreen.css'
import { useParams } from 'react-router-dom'
const QuizScreen = () => {
    const { quiz_id } = useParams()
    return (
        <div className='quiz__screen'>QuizScreen {quiz_id}</div>
    )
}

export default QuizScreen