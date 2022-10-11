import React from 'react'
import { Link } from 'react-router-dom'
import './User.css'
const User = () => {
    return (
        <div className='user'>
            <Link to='/profile'>
                <div className="img__container" style={{ backgroundImage: `url(${require('../images/mikekim-profile1.JPG')})` }}>
                </div>
            </Link>
            <div className="links">
                <Link to='/profile'>Profile</Link>
                <Link to='/logout'>Logout</Link>
            </div>
        </div >
    )
}

export default User