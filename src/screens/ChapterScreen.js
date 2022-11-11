import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getChapters, getChapter, setChapters } from '../slices/chapterSlice'
import { login, getUser } from '../slices/userSlices'
import axios from 'axios'
import './ChapterScreen.css'
import { Warning } from '@mui/icons-material'
import ProgressBarChapter from '../components/ProgressBarChapter'
import { setCat, setSelectedCatStatus, getSelectedCat, getSelectedCatStatus } from '../slices/categorySlice'
const ChapterScreen = () => {
    const TYPE_Text = 7
    const TYPE_NONE = 6
    const TYPE_YOUTUBE = 5
    const TYPE_GITHUB = 4
    const TYPE_PDF_File = 3
    const TYPE_VIDEO_File = 2
    const TYPE_HTML_File = 1

    const { chapter_id, user_id } = useParams()
    const selectedCatStatus = useSelector(getSelectedCatStatus)
    // const { user } = useSelector(getUser)
    const [chapter, setChapter] = useState(useSelector((state) => getChapter(state, chapter_id)))
    const [contentData, setContentData] = useState(null)
    const [chapterContentLength, setChapterContentLength] = useState(0)
    const [currentContentIndex, setCurrentContentIndex] = useState(0)
    const [updateContent, setUpdateContent] = useState(false)
    const [htmlCode, setHtmlCode] = useState(null)
    const [youtube, setYoutube] = useState(null)
    const [filePath, setFilePath] = useState(null)
    const previousContentIndex = useRef();


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
    const fetchUpdateContentViewed = async (content_id) => {
        await axios({
            method: 'POST',
            url: axios.defaults.baseURL + `/api/chapters-content-viewed/`,
            headers: { "Content-Type": "multipart/form-data" },
            data: { student_id: user_id, chapter_id, content_id }

        })
            .then(res => console.log('fetchUpdateContentViewed-result: ', res.data))
            .catch(e => console.log('fetchUpdateContentViewed-error: ', e))

    }
    const selectContentFromChapter = async (content) => {
        // console.log('selectContentFromChapter: ', content)
        if (content == 'null') return
        setHtmlCode(null)
        setYoutube(null)
        setFilePath(null)
        fetchUpdateContentViewed(content.id)
        switch (content.chapter_category) {
            case TYPE_YOUTUBE:
                console.log('youtube: ', content.url.split('/').pop())
                setYoutube(content.url)
                break;
            case TYPE_HTML_File:
                // console.log('resolveBlockMixedActivity(content.file): ', content.file, resolveBlockMixedActivity(content.file))
                setFilePath(resolveBlockMixedActivity(content.file))

                // //--- If the html file code injects into div then call fetchFile. ---
                // await fetchFile(content.file)
                // //---.
                break;
            default:
                break;
        }
    }

    const fetchChapterContent = async (chapterId) => {
        // 
        await axios.get(axios.defaults.baseURL + `/api/chapter/${chapterId}`)
            .then(res => {
                // console.log('fetchChapterContent: ', res.data)
                setChapter(res.data)
                if (res.data?.content?.length > 0) {
                    const sortedChapterContent = res.data.content.sort((a, b) => a.content_no > b.content_no ? 1 : (a.content_no < b.content_no) ? -1 : 0)
                    console.log('fetchChapterContent: ', res.data.content)
                    previousContentIndex.current = 0
                    setCurrentContentIndex(0)
                    setChapterContentLength(sortedChapterContent.length)
                    setContentData(sortedChapterContent)
                    if (sortedChapterContent.length > 0) {
                        selectContentFromChapter(sortedChapterContent[0])
                    }
                }

            })
            .then(res => console.log('----- content Viewed updated: ', res))
            .catch(e => console.log('error-fetch-chapter: ', e))
    }
    //-----------------------------------------------
    const fetchFile = async (file) => {
        // -- If there is no https, then broswer prohibits to request
        // so replace http:// with https://. --
        const url = resolveBlockMixedActivity(file)

        console.log('----urlFile: ', file, ', url: ', url)

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
                .catch(e => console.log('error: ', e))
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
        // const user_id = JSON.parse(localStorage.getItem('userLogin'))
        // if (contentData) selectContentFromChapter(contentData[currentContentIndex])
        fetchChapterContent(chapter_id)
        console.log('useEffect', user_id)
    }, [chapter_id])

    //-----------------------------------------------
    const isViewedContent = (e) => {
        // console.log('useEffect - eventListener - scroll', document.querySelector('.chapter__screen').getBoundingClientRect().bottom, window.innerHeight)
        if (document.querySelector('.chapter__screen').getBoundingClientRect().bottom <= window.innerHeight) {
            console.log('useEffect - eventListener - scroll -- viewed',)
        }
    }
    useEffect(() => {
        document.addEventListener("scroll", isViewedContent)
        return () => document.removeEventListener("scroll", isViewedContent)
    }, [])

    // // --- Trigger when window is refleshed. ---
    // useEffect(() => {
    //     window.addEventListener("beforeunload", alertUser);
    //     return () => {
    //         window.removeEventListener("beforeunload", alertUser);
    //     };
    // }, []);
    // const alertUser = (e) => {
    //     e.preventDefault();
    //     e.returnValue = "";
    //     // console.log('selectedCat: ', selectedCat)
    //     // dispatch(setSelectedCatStatus(false))
    // };
    return (
        <div className='chapter__screen'>
            {!selectedCatStatus && <ProgressBarChapter />}
            {
                chapter && (
                    <div className='chapter__screen_container'>
                        <div className='chapter__screen_body'>
                            <h1>{chapter.title}</h1>
                            <h2>{chapter.sub_title}</h2>
                            <p>{chapter.description}</p>
                            {false && htmlCode && <div className='html_container' dangerouslySetInnerHTML={{ __html: htmlCode }} />}
                            {true && filePath &&
                                <div id='top' className='iframe_container_file' >
                                    {/* <iframe id='scaled-frame' src={filePath} ></iframe> */}

                                    <iframe
                                        id='iframe_file'
                                        frameBorder="0"
                                        border='0'
                                        // width="1024"
                                        width='100%'
                                        // scrolling="no"
                                        className='iframe__view'
                                        src={filePath}
                                        title="description">

                                    </iframe>
                                </div>
                            }

                            {youtube &&
                                <div id='top' className='iframe_container_youtube'>
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
                                    <a href='#top' name='left' onClick={handleContentNavigation}>left</a>
                                    <a href='#top' name='right' onClick={handleContentNavigation}>right</a>
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