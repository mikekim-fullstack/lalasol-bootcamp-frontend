import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './CourseScreen.css'
import { useSelector, useDispatch } from 'react-redux'
import { getChapters, setTest, setChapters } from '../slices/chapterSlice'
import { login } from '../slices/userSlices'
import axios from 'axios'



// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

const CourseScreen = () => {
    const { course_id } = useParams()
    const chapters = useSelector((state) => getChapters(state))
    const [chapter, setChapter] = useState(null)
    const dispatch = useDispatch()
    const [urlFile, setUrlFile] = useState(null)

    const handleIframeClick = (e) => {
        console.log('--handleIframeClick--')
    }

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
        console.log('----urlFile: ', url)

        // -- Go and get the html file from server. --
        /*
        await axios.get(url,
            {
                headers: {
                    "Content-type": "Application/Json",
                }
            }
        )
            .then(res => {
                // console.log(res.data)
                setHtml(res.data)
            })
        */
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



    }, [chapters, course_id])

    // useEffect(() => {

    //     // fetchAll()
    //     if (!chapters) {

    //         fetchChapter(course_id)

    //         // console.log('--- data:', data)
    //     }

    //     console.log('useEffect-------2')
    //     // fetchChapter()
    // }, [])

    return (

        <div className='course__screen'>
            CourseScreen {`${course_id}, ${chapter && chapter.category.title}}`}
            <h1>CourseScreen 1</h1>
            {/* {html && <div dangerouslySetInnerHTML={{ __html: html }} />} */}
            {/* <div dangerouslySetInnerHTML={{ __html: (urlLocal) }} /> */}
            {chapter && chapter.category.title == 'PDF' ?
                urlFile && <div>
                    <iframe className='iframe__view' onClick={handleIframeClick}
                        src={urlFile} title="description" style={{ width: '100%', height: '100vh', frameBorder: "0", border: '0' }}>
                    </iframe>
                    <br />
                    <h1 style={{ padding: '20px', fontSize: '1rem', lineHeight: '1rem' }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus harum voluptates illum adipisci nulla sint ullam enim at natus suscipit sequi odit nemo quia numquam mollitia rem, unde possimus doloribus autem dolorum. Magni magnam ratione commodi iure voluptates aliquam, ducimus rem animi, dolorum distinctio laudantium? Natus voluptatibus autem est dolorem harum odio et animi perspiciatis mollitia provident maxime, omnis aliquid voluptatum ducimus totam. Excepturi facilis quae expedita odio quo maiores consequuntur quibusdam esse culpa impedit nostrum voluptatem natus, quidem aperiam. Voluptatum sapiente earum blanditiis rem, minus nisi mollitia aut quibusdam et amet fugiat omnis impedit, dolor ipsam animi cupiditate. Nostrum!</h1>
                </div>
                :
                urlFile && <div>
                    <iframe className='iframe__view' onClick={handleIframeClick}
                        src={urlFile} title="description" style={{ width: '90%', height: '100vh', frameBorder: "0", border: '0' }}>
                        <h1>CourseScreen 2</h1>
                        <h1>CourseScreen 3</h1>
                        <h1>CourseScreen 4</h1>
                        <h1>CourseScreen 5</h1>
                        <h1>CourseScreen 5</h1>
                    </iframe>

                </div>
            }
            {/* <h1>------ Test Iframe -----</h1> */}
            {/* {urlFile && <iframe
                src={urlFile} title="description" style={{ width: '90%', height: '100vh' }}></iframe>} */}


        </div>

    )
}

export default CourseScreen
