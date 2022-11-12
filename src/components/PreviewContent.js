import React, { useState, useEffect } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// import html from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import a11yDark from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark"
import axios from 'axios'
import './PreviewContent.css'

const PreviewContent = ({ contentAction, }) => {
    return (
        <div className='content__preview'>

            {contentAction && contentAction.map(content => {
                switch (content.chapter_category) {
                    case 1: // html file
                        console.log('case - content.action - html', content, axios.defaults.baseURL + content.file)
                        return <div className='iframe_container_file' >

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
                        console.log('youtube: ', `https://www.youtube.com/embed/${content.url.split('=').pop()}`)
                        return <div className='iframe_container_youtube'>
                            <iframe
                                frameBorder="0"
                                border='0'
                                scrolling="no"
                                className='iframe__view'
                                src={`https://www.youtube.com/embed/${content.url.split('=').pop()}`}
                                title="YouTube video player"

                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                            </iframe>
                        </div>
                    case 8:// main title
                        console.log('case - content.action - main title', content, content.title)
                        return <h1 className='main_title'>{content.title}</h1>
                    case 11:// Paragraph
                        console.log('case - content.action -Paragraph', content, content.text.split('.'))
                        // return content.text.split('.')
                        return <p className='main_paragraph'>{content.text}</p>
                    case 13:// Code Block
                        // console.log('case - content.action', content.action, content.file)
                        return <SyntaxHighlighter language={'js'} style={a11yDark} showLineNumbers="true"
                            customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                            children={content.text}
                        />

                    case 15:// Image File
                        console.log('case - content.action', content.action, content)
                        return <img src={content.action == 'updated' ? URL.createObjectURL(content?.image) : axios.defaults.baseURL + content?.image} />
                    default:
                        <div></div>
                }
            })}
        </div>
    )
}

export default PreviewContent