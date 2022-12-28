import React, { useState, useEffect } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// import html from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import a11yDark from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark"
import axios from 'axios'
import './PreviewContent.css'

const PreviewContent = ({ contentAction, clickedContentId, isCreateContentMode, onClickedElement, onClickedTitleElement }) => {
    const [localContentAction, setLocalContentAction] = useState(null)
    const [gitHubFile, setGitHubFile] = useState(null)
    const [fileExtension, setFileExtension] = useState(null)
    /**
     * Question auto number
     */
    let cnt = 1
    let cnt1 = 1
    let titleCnt = 1

    const resolveBlockMixedActivity = (file) => {
        let url = null
        if (file.includes('https://127.0.0.1')) {
            url = (file.replace('https:', 'http:'))
        }
        else if (file.includes('http://lalasol')) {
            url = (file.replace('http:', 'https:'))
        }
        else {
            url = (file)
        }
        return url
    }
    const fetchGithub = async (url, content_id) => {

        // console.log('-- url Github: ', url)
        const ext = url.split('.').pop().toLocaleLowerCase()
        await axios.get(url,
            {
                headers: {
                    "Content-type": "Application/Json",
                    // 'Access-Control-Allow-Origin': '*',
                }
            }
        )
            .then(res => {

                // console.log('------github----', res.data)
                setGitHubFile(res.data)
                setFileExtension(ext)


            })
            .catch(err => {
                console.log('error: ' + url, err)
                // return <div>Not Found</div>
            })

    }

    useEffect(() => {

        // console.log('<<<< useEffect-PreviewContent: -isCreateContentMode-', isCreateContentMode, ', contentAction', contentAction)
        if (isCreateContentMode) {
            /** In Add(Create) mode, only show the new content in preview area
             *  otherwise it shows all in preview area.
             */
            if (contentAction) setLocalContentAction(contentAction?.filter((item) => item.action == 'created'))
        }
        else {
            setLocalContentAction(contentAction)
        }
    }, [contentAction])//[contentAction, isCreateContentMode])
    // console.log('============== Preview render ==============')
    return (
        localContentAction &&
        <div className='content__preview'>
            {/* {console.log('localContentAction: ', localContentAction)} */}

            <div className='left_section'>
                <h1>Content Lists</h1>
                {localContentAction && localContentAction.map((content, index) => {
                    let element = ''
                    switch (content.chapter_category) {

                        // case 8:// main title
                        //     // console.log('case - content.action - main title', content, content.title)
                        //     element = <h1 key={content.id} className='main_title'>{content.title}</h1>
                        //     break
                        case 9:// sub title 1
                            element = <div key={content.id} style={{ textAlign: 'left' }} className=''>T{titleCnt++})&nbsp;{content.title}</div>
                            break
                        case 10:// sub title 2
                            element = <div key={content.id} style={{ textAlign: 'left' }} className=''>  &nbsp;-{content.title}</div>
                            break

                        case 16:// Question
                            element = <div key={content.id} ><div style={{ textAlign: 'left' }} className='' dangerouslySetInnerHTML={{ __html: `<div class=''>Q: ${cnt1++}-${content.text}  </div>` }} /></div>
                            // setQuestionNumber(questionNumber + 1)
                            break
                        default:

                            break
                    }
                    if (element)
                        return <div key={content.id} className={(content.action == '') ? 'element' : ''} onClick={e => onClickedTitleElement(e, content)}><a className='ele_a' href='#id_element'>{element}</a></div>

                })}
            </div>
            <div className='main_section'>

                {localContentAction && localContentAction.map((content, index) => {
                    let element = ''
                    switch (content.chapter_category) {
                        case 1: // html file
                        case 3: // PDF file
                            // console.log('case - content.action - html', content, ', clickedContentId:', clickedContentId, axios.defaults.baseURL + content.file)
                            element = <div key={content.id} className='iframe_container_file' style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}>

                                <iframe
                                    // id='iframe_file'
                                    frameBorder="0"
                                    border='0'
                                    // width="1024"
                                    width='100%'
                                    // scrolling="no"
                                    className='iframe__view'
                                    // src={axios.defaults.baseURL + content.file}
                                    src={(content.action == 'updated' || content.action == 'created') ?
                                        URL.createObjectURL(content?.file) :
                                        (content.file.includes('http') ? resolveBlockMixedActivity(content.file) : resolveBlockMixedActivity(axios.defaults.baseURL) + content.file)}
                                    title="description">

                                </iframe>
                            </div>
                            break


                        case 4:// Github
                            {
                                const url = content.url?.replace('https://github.com/', 'https://raw.githubusercontent.com/')?.replace('/blob/', '/')
                                fetchGithub(url, content.id)
                                element = localContentAction && localContentAction.length > 0 && gitHubFile && <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} ><SyntaxHighlighter language={fileExtension && fileExtension} style={a11yDark} showLineNumbers="true"
                                    customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                                    children={gitHubFile && gitHubFile}
                                /></div>
                                break
                            }

                        // return;
                        case 5:// youtube link
                            {
                                const url = content.action == '' ?
                                    (content.url.includes('watch') ? content.url.split('=').pop() : content.url.split('/').pop())
                                    : content.url.split('=').pop()
                                // console.log('youtube: ', `https://www.youtube.com/embed/${url}`, url, content)
                                // document.cookie = "CookieName=Cheecker; path =/; HttpOnly; samesite=Lax; Secure;"
                                element = <div key={content.id} className='iframe_container_youtube' style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}>
                                    <iframe
                                        frameBorder="0"
                                        border='0'
                                        scrolling="no"
                                        className='iframe__view'
                                        src={`https://www.youtube.com/embed/${url}`}
                                        title="YouTube video player"

                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; " allowFullScreen>
                                    </iframe>
                                </div>
                                break
                            }
                        case 8:// main title
                            // console.log('case - content.action - main title', content, content.title)
                            element = <h1 key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='main_title'>{content.title}</h1>
                            break
                        case 9:// sub title 1
                            element = <h2 key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='sub_title_1'>{content.title}</h2>
                            break
                        case 10:// sub title 2
                            element = <h3 key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='sub_title_2'>{content.title}</h3>
                            break
                        case 11:// Paragraph
                            // console.log('case - content.action -Paragraph', content, content.text.split('.'))
                            // return content.text.split('.')
                            element = <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='main_paragraph' dangerouslySetInnerHTML={{ __html: content.text }} />
                            break
                        // return <p className='main_paragraph'>{content.text}</p>
                        case 12: // Break line
                            {
                                // console.log('case - content.action -break', content)
                                element = <hr key={content.id} style={clickedContentId == content.id ? { border: '1px dashed pink', padding: '2px' } : {}} />
                                break
                            }
                        case 13:// Code Block
                            // console.log('case - content.action', content.action, content.file)
                            element = <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}><SyntaxHighlighter language={'js'} style={a11yDark} showLineNumbers="true"
                                customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                                children={content.text}
                            /></div>
                            break
                        case 14:// Note
                            element = <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}><div className='note' dangerouslySetInnerHTML={{ __html: '<strong>Note:</strong>' + content.text }} /></div>
                            break
                        // console.log('case - content.action', content.action, content)
                        case 15:// Image
                            {
                                // const imageURL = 
                                const src = (content.action == 'updated' || content.action == 'created') ?
                                    URL.createObjectURL(content?.image)
                                    : (content?.image?.includes('http') ? resolveBlockMixedActivity(content?.image) : resolveBlockMixedActivity(axios.defaults.baseURL) + content?.image)
                                // const src = (content.action == 'updated' || content.action == 'created') ? URL.createObjectURL(content?.image) : 'https://lalasol-bootcamp-backend-production.up.railway.app' + content?.image
                                // console.log('image: ', src, content)
                                // return;
                                element = <img key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} src={src} />
                                break
                            }
                        case 16:// Question
                            element = <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}><div className='question' dangerouslySetInnerHTML={{ __html: `<div class='question_title'>Question ${cnt++}</div>` + `<div class='question_content'>` + content.text + `</div>` }} /></div>
                            // setQuestionNumber(questionNumber + 1)
                            break
                        default:
                            element = <div key={content.id}></div>
                            break
                    }
                    return <div key={content.id} className={(content.action == '') ? `element_${content.id}` : ''} onClick={e => onClickedElement(e, content)}><a href={`#id_element`}>{element}</a></div>

                })}
            </div>

        </div>

    )
}

export default PreviewContent