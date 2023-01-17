import React, { useState, useEffect, useRef } from 'react'
import './PracticeJSScreen.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';
import { tokyoNight, tokyoNightInit } from '@uiw/codemirror-theme-tokyo-night';
import { historyField } from '@codemirror/commands';
import { getUser } from '../slices/userSlices';
import { useSelector } from 'react-redux';


const PracticeJSScreen = () => {

    const { practice_id } = useParams()
    const user = useSelector(getUser)

    const serializedState = localStorage.getItem('myEditorState');
    const value = localStorage.getItem('myValue') || '// Let\'s start LaLaSol coding!';
    // When custom fields should be serialized, you can pass them in as an object mapping property names to fields.
    // See [toJSON](https://codemirror.net/docs/ref/#state.EditorState.toJSON) documentation for more details
    const stateFields = { history: historyField };

    const [code, setCode] = useState(null)
    const [codeResult, setCodeResult] = useState(null)
    const resultRef = useRef(null)
    const [fetchedCode, setFetchedCode] = useState(null)
    const [selCode, setSelCode] = useState(null)
    const [mode, setMode] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchJSCode = async () => {
        const user_role = user.role == 'student' ? 1 : 2
        const url = axios.defaults.baseURL + `/api/student-js-view/${user_role}/${user.id}`
        await axios({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json'
            }

        })
            .then(res => {
                const data = [...res.data]

                // console.log('fetchJSCode:' + url, data)

                setFetchedCode(data)
            })
            .catch(err => console.log('fetchJSCode-error:' + url, err))
    }
    const onClickFetchedCode = (e, codeId) => {
        const selCodeItem = fetchedCode.filter(item => item.id == codeId)[0]

        // console.log('selCodeItem-', selCodeItem)
        selCodeItem.js_code += '\n\n\n\n\n'
        localStorage.setItem('myValue', selCodeItem.js_code);
        setSelCode(selCodeItem)

        setCode(selCodeItem.js_code)
        resultRef.current.innerHTML = ''
        setMode('click')

    }
    const onClickCreateCode = (e) => {
        setSelCode({ title: 'New Code', id: -1, js_code: "// Let\'s start LaLaSol coding!\n" })
        resultRef.current.innerHTML = ''
        setMode('create')
    }
    const onClickDeleteCode = (e, id) => {
        const url = axios.defaults.baseURL + '/api/student-js-delete/' + id
        axios({
            method: 'DELETE',
            url,
            headers: {
                'Content-Type': 'application/json'
            }

        })
            .then(res => {
                // console.log('fetchJSCode:' + url, res.data)
                fetchJSCode()
                resultRef.current.innerHTML = ''
                setSelCode(null)
                setMode(null)
                // setFetchedCode(res.data)
            })
            .catch(err => console.log('fetchJSCode-error:' + url, err))

    }
    const updateCode = async () => {
        // const js_code = localStorage.getItem('myValue')
        const url = axios.defaults.baseURL + '/api/student-js-update/' + selCode.id
        const bodyData = { 'title': selCode.title, 'js_code': selCode.js_code }
        // console.log('onSubmit: ', selCode, ', bodyData', JSON.stringify(bodyData))
        await axios({
            method: 'PATCH',
            url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(bodyData)


        })
            .then(res => {
                // console.log('onSubmit-fetchJSCode:' + url, res.data)
                const data = res.data
                data.js_code += '\n\n\n\n\n'
                fetchJSCode()
                setSelCode(data)
            })
            .catch(err => console.log('fetchJSCode-error:' + url, err))
    }
    const onSubmit = (e, id) => {
        e.preventDefault()
        const js_code = localStorage.getItem('myValue')


        if (id >= 0) {
            /** Update Mode */
            const url = axios.defaults.baseURL + '/api/student-js-update/' + selCode.id
            const bodyData = { 'title': selCode.title, 'js_code': js_code }
            // console.log('onSubmit: ', selCode, ', value: ', js_code, ', bodyData', JSON.stringify(bodyData))
            axios({
                method: 'PATCH',
                url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(bodyData)


            })
                .then(res => {
                    // console.log('onSubmit-fetchJSCode:' + url, res.data)
                    fetchJSCode()
                    const data = res.data
                    data.js_code += '\n\n\n\n\n'
                    setSelCode(res.data)
                })
                .catch(err => console.log('fetchJSCode-error:' + url, err))
        }
        else {
            /** Create Mode */
            const url = axios.defaults.baseURL + '/api/student-js-create/'
            const bodyData = {
                'title': selCode.title,
                'js_code': js_code,
                'student': null,
                'teacher': null
            }
            bodyData[user?.role] = user?.id
            // console.log('onSubmit: ', selCode, ', value: ', js_code, ', bodyData', JSON.stringify(bodyData))
            axios({
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(bodyData)


            })
                .then(res => {
                    // console.log('onSubmit-fetchJSCode:' + url, res.data)
                    fetchJSCode()
                    setMode('click')
                    setSelCode(res.data)
                })
                .catch(err => console.log('fetchJSCode-error:' + url, err))
        }
    }


    const onClickRunCode = (e) => {

        if (!selCode?.js_code) return
        setIsLoading(true)
        resultRef.current.innerText = 'Running Code'
        updateCode()
        const url = 'https://express-shell-execute-js-production.up.railway.app/api/'

        const data = { 'user': user.email, 'id': user.id, 'js-code': selCode.js_code }
        // console.log('data: ', JSON.stringify(data))
        axios({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },

            data: JSON.stringify(data)
        })
            .then(res => {
                // console.log('onClickRunCode-' + url, res.data, resultRef)
                setCodeResult(res.data)

                resultRef.current.innerText = res.data //res.data.replace(/\n/g, "<br />")
            })
            .catch(err => console.log('onClickRunCode-error:' + url, err))
            .finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {

    }, [codeResult])
    useEffect(() => {
        fetchJSCode()
    }, [])
    return (

        <div className='practice__screen'>

            <div className='code-lists'>
                <div className={mode == 'create' ? 'selected-create' : 'create'}>
                    <button className='btn-create' onClick={onClickCreateCode}>Create New</button>
                    {
                        mode == 'create' &&
                        <form className='form-create' onSubmit={e => onSubmit(e, selCode?.id)}>
                            <label>Title</label>
                            <input type='text' name='title' value={selCode.title} onChange={e => setSelCode({ ...selCode, 'title': e.target.value })} />
                            <button className='btn-form' type='submit'>Save</button>
                        </form>
                    }
                </div>
                {fetchedCode?.map(item => {
                    return <div key={item.id} className='item'>
                        {/* <span>{item.title}</span> */}
                        <div className={mode == 'click' && selCode?.id == item.id ? 'selected-item' : ''}>
                            <button className='btn-click' onClick={e => onClickFetchedCode(e, item.id)}>{item.title}</button>
                            {
                                mode == 'click' && selCode?.id == item.id &&
                                <form className='form-click' onSubmit={e => onSubmit(e, selCode?.id)}>
                                    <label>Title</label>
                                    <input type='text' name='title' value={selCode.title} onChange={e => setSelCode({ ...selCode, 'title': e.target.value })} />
                                    <button className='id-btn-form' type='submit'>Update</button>
                                    <button type='button' onClick={e => onClickDeleteCode(e, selCode?.id)}>Delete</button>
                                </form>
                            }
                        </div>

                    </div>
                })}
            </div>
            <CodeMirror className='code-mirror'
                value={selCode?.js_code}
                minWidth={"100%"}
                height="100vh"
                theme={tokyoNight}
                extensions={[javascript({ jsx: false })]}
                onChange={(value, viewUpdate) => {
                    setCode(value)
                    setSelCode({ ...selCode, js_code: value })
                    localStorage.setItem('myValue', value);

                    const state = viewUpdate.state.toJSON(stateFields);
                    localStorage.setItem('myEditorState', JSON.stringify(state));
                }}
            />
            <div className='code-result' style={isLoading ? { cursor: 'wait' } : { cursor: 'default' }}>

                <button onClick={e => onClickRunCode(e)}><span style={{ fontSize: '1.3rem' }}>Run Code</span></button>
                {<div className='code-result' ref={resultRef}></div>}

            </div>


        </div>
    )
}

export default PracticeJSScreen