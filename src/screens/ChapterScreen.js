import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getChapters, getChapter, setChapters } from '../slices/chapterSlice'
import { login } from '../slices/userSlices'
import axios from 'axios'
import './ChapterScreen.css'
const ChapterScreen = () => {
    const TYPE_Text = 7
    const TYPE_NONE = 6
    const TYPE_YOUTUBE = 5
    const TYPE_GITHUB = 4
    const TYPE_PDF_File = 3
    const TYPE_VIDEO_File = 2
    const TYPE_HTML_File = 1

    const { chapter_id } = useParams()
    const [chapter, setChapter] = useState(useSelector((state) => getChapter(state, chapter_id)))
    const [contentData, setContentData] = useState(null)
    const [chapterContentLength, setChapterContentLength] = useState(0)
    const [currentContentIndex, setCurrentContentIndex] = useState(0)
    const [updateContent, setUpdateContent] = useState(false)
    const [htmlCode, setHtmlCode] = useState(null)
    const [youtube, setYoutube] = useState(null)
    const [filePath, setFilePath] = useState(null)
    const previousContentIndex = useRef();



    const selectContentFromChapter = async (content) => {
        // console.log('selectContentFromChapter: ', content)
        setHtmlCode(null)
        setYoutube(null)
        setFilePath(null)
        switch (content.chapter_category) {
            case TYPE_YOUTUBE:
                console.log('youtube: ', content.url.split('/').pop())
                setYoutube(content.url)
                break;
            case TYPE_HTML_File:
                setFilePath(content.file)
                await fetchFile(content.file)
                break;
            default:
                break;
        }
    }
    const fetchChapterContent = async (chapterId) => {
        await axios.get(axios.defaults.baseURL + `/api/chapter/${chapterId}`)
            .then(res => {
                console.log('fetchChapterContent: ', res.data)
                setChapter(res.data)
                if (res.data?.content?.length > 0) {
                    console.log('axios: ', res.data.content)
                    previousContentIndex.current = 0
                    setCurrentContentIndex(0)
                    setChapterContentLength(res.data.content.length)
                    setContentData(res.data.content)
                    selectContentFromChapter(res.data.content[0])
                    // const content = res.data.content[0]
                    // setHtmlCode(null)
                    // setYoutube(null)
                    // setFilePath(null)
                    // switch (content.chapter_category) {
                    //     case TYPE_YOUTUBE:
                    //         console.log('youtube: ', content.url.split('/').pop())
                    //         setYoutube(content.url)
                    //         break;
                    //     case TYPE_HTML_File:
                    //         setFilePath(content.file)
                    //         fetchFile(content.file)
                    //         break;
                    //     default:
                    //         break;
                    // }
                }
                //content.chapter_category == TYPE_HTML_File
            })
            .catch(e => console.log('error-fetch-chapter: ', e))
    }
    //-----------------------------------------------
    const fetchFile = async (file) => {
        // -- If there is no https, then broswer prohibits to request
        // so replace http:// with https://. --
        let url
        if (file.includes('https://127.0.0.1')) {
            url = (file.replace('https:', 'http:'))
        }
        else if (file.includes('http://lalasol-bootcamp-backend-production.up.railway.app')) {
            url = (file.replace('http:', 'https:'))
        }
        else {
            url = (file)
        }

        // console.log('----urlFile: ', file, url)

        // -- Go and get the html file from server. --
        if (url.split('.').pop().toLowerCase() == 'html') {
            await axios.get(url,
                {
                    headers: {
                        "Content-type": "Application/Json",
                    }
                }
            )
                .then(res => {
                    // console.log(res.data)
                    setHtmlCode(res.data)
                })
        }
    }
    //-----------------------------------------------
    const handleContentNavigation = async (e) => {

        (e.target.name == 'left' && currentContentIndex > 0) && setCurrentContentIndex((currentContentIndex) => (currentContentIndex - 1));
        (e.target.name == 'right') && (currentContentIndex < chapterContentLength - 1) && setCurrentContentIndex(currentContentIndex + 1);

    }
    useEffect(() => {
        if (contentData) selectContentFromChapter(contentData[currentContentIndex]);
        // console.log('useEffect - handleContentNavigation:', currentContentIndex)
    }, [currentContentIndex])
    // console.log('currentContentIndex: ', currentContentIndex)
    //-----------------------------------------------

    useEffect(() => {
        fetchChapterContent(chapter_id)
        console.log('useEffect',)


    }, [chapter_id])

    /*
          // ----------- IFrame Listener ----------- //
          const iframe_file = document.getElementById("iframe_file")
      const load_iframe_file = (e) => {
          console.log('load_iframe_file: ', window.location)
          // console.log('load_iframe_file: ', iframe_file.contentWindow.location)
          // iframe_file.style.height =
          //     iframe_file.contentWindow.document.body.scrollHeight + 'px';
      }
    
          useEffect(() => {
              if (iframe_file) {
                  console.log('--------- useEffect', iframe_file)
                  iframe_file.addEventListener('load', load_iframe_file)
                  return () => iframe_file.removeEventListener('load', load_iframe_file)
              }
          }, [iframe_file])
      
          const eventMessage = (event) => {
              console.log('eventMessage: ', event.origin)
      
          }
          useEffect(() => {
              window.addEventListener("message", eventMessage, false)
              return () => window.removeEventListener("message", eventMessage)
          })
      */
    return (
        <div className='chapter__screen'>
            {
                chapter && (
                    <div className='chapter__screen_container'>
                        <div className='chapter__screen_body'>
                            <h1>{chapter.title}</h1>
                            <h2>{chapter.sub_title}</h2>
                            <p>{chapter.description}</p>
                            {false && htmlCode && <div className='html_container' dangerouslySetInnerHTML={{ __html: htmlCode }} />}
                            {true && filePath &&
                                <div className='iframe_container_file'>
                                    <iframe
                                        id='iframe_file'
                                        frameBorder="0"
                                        border='0'
                                        width='100%'
                                        // scrolling="no"
                                        className='iframe__view'
                                        src={filePath}
                                        title="description">
                                    </iframe>
                                </div>
                            }

                            {youtube &&
                                <div className='iframe_container_youtube'>
                                    <iframe
                                        frameBorder="0"
                                        border='0'
                                        scrolling="no"
                                        className='iframe__view'
                                        src={`https://www.youtube.com/embed/${youtube.split('/').pop()}`}
                                        title="YouTube video player"

                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                                    </iframe>
                                </div>
                            }
                        </div>
                        {chapterContentLength > 1 &&
                            <div className='chapter__screen_footer'>
                                <div className='chapter__screen_footer_buttons'>
                                    <button name='left' style={{ display: '' }} onClick={handleContentNavigation}>left</button>
                                    <button name='right' style={{ display: '' }} onClick={handleContentNavigation}>right</button>
                                </div>
                            </div>
                        }

                    </div>
                )
            }
        </div>
    )
}

export default ChapterScreen