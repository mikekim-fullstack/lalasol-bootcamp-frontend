import React, { useState } from 'react'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import './LoginScreen.css'
// import SignUpScreen from './SignUpScreen'
import { useSelector } from 'react-redux'
// import { selectUser } from '../features/userSlice'
const LoginScreen = () => {
    const [toggleIcon, setToggleIcon] = useState(true)
    // const user = useSelector(selectUser)
    const [signIn, setSignIn] = useState(false)
    // console.log('Login-user: ', user)

    // auth.signOut().then(function () {
    //     console.log('Signed Out');
    // }, function (error) {
    //     console.error('Sign Out Error', error);
    // });

    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        false ? <div className='test'>TEST</div> :

            <div className='loginScreen'>
                {/* Background */}
                <div className="loginScreen__background">
                    {/* <img className='loginScreen__logo'
                    src='https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png'
                    alt='netflix background' /> */}
                    <span className='loginScreen__logo'>LaLaSol <i>BootCamp</i></span>

                    {!signIn && <button onClick={() => setSignIn(true)} className='loginScreen__button'>Sign Up</button>}
                    <div className="loginScreen__gradient" />
                </div>
                {/* Login Body */}
                <div className="loginScreen__body">
                    {
                        // signIn ? <SignUpScreen />
                        signIn ? <h1>Signup screen</h1>
                            :
                            <div className='loginScreen__contents'>
                                <h1>Fullstack Software Developer Bootcamp</h1>
                                <h2>Starts in every 3 month</h2>
                                <h3>Fulltime Evening Course | React Course | Career Services</h3>
                                <div className="loginScreen__input">
                                    <form onSubmit={handleSubmit}>
                                        <div className='email'>
                                            <input type={'email'} placeholder='Email Address*'></input>
                                            <EmailOutlinedIcon className='email_icon' />
                                            {/* <i className="fa-regular fa-envelope"></i> */}
                                        </div>
                                        <div className='password' >
                                            <input type={`${toggleIcon ? 'password' : 'text'}`} placeholder='Password*'></input>
                                            {toggleIcon ? <VisibilityOffOutlinedIcon onClick={() => setToggleIcon(!toggleIcon)} className='pass_icon' /> : <VisibilityOutlinedIcon onClick={() => setToggleIcon(!toggleIcon)} className='pass_icon' />}
                                        </div>

                                        <button disabled={true} type='submit' className='loginScreen__btn_signIn'>Sign In</button>
                                    </form>
                                </div>
                            </div>
                    }
                </div>

            </div>


    )
}

export default LoginScreen