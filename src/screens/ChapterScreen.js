import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getChapters, getChapter, setChapters, setClickedChapter, getContentAction } from '../slices/chapterSlice'
import { login, getUser } from '../slices/userSlices'
import axios from 'axios'
import './ChapterScreen.css'
import { Warning } from '@mui/icons-material'
import ProgressBarChapter from '../components/ProgressBarChapter'
import { setCat, setSelectedCatStatus, getSelectedCat, getSelectedCatStatus } from '../slices/categorySlice'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// import html from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import a11yDark from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark"
// import '../components/PreviewContent.css'
import HomeScreen from './HomeScreen'

const ChapterScreen = () => {
    const TYPE_Text = 7
    const TYPE_NONE = 6
    const TYPE_YOUTUBE = 5
    const TYPE_GITHUB = 4
    const TYPE_PDF_File = 3
    const TYPE_VIDEO_File = 2
    const TYPE_HTML_File = 1

    const { chapter_id, user_id } = useParams()
    const dispatch = useDispatch()
    const selectedCatStatus = useSelector(getSelectedCatStatus)
    const chapters = useSelector(getChapters)
    // const { user } = useSelector(getUser)
    const [chapter, setChapter] = useState(useSelector((state) => getChapter(state, chapter_id)))
    const contentAction = useSelector(getContentAction)
    const [contentData, setContentData] = useState(null)
    const [chapterContentLength, setChapterContentLength] = useState(0)
    const [currentContentIndex, setCurrentContentIndex] = useState(0)
    const [updateContent, setUpdateContent] = useState(false)
    const [htmlCode, setHtmlCode] = useState(null)
    const [youtube, setYoutube] = useState(null)
    const [filePath, setFilePath] = useState(null)
    const previousContentIndex = useRef();
    const [gitHubFile, setGitHubFile] = useState(null)
    const [fileExtension, setFileExtension] = useState(null)

    /**
       * Question auto number
       */
    let cntQ = 1
    let cntQ1 = 1
    let titleCnt = 1, questionCnt = 1
    let titleCnt1 = 1, questionCnt1 = 1


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
                // console.log('youtube: ', content.url.split('/').pop())
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
        const url = axios.defaults.baseURL + `/api/chapter/${chapterId}`
        await axios.get(url)
            .then(res => {
                // console.log('fetchChapterContent: ', res.data)
                setChapter(res.data)
                if (res.data?.content?.length > 0) {
                    dispatch(setClickedChapter(res.data))
                }

            })
            // .then(res => console.log('----- content Viewed updated: ', res))
            .catch(e => console.log('error-fetch-chapter: ' + url, e.request, e.response))
    }
    //-----------------------------------------------
    const fetchFile = async (file) => {
        // -- If there is no https, then broswer prohibits to request
        // so replace http:// with https://. --
        const url = resolveBlockMixedActivity(file)

        // console.log('----urlFile: ', file, ', url: ', url)

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
        // console.log('useEffect', user_id)
    }, [chapter_id])

    //-----------------------------------------------
    const isViewedContent = (e) => {
        // console.log('useEffect - eventListener - scroll', document.querySelector('.chapter__screen').getBoundingClientRect().bottom, window.innerHeight)
        // if (document.querySelector('.chapter__screen').getBoundingClientRect().bottom <= window.innerHeight) {
        //     // console.log('useEffect - eventListener - scroll -- viewed',)
        // }
    }

    useEffect(() => {
        document.addEventListener("scroll", isViewedContent)
        return () => document.removeEventListener("scroll", isViewedContent)
    }, [])


    return (
        <div >
            {(!chapters || !contentAction) ? <HomeScreen /> :
                <div className='chapter__screen'>

                    <div className='chapter__content__view'>

                        {/* {console.log('contentAction: ', contentAction)} */}
                        <div className='left_section'>
                            <h1>Content Lists</h1>
                            {chapters && contentAction && contentAction.map(content => {
                                let element = ''
                                switch (content.chapter_category) {

                                    // case 8:// main title
                                    //     // console.log('case - content.action - main title', content, content.title)
                                    //     element = <h1 key={content.id} className='main_title'>{content.title}</h1>
                                    //     break
                                    case 9:// sub title 1
                                        element = <div key={content.id} style={{ textAlign: 'left' }} className=''><span style={{ fontWeight: '600' }}>T{titleCnt++})</span>&nbsp;{content.title}</div>
                                        break
                                    case 10:// sub title 2
                                        element = <div key={content.id} style={{ textAlign: 'left' }} className=''>  &nbsp;-{content.title}</div>
                                        break

                                    case 16:// Question
                                        element = <div key={content.id} ><div style={{ textAlign: 'left' }} className='' dangerouslySetInnerHTML={{ __html: `<div class=''><span style='font-weight:600;'>Q: ${cntQ1++}</span>-${content.text}  </div>` }} /></div>
                                        // setQuestionNumber(questionNumber + 1)
                                        break
                                    default:

                                        break//${titleCnt1}_${cntQ1}
                                }
                                if (element)
                                    return <div key={content.id} className={(content.action == '') ? 'element' : ''} >
                                        <a className='ele_a' href={`#id_view_title${titleCnt - 1}_${cntQ1 - 1}`}>
                                            {element}
                                        </a>
                                        {/* <div style={{ marginBottom: '20px' }}></div> */}
                                    </div>;


                            })}
                        </div>
                        <div className='main_section'>
                            {/* <ProgressBarChapter /> */}
                            {chapters && contentAction && contentAction.map(content => {

                                switch (content.chapter_category) {
                                    case 1: // html file
                                    case 3: // PDF file
                                        // console.log('case - content.action - html', content, ', clickedContentId:', clickedContentId, axios.defaults.baseURL + content.file)
                                        return <div key={content.id} className='iframe_container_file' >

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
                                    // case 3: // PDF file


                                    case 4:// Github
                                        {
                                            const url = content.url?.replace('https://github.com/', 'https://raw.githubusercontent.com/')?.replace('/blob/', '/')
                                            fetchGithub(url, content.id)
                                            return contentAction && contentAction.length > 0 && gitHubFile && <div key={content.id}  ><SyntaxHighlighter language={fileExtension && fileExtension} style={a11yDark} showLineNumbers="true"
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
                                            return <div key={content.id} className='iframe_container_youtube' >
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
                                        return <h1 key={content.id} className='main_title'>{content.title}</h1>
                                    case 9:// sub title 1
                                        return <h2 key={content.id} id={`id_view_title${titleCnt1++}_${questionCnt1 - 1}`} className='sub_title_1'>{content.title}</h2>
                                    case 10:// sub title 2
                                        return <h3 key={content.id} className='sub_title_2'>{content.title}</h3>
                                    case 11:// Paragraph
                                        // console.log('case - content.action -Paragraph', content, content.text.split('.'))
                                        // return content.text.split('.')
                                        return <div key={content.id} className='main_paragraph' dangerouslySetInnerHTML={{ __html: content.text }} />
                                    // return <p className='main_paragraph'>{content.text}</p>
                                    case 12: // Break line
                                        {
                                            // console.log('case - content.action -break', content)
                                            return <hr key={content.id} />
                                        }
                                    case 13:// Code Block
                                        // console.log('case - content.action', content.action, content.file)
                                        return <div key={content.id} ><SyntaxHighlighter language={'js'} style={a11yDark} showLineNumbers="true"
                                            customStyle={{ border: 'none', borderRadius: '5px', boxShadow: 'none', width: '100%', padding: '15px 5px', height: 'auto' }}
                                            children={content.text}
                                        /></div>
                                    case 14:// Note
                                        return <div key={content.id} ><div className='note' dangerouslySetInnerHTML={{ __html: '<strong>Note:</strong>' + content.text }} /></div>
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
                                            return <img key={content.id} src={src} />
                                        }
                                    case 16:// Question
                                        return <div key={content.id} ><div id={`id_view_title${titleCnt1 - 1}_${questionCnt1++}`} className='question' dangerouslySetInnerHTML={{ __html: `<div class='question_title'>Question ${cntQ++}</div>` + `<div class='question_content'>` + content.text + `</div>` }} /></div>
                                        // setQuestionNumber(questionNumber + 1)
                                        break
                                    default:
                                        <div key={content.id}></div>
                                }

                            })}
                        </div>
                    </div>
                </div>}
        </div>
    )
}


export default ChapterScreen