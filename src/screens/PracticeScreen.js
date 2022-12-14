import React, { useState, useEffect, useRef } from 'react'
import './PracticeScreen.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';
import { tokyoNight, tokyoNightInit } from '@uiw/codemirror-theme-tokyo-night';
import { historyField } from '@codemirror/commands';
import { getUser } from '../slices/userSlices';
import { useSelector } from 'react-redux';

const PracticeScreen = () => {

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

    const fetchJSCode = async () => {
        const url = axios.defaults.baseURL + '/api/student-js-view/' + user.id
        await axios({
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json'
            }

        })
            .then(res => {
                console.log('fetchJSCode:' + url, res.data)
                setFetchedCode(res.data)
            })
            .catch(err => console.log('fetchJSCode-error:' + url, err))
    }
    const onClickFetchedCode = (e, codeId) => {
        const selCodeItem = fetchedCode.filter(item => item.id == codeId)[0]

        console.log('selCodeItem-', selCodeItem)
        localStorage.setItem('myValue', selCodeItem.js_code);
        setSelCode(selCodeItem)

        setCode(selCodeItem.js_code)

    }
    const onSubmit = (e, id) => {
        e.preventDefault()
        const js_code = localStorage.getItem('myValue')


        if (id >= 0) {

            const url = axios.defaults.baseURL + '/api/student-js-update/' + selCode.id
            const bodyData = { 'title': selCode.title, 'js_code': js_code }
            console.log('onSubmit: ', selCode, ', value: ', js_code, ', bodyData', JSON.stringify(bodyData))
            axios({
                method: 'PATCH',
                url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(bodyData)


            })
                .then(res => {
                    console.log('onSubmit-fetchJSCode:' + url, res.data)
                    fetchJSCode()
                    setSelCode(res.data)
                })
                .catch(err => console.log('fetchJSCode-error:' + url, err))
        }
        else {
            const url = axios.defaults.baseURL + '/api/student-js-create/'
            const bodyData = { 'title': selCode.title, 'js_code': js_code, 'student': user?.id }
            console.log('onSubmit: ', selCode, ', value: ', js_code, ', bodyData', JSON.stringify(bodyData))
            axios({
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(bodyData)


            })
                .then(res => {
                    console.log('onSubmit-fetchJSCode:' + url, res.data)
                    fetchJSCode()
                    setSelCode(res.data)
                })
                .catch(err => console.log('fetchJSCode-error:' + url, err))
        }
    }

    /*
console.log('hello from postman3')
console.log('Hello World \n--------------\n')

const display = (data)=>{
console.log('data=',data)
}

const data=[10,7,8,1,2,3,4]
for (c of data){
display(c)
}
const sortedData = data.sort((a,b)=>a>b?1:a<b?-1:0)
console.log('sortedData=', sortedData)
    */

    const onClickCreateCode = (e) => {
        setSelCode({ title: 'New Code', id: -1, js_code: "// Let\'s start LaLaSol coding!" })
    }
    const onClickRunCode = (e) => {
        const url = 'https://express-shell-execute-js-production.up.railway.app/api/'
        if (!selCode?.js_code) return
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

                resultRef.current.innerHTML = res.data.replace(/\n/g, "<br />")
            })
            .catch(err => console.log('onClickRunCode-error:' + url, err))
    }
    useEffect(() => {

    }, [codeResult])
    useEffect(() => {
        fetchJSCode()
    }, [])
    return (

        <div className='practice__screen'>
            { }
            <div className='code-lists'>
                <div className='create-code'>
                    <button onClick={onClickCreateCode}>Create New</button>
                </div>
                {fetchedCode?.map(item => {
                    return <div key={item.id} className='item'>
                        <span>{item.title}</span>
                        <button onClick={e => onClickFetchedCode(e, item.id)}>Show Code</button>

                    </div>
                })}
            </div>
            <CodeMirror
                value={selCode?.js_code}
                // initialState={
                //     serializedState
                //         ? {
                //             json: JSON.parse(serializedState || ''),
                //             fields: stateFields,
                //         }
                //         : undefined
                // }
                minWidth={"100%"}
                height="100vh"
                theme={tokyoNight}
                // highlightActiveLine={false}
                // rectangularSelection={false}
                // lineNumbers='false'
                extensions={[javascript({ jsx: false })]}
                onChange={(value, viewUpdate) => {
                    setCode(value)
                    setSelCode({ ...selCode, js_code: value })
                    localStorage.setItem('myValue', value);

                    const state = viewUpdate.state.toJSON(stateFields);
                    localStorage.setItem('myEditorState', JSON.stringify(state));
                }}
            />
            <div className='cm-result'>
                {
                    selCode?.title &&
                    <form onSubmit={e => onSubmit(e, selCode?.id)}>
                        <input type='text' name='title' value={selCode.title} onChange={e => setSelCode({ ...selCode, 'title': e.target.value })} />
                        <button type='submit'>Save</button>
                    </form>
                }
                <button onClick={e => onClickRunCode(e)}>Run Code</button>
                {<div className='code-result' ref={resultRef}></div>}

            </div>


        </div>
    )
}

export default PracticeScreen