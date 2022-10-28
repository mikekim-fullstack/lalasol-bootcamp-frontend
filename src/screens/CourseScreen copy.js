import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './CourseScreen.css'
import { useSelector, useDispatch } from 'react-redux'
import { getChapters, setTest, setChapters } from '../slices/chapterSlice'
import { login } from '../slices/userSlices'
import axios from 'axios'

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// import html from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import a11yDark from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark"

// SyntaxHighlighter.registerLanguage('html', html)

// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

const CourseScreen = () => {
    const { course_id } = useParams()
    const chapters = useSelector((state) => getChapters(state))
    const [chapter, setChapter] = useState(null)
    const dispatch = useDispatch()
    const [urlFile, setUrlFile] = useState(null)
    const [htmlCode, setHtmlCode] = useState(null)
    const [gitHubFile, setGitHubFile] = useState(null)
    const [fileExtension, setFileExtension] = useState(null)
    const youtubeID = 'W_HCgUeEN5c'


    const fetchFile = async (file) => {

        // -- If there is no https, then broswer prohibits to request
        // so if it doesn't, replace http:// with https://. --
        let url
        if (!file.includes('https://')) {
            url = (file.replace('http:', 'https:'))
        }
        else {
            url = (file)
        }
        setUrlFile(url)
        // console.log('----urlFile: ', url, 'file extension: ', url.split('.').pop())

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
    const fetchChapter = async (subjectId) => {
        await axios.get(process.env.REACT_APP_BASE_URL + `/api/chapter/${subjectId}`,
            {
                headers: {
                    "Content-type": "Application/Json",

                }
            }
        )
            .then(res => {
                console.log(res.data, res.data.html, res.data.category.title)
                // setHtml(res.data)
                fetchFile(res.data.html)
                console.log('------', res.data.category)
                setChapter(res.data)
            })
            .catch(err => console.log('error: ', err))

    }
    const fetchGithub = async (subjectId) => {
        const urlBase = 'https://raw.githubusercontent.com/'
        const url1 = 'mikekim-fullstack/JS-interview/blob/master/10-hex.js'
        // const url2 = 'https://raw.githubusercontent.com/mikekim-fullstack/HTML-CSS-reponsive-layout-single-page/main/index.html'
        //  'https://raw.githubusercontent.com/mikekim-fullstack/seytech-css-agency/master/firebase.js'
        const url3 = 'mikekim-fullstack/seytech-css-agency/blob/master/firebase.js'
        const url4 = 'mikekim-fullstack/seytech-css-agency/blob/master/index.html'
        const url = urlBase + url1.replace('/blob/', '/')

        console.log('-- url Github: ', url)
        await axios.get(url,
            {
                headers: {
                    "Content-type": "Application/Json",
                    // 'Access-Control-Allow-Origin': '*',
                }
            }
        )
            .then(res => {
                setGitHubFile(res.data)
                setFileExtension(url.split('.').pop().toLocaleLowerCase())
                // console.log('------github----', res.data)

            })
            .catch(err => console.log('error: ', err))

    }


    useEffect(() => {
        console.log('useEffect-------1')
        const _chapter = chapters?.filter((chapter) => {
            return chapter.id == course_id
        })
        console.log('useEffect', ', courses', course_id, _chapter)
        if (_chapter?.length > 0) {
            if (course_id > 0 && chapters) {
                console.log('chapters: ', _chapter[0].html)
                setChapter(_chapter[0])
                fetchFile(_chapter[0].html)
            }
        }
        if (!chapters) {
            fetchChapter(course_id)
            // console.log('--- data:', data)
        }

        fetchGithub()

    }, [chapters, course_id])

    return (

        <div className='course__screen'>
            CourseScreen {`${course_id}, ${chapter && chapter.category.title}}`}
            <h1>CourseScreen 1</h1>
            {/* {html && <div dangerouslySetInnerHTML={{ __html: html }} />} */}
            {/* <div dangerouslySetInnerHTML={{ __html: (urlLocal) }} /> */}
            {chapter && chapter.category.title == 'PDF' ?
                urlFile && <div>
                    <iframe className='iframe__view'
                        src={urlFile} title="description" style={{ width: '100%', height: '100vh', frameBorder: "0", border: '0' }}>
                    </iframe>
                    <br />
                    <h1 style={{ padding: '20px', fontSize: '1rem', lineHeight: '1rem' }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus harum voluptates illum adipisci nulla sint ullam enim at natus suscipit sequi odit nemo quia numquam mollitia rem, unde possimus doloribus autem dolorum. Magni magnam ratione commodi iure voluptates aliquam, ducimus rem animi, dolorum distinctio laudantium? Natus voluptatibus autem est dolorem harum odio et animi perspiciatis mollitia provident maxime, omnis aliquid voluptatum ducimus totam. Excepturi facilis quae expedita odio quo maiores consequuntur quibusdam esse culpa impedit nostrum voluptatem natus, quidem aperiam. Voluptatum sapiente earum blanditiis rem, minus nisi mollitia aut quibusdam et amet fugiat omnis impedit, dolor ipsam animi cupiditate. Nostrum!</h1>
                </div>
                :
                <div>

                    {htmlCode && <div dangerouslySetInnerHTML={{ __html: htmlCode }} />}
                    {/* <iframe className='iframe__view' src={urlFile} title="description">
                    </iframe> */}
                    <h2>Code Snippet</h2>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {fileExtension && <SyntaxHighlighter language={fileExtension} style={a11yDark} showLineNumbers="true"
                            customStyle={{ border: 'none', borderRadius: '0', boxShadow: 'none', width: '90%', padding: '20px 0px', height: '400px' }}
                            children={gitHubFile && gitHubFile}
                        />}
                        {/* <iframe type="text/html" style={{ margin: '0', width: '90%', frameBorder: '0' }} src="https://www.youtube.com/embed/W_HCgUeEN5c" allowFullScreen></iframe> */}
                        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${youtubeID}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                        {/* https://youtu.be/W_HCgUeEN5c */}
                    </div>

                    <h1>CourseScreen 2</h1>
                    <h1>CourseScreen 3</h1>
                    <h1>CourseScreen 4</h1>
                    <h1>CourseScreen 5</h1>
                    <h1>CourseScreen 5</h1>

                </div>
            }
            {/* <h1>------ Test Iframe -----</h1> */}
            {/* {urlFile && <iframe
                src={urlFile} title="description" style={{ width: '90%', height: '100vh' }}></iframe>} */}


        </div>

    )
}

export default CourseScreen
