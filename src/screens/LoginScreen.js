import React, { useEffect, useState } from 'react'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
// import useAxios from '../useAxios'
import axios from 'axios'
import FetchData from '../components/FetchData';
import './LoginScreen.css'
// import SignUpScreen from './SignUpScreen'
import { useSelector, useDispatch } from 'react-redux'
import { login, getUser } from '../slices/userSlices';
const LoginScreen = () => {
    const [toggleIcon, setToggleIcon] = useState(true)
    const [signIn, setSignIn] = useState(false)
    const [loginError, setLoginError] = useState(null)
    // const [inputData, setInputData] = useState({ email: '', password: '', updated: false })
    // const user = useSelector(selectUser)
    const dispatch = useDispatch()

    // console.log('Login-user: ', user)

    // auth.signOut().then(function () {
    //     console.log('Signed Out');
    // }, function (error) {
    //     console.error('Sign Out Error', error);
    // });

    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(e.target, e.target.email.value, e.target.password.value)
        try {

            const res = await axios({
                method: 'POST',
                url: '/api/student-login/',
                headers: {
                    'Content-Type': 'Application/Json'
                },
                data: {
                    'email': e.target.email.value,
                    'password': e.target.password.value,
                }

            })
            // console.log('res: ', res.data)
            dispatch(login(res.data))
        }
        catch (e) {
            console.log('error: ', e.response.data, ', message=', e.message)
            setLoginError(e?.response?.data?.error)
        }


    }
    useEffect(() => {
        if (loginError == null) return;
        const timer = setTimeout(() => setLoginError(null), 5000)
        return () => clearTimeout(timer)

    }, [loginError])

    return (
        // false ? <div className='test'>TEST</div> :

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
                                {/* {loginError && <div className='error_message'>Error:&nbsp;{loginError}</div>} */}
                                {<div className='error_message'
                                    style={loginError && {
                                        backgroundColor: 'rgba(138, 10, 10, 0.5)',
                                        borderRadius: 'rgba(90, 0, 0, 1)'
                                    }}>&nbsp;{loginError && `Error: ${loginError}`}</div>
                                }
                                <form onSubmit={handleSubmit}>
                                    <div className='email'>
                                        <input type={'email'} name='email' required placeholder='Email Address*'></input>
                                        <EmailOutlinedIcon className='email_icon' />

                                    </div>
                                    <div className='password' >
                                        <input type={`${toggleIcon ? 'password' : 'text'}`} name='password' required placeholder='Password*'></input>
                                        {toggleIcon ? <VisibilityOffOutlinedIcon onClick={() => setToggleIcon(!toggleIcon)} className='pass_icon' /> : <VisibilityOutlinedIcon onClick={() => setToggleIcon(!toggleIcon)} className='pass_icon' />}
                                    </div>

                                    <button disabled={false} type='submit' className='loginScreen__btn_signIn'>Sign In</button>
                                </form>
                            </div>
                        </div>

                }
            </div>

        </div>


    )
}

export default LoginScreen