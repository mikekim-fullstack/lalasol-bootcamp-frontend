import React, { useState } from 'react'
import './LoginScreen.css'
// import SignUpScreen from './SignUpScreen'
import { useSelector } from 'react-redux'
// import { selectUser } from '../features/userSlice'
const LoginScreen = () => {
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
                                            <i class="fa-regular fa-envelope"></i>
                                        </div>
                                        <input type={'password'} placeholder='Password*'></input>
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