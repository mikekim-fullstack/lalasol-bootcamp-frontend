import React, { useState, useEffect } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// import html from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import a11yDark from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark"
import axios from 'axios'
import './PreviewContent.css'

const PreviewContent = ({ contentAction, clickedContentId, isCreateContentMode }) => {
    const [localContentAction, setLocalContentAction] = useState(null)
    const [gitHubFile, setGitHubFile] = useState(null)
    const [fileExtension, setFileExtension] = useState(null)
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
    }, [contentAction, isCreateContentMode])
    return (
        <div className='content__preview'>
            {/* {console.log('localContentAction: ', localContentAction)} */}
            {localContentAction && localContentAction.map(content => {

                switch (content.chapter_category) {
                    case 1: // html file
                    case 3: // PDF file
                        // console.log('case - content.action - html', content, ', clickedContentId:', clickedContentId, axios.defaults.baseURL + content.file)
                        return <div key={content.id} className='iframe_container_file' style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}>

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
                                    (content.file.includes('http') ? content.file : axios.defaults.baseURL + content.file)}
                                title="description">

                            </iframe>
                        </div>
                    // case 3: // PDF file


                    case 4:// Github
                        {
                            const url = content.url?.replace('https://github.com/', 'https://raw.githubusercontent.com/')?.replace('/blob/', '/')
                            fetchGithub(url, content.id)
                            return localContentAction && localContentAction.length > 0 && gitHubFile && <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} ><SyntaxHighlighter language={fileExtension && fileExtension} style={a11yDark} showLineNumbers="true"
                                customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                                children={gitHubFile && gitHubFile}
                            /></div>
                        }

                    // return;
                    case 5:// youtube link
                        {
                            const url = content.action == '' ?
                                (content.url.includes('watch') ? content.url.split('=').pop() : content.url.split('/').pop())
                                : content.url.split('=').pop()
                            // console.log('youtube: ', `https://www.youtube.com/embed/${url}`, url, content)
                            // document.cookie = "CookieName=Cheecker; path =/; HttpOnly; samesite=Lax; Secure;"
                            return <div key={content.id} className='iframe_container_youtube' style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}>
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
                        }
                    case 8:// main title
                        // console.log('case - content.action - main title', content, content.title)
                        return <h1 key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='main_title'>{content.title}</h1>
                    case 9:// sub title 1
                        return <h2 key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='sub_title_1'>{content.title}</h2>
                    case 10:// sub title 2
                        return <h3 key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='sub_title_2'>{content.title}</h3>
                    case 11:// Paragraph
                        // console.log('case - content.action -Paragraph', content, content.text.split('.'))
                        // return content.text.split('.')
                        return <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='main_paragraph' dangerouslySetInnerHTML={{ __html: content.text }} />
                    // return <p className='main_paragraph'>{content.text}</p>
                    case 12: // Break line
                        {
                            // console.log('case - content.action -break', content)
                            return <hr key={content.id} style={clickedContentId == content.id ? { border: '1px dashed pink', padding: '2px' } : {}} />
                        }
                    case 13:// Code Block
                        // console.log('case - content.action', content.action, content.file)
                        return <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}><SyntaxHighlighter language={'js'} style={a11yDark} showLineNumbers="true"
                            customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                            children={content.text}
                        /></div>
                    case 14:// Note
                        return <div key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}><div className='note' dangerouslySetInnerHTML={{ __html: '<strong>Note:</strong>' + content.text }} /></div>
                    // console.log('case - content.action', content.action, content)
                    case 15:// Image
                        {
                            // const imageURL = 
                            const src = (content.action == 'updated' || content.action == 'created') ?
                                URL.createObjectURL(content?.image)
                                : (content?.image?.includes('http') ? content?.image : axios.defaults.baseURL + content?.image)
                            // const src = (content.action == 'updated' || content.action == 'created') ? URL.createObjectURL(content?.image) : 'https://lalasol-bootcamp-backend-production.up.railway.app' + content?.image
                            // console.log('image: ', src, content)
                            // return;
                            return <img key={content.id} style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} src={src} />
                        }
                    default:
                        <div key={content.id}></div>
                }

            })}
            {/* {localContentAction && localContentAction.length > 0 && gitHubFile && <div ><SyntaxHighlighter language={fileExtension && fileExtension} style={a11yDark} showLineNumbers="true"
                customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                children={gitHubFile && gitHubFile}
            /></div>} */}
        </div>
    )
}

export default PreviewContent