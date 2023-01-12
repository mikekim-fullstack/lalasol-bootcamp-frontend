import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from "react-helmet";
import './PracticeHtmlScreen.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';
import { tokyoNight, tokyoNightInit } from '@uiw/codemirror-theme-tokyo-night';
import { historyField } from '@codemirror/commands';
import { getUser } from '../slices/userSlices';
import { useSelector } from 'react-redux';

const PracticeHtmlScreen = () => {

    const { practice_id } = useParams()
    const user = useSelector(getUser)

    const serializedState = localStorage.getItem('myEditorState');
    const value = localStorage.getItem('myValue') || '// Let\'s start LaLaSol coding!\n';
    // When custom fields should be serialized, you can pass them in as an object mapping property names to fields.
    // See [toJSON](https://codemirror.net/docs/ref/#state.EditorState.toJSON) documentation for more details
    const stateFields = { history: historyField };

    const [code, setCode] = useState(null)
    const [codeResult, setCodeResult] = useState(false)
    const resultRef = useRef(null)
    const [fetchedCode, setFetchedCode] = useState(null)
    const [selCode, setSelCode] = useState(null)
    const [mode, setMode] = useState(null)
    const [iframeKey, setIframeKey] = useState(0)

    // <script src='https://unpkg.com/@babel/standalone/babel.min.js'></script>
    const defaultHtmlCode = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src='https://unpkg.com/react@16.7.0/umd/react.production.min.js' type="text/javascript"></script>
        <script src='https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js' type="text/javascript"></script>
        <script src='https://unpkg.com/react-router@6.6.1/dist/umd/react-router.production.min.js' type="text/javascript"></script>
        <script src='https://unpkg.com/react-redux@5.0.6/dist/react-redux.min.js' type="text/javascript"></script>
        <script src='https://unpkg.com/@reduxjs/toolkit@1.9.1/dist/redux-toolkit.umd.min.js' type="text/javascript"></script>
        <title>Document</title>
    </head>
    <body id='root'>
    </body>
</html>
            `
    const defaultCssCode = `
body{
    background-color: #1a1b26;
}
h1{
        text-align:center;
        color:white;
}
`
    const defaultJSCode = `
//const root = document.getElementById('root')
//ReactDOM.render(<h1>Hello</h1>,root)
`

    const fetchJSCode = async () => {
        const user_role = user.role == 'student' ? 1 : 2
        const url = axios.defaults.baseURL + `/api/user-html-view/${user_role}/${user.id}`
        await axios({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json'
            }

        })
            .then(res => {
                // console.log('fetchJSCode:' + url, res.data)
                setFetchedCode(res.data)
            })
            .catch(err => console.log('fetchJSCode-error:' + url, err))
    }
    const onClickFetchedCode = (e, codeId) => {
        const selCodeItem = fetchedCode.filter(item => item.id == codeId)[0]

        // console.log('selCodeItem-', selCodeItem)
        // localStorage.setItem('myValue', selCodeItem.js_code);
        setSelCode(selCodeItem)

        // setCode(selCodeItem.js_code)
        // resultRef.current.innerHTML = ''
        setMode('click')

    }
    const onClickCreateCode = (e) => {

        setSelCode({
            title: 'New Code',
            id: -1,
            html_code: defaultHtmlCode,
            css_code: defaultCssCode,
            js_code: defaultJSCode
        })

        setMode('create')
        setCodeResult(null)
    }
    const onClickDeleteCode = (e, id) => {
        const url = axios.defaults.baseURL + '/api/user-html-delete/' + id
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
                // resultRef.current.innerHTML = ''
                setSelCode(null)
                setMode(null)
                // setFetchedCode(res.data)
            })
            .catch(err => console.log('fetchJSCode-error:' + url, err))

    }

    const onSubmitCreate = (e, id) => {
        e.preventDefault()
        // const js_code = localStorage.getItem('myValue')
        /** Create Mode */
        const url = axios.defaults.baseURL + '/api/user-html-create/'
        // const bodyData = { 'title': selCode.title, 'js_code': js_code, [user?.role]: user?.id }
        const bodyData = {
            'title': selCode.title,
            'html_code': selCode.html_code,
            'css_code': selCode.css_code,
            'js_code': selCode.js_code,
            'student': null, 'teacher': null
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
    const updateCode = async () => {
        if (selCode?.id < 0) return
        const url = axios.defaults.baseURL + '/api/user-html-update/' + selCode.id
        const bodyData = {
            'title': selCode.title,
            'html_code': selCode.html_code,
            'css_code': selCode.css_code,
            'js_code': selCode.js_code,
            // 'student': null, 'teacher':null
        }
        if (!selCode.html_code || !selCode.css_code || !selCode.js_code) {
            console.log('Error-not updating your code because one of your code is empty')
            return
        }
        // bodyData[user?.role] = user?.id
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
                fetchJSCode()
                setSelCode(res.data)
            })
            .catch(err => console.log('fetchJSCode-error:' + url, err))
    }
    const onSubmitUpdate = (e, id) => {
        e.preventDefault()
        // console.log('onSubmitUpdate')

        /** Update Mode */
        updateCode()

    }

    const onClickRunCode = (e) => {


        // resultRef.current.innerHTML = ''
        if (!selCode?.html_code) return
        updateCode()
        let index = selCode?.html_code.search(/<\/head>/g)
        // console.log('head index', index)
        let combindedCode = null
        if (index >= 0 && selCode?.css_code) {

            combindedCode = selCode?.html_code.slice(0, index) + '<style>' + selCode?.css_code + '</style>' + selCode?.html_code.slice(index)
        }
        else {
            combindedCode = selCode?.html_code

        }
        index = combindedCode?.search(/<\/body>/g)
        // console.log('body index', index)
        let combindedCodeJS = null
        if (index >= 0 && selCode?.js_code) {

            combindedCodeJS = combindedCode.slice(0, index) + `<script type='text/javascript'>` + selCode?.js_code + '</script>' + combindedCode.slice(index)
        }
        else {
            combindedCodeJS = combindedCode
        }


        const url = 'https://express-shell-execute-js-production.up.railway.app/api-html/'
        // const url = 'http://localhost:5000/api-html'
        const data = { 'user': user.email, 'id': user.id, 'html-code': combindedCodeJS }
        // console.log('data: ', JSON.stringify(data))
        axios({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json' },

            data: JSON.stringify(data)
        })
            .then(res => {
                /** iframeKey makes to reload src=url in iframe by changing key value property */
                setIframeKey(iframeKey + 1)
                setCodeResult(data)

                // resultRef.current.innerHTML = res.data.replace(/\n/g, "<br />")
            })
            .catch(err => console.log('onClickRunCode-error:' + url, err))

    }

    useEffect(() => {

        // console.log('useEffect-codeResult')
    }, [codeResult])

    useEffect(() => {
        fetchJSCode()
    }, [])



    return (

        <div className='practice__html_screen'>

            <div className='code-lists'>
                <div className={mode == 'create' ? 'selected-create' : 'create'}>
                    <button className='btn-create' onClick={onClickCreateCode}>Create New</button>
                    {
                        mode == 'create' &&
                        <form className='form-create' onSubmit={e => onSubmitCreate(e, selCode?.id)}>
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
                                <form className='form-click' onSubmit={e => onSubmitUpdate(e, selCode?.id)}>
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
            <div className='code-container html'>
                <h2 style={{ textAlign: 'center', color: 'yellow' }}>HTML Editor</h2>
                <CodeMirror className='code-mirror html'
                    value={selCode?.html_code}
                    // minWidth={"100%"}
                    height="75vh"
                    theme={tokyoNight}
                    extensions={[html()]}
                    onChange={(value, viewUpdate) => {
                        // setCode(value)
                        setSelCode({ ...selCode, html_code: value })
                        // localStorage.setItem('myValue', selCode);

                        const state = viewUpdate.state.toJSON(stateFields);
                        localStorage.setItem('myEditorState-html', JSON.stringify(state));
                    }}
                />
            </div>
            <div className='code-container css'>
                <h2 style={{ textAlign: 'center', color: 'pink' }}>CSS Editor</h2>
                <CodeMirror className='code-mirror css'
                    value={selCode?.css_code}
                    minWidth={"100%"}
                    height="75vh"
                    theme={tokyoNight}
                    extensions={[css()]}
                    onChange={(value, viewUpdate) => {
                        // setCode(value)
                        setSelCode({ ...selCode, css_code: value })
                        // localStorage.setItem('myValue', value);

                        const state = viewUpdate.state.toJSON(stateFields);
                        localStorage.setItem('myEditorState-css', JSON.stringify(state));
                    }}
                />
            </div>
            <div className='code-container js' style={{ width: '100%' }}>
                <h2 style={{ textAlign: 'center', color: 'cyan', maxWidth: '100%' }}>JavaScript Editor</h2>
                <CodeMirror className='code-mirror js'
                    value={selCode?.js_code}
                    minWidth={"100%"}
                    height="90vh"
                    theme={tokyoNight}
                    extensions={[javascript({ jsx: false })]}
                    onChange={(value, viewUpdate) => {
                        // setCode(value)
                        setSelCode({ ...selCode, js_code: value })
                        // localStorage.setItem('myValue', value);

                        const state = viewUpdate.state.toJSON(stateFields);
                        localStorage.setItem('myEditorState-js', JSON.stringify(state));
                    }}
                />
            </div>
            <div className='code-result'>

                <button onClick={e => onClickRunCode(e)}><span style={{ fontSize: '1.3rem' }}>Run Code</span></button>
                {/* <div className='code-result' id='code-result' ref={resultRef}></div> */}
                {/* {console.log('codeResult', codeResult)} */}
                {codeResult ? <iframe key={iframeKey}
                    style={{ width: '100%', backgroundColor: 'white' }}
                    className='iframe__view'
                    // src={`http://localhost:5000/get-html/?email=${codeResult.user}&id=${codeResult.id}`}
                    src={`https://express-shell-execute-js-production.up.railway.app/get-html/?email=${codeResult.user}&id=${codeResult.id}`}
                    title="description">
                </iframe>
                    : <div></div>

                }


            </div>


        </div>
    )
}

export default PracticeHtmlScreen