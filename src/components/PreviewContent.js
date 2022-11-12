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
                    case 9:// sub title 1
                        return <h2 className='sub_title_1'>{content.title}</h2>
                    case 10:// sub title 2
                        return <h3 className='sub_title_2'>{content.title}</h3>
                    case 11:// Paragraph
                        // console.log('case - content.action -Paragraph', content, content.text.split('.'))
                        // return content.text.split('.')
                        return <div className='main_paragraph' dangerouslySetInnerHTML={{ __html: content.text }} />
                    // return <p className='main_paragraph'>{content.text}</p>
                    case 12: // Break line
                        {
                            console.log('case - content.action -break', content)
                            return <hr />
                        }
                    case 13:// Code Block
                        // console.log('case - content.action', content.action, content.file)
                        return <SyntaxHighlighter language={'js'} style={a11yDark} showLineNumbers="true"
                            customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                            children={content.text}
                        />
                    case 14:// Note
                        return <div className='note'><strong>Note:</strong> {content.text}</div>
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