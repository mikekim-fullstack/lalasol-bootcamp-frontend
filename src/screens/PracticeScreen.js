import React, { useState, useEffect, useRef } from 'react'
import './PracticeScreen.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';
import { tokyoNight, tokyoNightInit } from '@uiw/codemirror-theme-tokyo-night';

const PracticeScreen = () => {

    const { practice_id } = useParams()

    const [code, setCode] = useState(null)
    const [codeResult, setCodeResult] = useState(null)
    const resultRef = useRef(null)
    const onClickRunCode = (e) => {
        const url = 'https://express-shell-execute-js-production.up.railway.app/api/'
        if (!code) return
        const data = { 'user': 's1@gmail.com', 'id': '2', 'js-code': code }
        console.log('data: ', JSON.stringify(data))
        axios({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'Application/Json' },
            data: JSON.stringify(data)
        })
            .then(res => {
                console.log('onClickRunCode-' + url, res.data, resultRef)
                setCodeResult(res.data)

                resultRef.current.innerHTML = res.data.replace(/\n/g, "<br />")
            })
            .catch(err => console.log('onClickRunCode-error:' + url, err))
    }
    useEffect(() => {

    }, [codeResult])
    return (
        <div className='practice__screen'>
            {/* PracticeScreen {practice_id} */}
            <CodeMirror
                value="// Let's start LaLaSol coding!"
                minWidth={"100%"}
                // style={{ marginLeft: "auto", marginRight: "auto" }}
                height="100vh"
                theme={tokyoNight}
                extensions={[javascript({ jsx: false })]}
                onChange={(value, viewUpdate) => {
                    setCode(value)
                    // console.log('value:', value);
                }}
            />
            <div className='cm-result'>
                <button onClick={e => onClickRunCode(e)}>Run Code</button>
                {<div className='code-result' ref={resultRef}></div>}
                {/* {codeResult && <CodeMirror
                    value={JSON.stringify(codeResult)}
                    minWidth={"100%"}
                    // style={{ marginLeft: "auto", marginRight: "auto" }}
                    height="100vh"
                    theme={tokyoNight}

                />} */}
            </div>


        </div>
    )
}

export default PracticeScreen