import React, { useState, useEffect } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// import html from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import a11yDark from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark"
import axios from 'axios'
import './PreviewContent.css'

const PreviewContent = ({ contentAction, clickedContentId }) => {
    return (
        <div className='content__preview'>

            {contentAction && contentAction.map(content => {
                switch (content.chapter_category) {
                    case 1: // html file
                        // console.log('case - content.action - html', content, ', clickedContentId:', clickedContentId, axios.defaults.baseURL + content.file)
                        return <div className='iframe_container_file' style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}>

                            <iframe
                                // id='iframe_file'
                                frameBorder="0"
                                border='0'
                                // width="1024"
                                width='100%'
                                // scrolling="no"
                                className='iframe__view'
                                // src={axios.defaults.baseURL + content.file}
                                src={content.action == 'updated' ? URL.createObjectURL(content?.file) : axios.defaults.baseURL + content.file}
                                title="description">

                            </iframe>
                        </div>
                    case 5:// youtube link
                        const url = content.action == '' ? content.url.split('/').pop() : content.url.split('=').pop()
                        console.log('youtube: ', `https://www.youtube.com/embed/${url}`)
                        // document.cookie = "CookieName=Cheecker; path =/; HttpOnly; samesite=Lax; Secure;"
                        return <div className='iframe_container_youtube' style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}>
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
                    case 8:// main title
                        // console.log('case - content.action - main title', content, content.title)
                        return <h1 style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='main_title'>{content.title}</h1>
                    case 9:// sub title 1
                        return <h2 style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='sub_title_1'>{content.title}</h2>
                    case 10:// sub title 2
                        return <h3 style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='sub_title_2'>{content.title}</h3>
                    case 11:// Paragraph
                        // console.log('case - content.action -Paragraph', content, content.text.split('.'))
                        // return content.text.split('.')
                        return <div style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} className='main_paragraph' dangerouslySetInnerHTML={{ __html: content.text }} />
                    // return <p className='main_paragraph'>{content.text}</p>
                    case 12: // Break line
                        {
                            // console.log('case - content.action -break', content)
                            return <hr style={clickedContentId == content.id ? { border: '1px dashed pink', padding: '2px' } : {}} />
                        }
                    case 13:// Code Block
                        // console.log('case - content.action', content.action, content.file)
                        return <div style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}><SyntaxHighlighter language={'js'} style={a11yDark} showLineNumbers="true"
                            customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                            children={content.text}
                        /></div>
                    case 14:// Note
                        return <div style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}}><div className='note' dangerouslySetInnerHTML={{ __html: '<strong>Note:</strong>' + content.text }} /></div>
                    // console.log('case - content.action', content.action, content)
                    case 15:// Image
                        return <img style={clickedContentId == content.id ? { border: '3px dashed pink' } : {}} src={content.action == 'updated' ? URL.createObjectURL(content?.image) : axios.defaults.baseURL + content?.image} />
                    default:
                        <div></div>
                }
            })}
        </div>
    )
}

export default PreviewContent