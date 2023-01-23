import React, { useEffect, useState } from 'react'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
// import useAxios from '../useAxios'
import axios from 'axios'
import FetchData from '../../../components/FetchData';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { login, getUser } from '../../../slices/userSlices';
import { resetPathAll } from '../../../slices/pathSlice'
import { Container, FormContent, FormWrap, Form, FormH1, Icon, FormLabel, FormInput, FormButton, Text } from './SigninElements'
import './Signin.css'
const Signin = () => {
    const [toggleIcon, setToggleIcon] = useState(true)
    const [singUp, setSingUp] = useState(false)
    const [loginError, setLoginError] = useState(null)
    const [role, setRole] = useState('student')
    const [inputData, setInputData] = useState({ email: '', password: '', updated: false })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log('handleSubmit: role-', role)

        console.log(e.target, e.target.email.value, e.target.password.value)

        try {

            const res = await axios({
                method: 'POST',
                url: role == 'student' ? '/api/student-login/' : '/api/teacher-login/',
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
            dispatch(resetPathAll())
            navigate('/', { replace: true })
        }
        catch (e) {
            console.log('error: /api/student-login/, /api/teacher-login/', e.response.data, ', message=', e.message)
            setLoginError(e?.response?.data?.error)
        }


    }
    useEffect(() => {
        if (loginError == null) return;
        const timer = setTimeout(() => setLoginError(null), 5000)
        return () => clearTimeout(timer)

    }, [loginError])
    return (

        <Container>
            <FormWrap>
                <Icon to='/'>LaLaSol</Icon>
                <FormContent>
                    <Form action='#' onSubmit={handleSubmit}>
                        <FormH1>Sign in your account</FormH1>
                        {<div className='error_message'

                            style={loginError ? {
                                backgroundColor: 'rgba(138, 10, 10, 1)',
                                borderRadius: 'rgba(90, 0, 0, 1)',
                                display: 'unset',
                            } : { display: 'none' }}>&nbsp;{loginError && `Error: ${loginError}`}</div>
                        }
                        <div className='role' >
                            <div>You are  </div>
                            <select value={role} onChange={e => setRole(e.target.value)}>
                                {/* <option value='select'>Select</option> */}
                                <option value='student'>Student</option>
                                <option value='teachter'>Teacher</option>
                            </select>
                        </div>
                        <FormLabel htmlFor='for'>Email</FormLabel>
                        <FormInput type='email' name='email' required placeholder='Email Address*' />
                        <FormLabel htmlFor='for'>Password</FormLabel>
                        <FormInput type='password' name='password' required placeholder='Password*' />
                        <FormButton type='submit'>Continue</FormButton>
                        <Text>Forgot password </Text>
                    </Form>
                </FormContent>
            </FormWrap>
        </Container>

    )
}

export default Signin