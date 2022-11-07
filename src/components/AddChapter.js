import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getClickedChapter, setClickedChapter, getChapterCategory } from '../slices/chapterSlice'
import './AddChapter.css'
import EditChapter from './EditChapter'
const AddChapter = ({ catTitle, userId, catId, course, teacherId }) => {
    const dispatch = useDispatch()
    const clickedChapter = useSelector(getClickedChapter)
    const chapterCategory = useSelector(getChapterCategory)
    const [chapterLists, setChapterLists] = useState(null)
    const [createChapter, setCreateChapter] = useState(false)
    const [previousClickedChapter, setPreviousClickedChapter] = useState(null)
    const [previousClickedContent, setPreviousClickedContent] = useState(null)
    const [clickedContent, setClickedContent] = useState(null)

    const initSelectChapter = (_clickedChapter) => {
        console.log('init-clickCht:', _clickedChapter,)
        dispatch(setClickedChapter(_clickedChapter))

        const chapterListsEle = document.querySelector('.add_chapter__component .chapter_lists')

        if (chapterListsEle) {
            const shadowColor = '0px 0px 3px 2px rgba(0, 200,200 , 0.95)'
            chapterListsEle.style['box-shadow'] = shadowColor
            chapterListsEle.style['-webkit-box-shadow'] = shadowColor
            chapterListsEle.style['-moz-box-shadow'] = shadowColor
            setPreviousClickedChapter(chapterListsEle)
        }

        // console.log('init-clickCht:', clickedChapter, chapterListsEle?.style)
    }
    const fetchChapters = async () => {
        setCreateChapter(false)
        await axios.get(axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${userId}&course_id=${course.id}`)
            .then(res => {
                console.log('fetchChapters: ', res.data)
                const _sortedData = res.data
                if (res.data.length > 1) {
                    _sortedData.sort((a, b) => a.chapter_no > b.chapter_no ? 1 : a.chapter_no < b.chapter_no ? -1 : 0)
                }

                setChapterLists(_sortedData)
            })
            .catch(err => console.log('error: ', err))
    }

    const handleClickChapter = (e, chapterId) => {
        const clickCht = chapterLists.filter((chapter) => chapter.id == chapterId)
        // clickCht.length > 0 && selectChapter(clickCht[0])

        clickCht.length > 0 && dispatch(setClickedChapter(clickCht[0]))

        const chapterListsEle = document.querySelectorAll('.add_chapter__component .chapter_lists')
        let clickedEle = null
        for (let i = 0; i < chapterListsEle.length; i++) {
            if (chapterListsEle[i].contains(e.target)) {
                clickedEle = chapterListsEle[i]
                break
            }
        }
        if (previousClickedChapter) {
            previousClickedChapter.style['box-shadow'] = ''
            previousClickedChapter.style['-webkit-box-shadow'] = ''
            previousClickedChapter.style['-moz-box-shadow'] = ''

        }
        if (clickedEle) {
            const shadowColor = '0px 0px 3px 2px rgba(0, 200,200 , 0.95)'
            clickedEle.style['box-shadow'] = shadowColor
            clickedEle.style['-webkit-box-shadow'] = shadowColor
            clickedEle.style['-moz-box-shadow'] = shadowColor
            setPreviousClickedChapter(clickedEle)
        }
        //  
        setCreateChapter(false)
        console.log('clickCht:', clickCht, chapterId)
    }


    const handleClickContent = (e, content) => {//clickedChapter?.content

        // const clickCht = chapterLists.filter((chapter) => chapter.id == contentId)

        // clickCht.length > 0 && dispatch(setClickedChapter(clickCht[0]))

        const contentListsEle = document.querySelectorAll('.add_chapter__component .content_lists_item')
        let clickedEle = null
        for (let i = 0; i < contentListsEle.length; i++) {
            if (contentListsEle[i].contains(e.target)) {
                clickedEle = contentListsEle[i]
                break
            }
        }
        if (previousClickedContent) {
            previousClickedContent.style['box-shadow'] = ''
            previousClickedContent.style['-webkit-box-shadow'] = ''
            previousClickedContent.style['-moz-box-shadow'] = ''

        }
        if (clickedEle) {
            const shadowColor = '0px 0px 3px 2px rgba(0, 200,200 , 0.95)'
            clickedEle.style['box-shadow'] = shadowColor
            clickedEle.style['-webkit-box-shadow'] = shadowColor
            clickedEle.style['-moz-box-shadow'] = shadowColor
            setPreviousClickedContent(clickedEle)
        }
        //  
        // setCreateChapter(false)
        setClickedContent(content)
        console.log('clickContent:', content)
    }





    const handleCreateChapter = (e) => {
        console.log('handleCreateChapter', chapterLists?.length)
        if (previousClickedChapter) {
            previousClickedChapter.style['box-shadow'] = ''
            previousClickedChapter.style['-webkit-box-shadow'] = ''
            previousClickedChapter.style['-moz-box-shadow'] = ''

        }
        setCreateChapter(true)
        setPreviousClickedChapter(null)
    }

    useEffect(() => {
        setClickedChapter(null)

        fetchChapters()

        console.log('AddChapter-useEffect: fetchChapters', ', course_id:', course.id)
    }, [course.id])

    useEffect(() => {
        setClickedChapter(null)
        chapterLists?.length > 0 && initSelectChapter(chapterLists[0])
        // chapterLists?.length > 0 && console.log('useEffect- chapterLists: ', chapterLists, chapterLists[0])
    }, [chapterLists])


    console.log('chapterID', clickedChapter?.id, chapterCategory.filter(cat => cat.id == 1)[0].title)


    return (
        <div className='add_chapter__component'>
            {/* --------------------- 1. Lists of Chapters-------------------------- */}
            <div className='chapter_list_view'>
                <h3><span>{course.title}:</span> Chapters</h3>
                {chapterLists && chapterLists.map((chapter) => {
                    return <div key={chapter.id} className='chapter_lists' onClick={e => handleClickChapter(e, chapter.id)}>
                        {chapter.title}
                    </div>
                })}
                <div className='btn' onClick={handleCreateChapter} >Create Chapter</div>

            </div>
            {/* ---------------------- 2. Details of Chapter------------------------- */}
            <div className='chapter_detail'>
                {/* {console.log('createChapter: ', createChapter)} */}
                {(chapterLists?.length > 0 || createChapter) && < EditChapter createChapter={createChapter} />}
            </div>

            {/* ---------------------- 3. Lists of Content of Chapter ------------------------- */}
            <div className='content_lists'>
                <h3>Content lists</h3>
                <div className='content_lists_body'>
                    {/* {console.log('content_lists_body: ', clickedChapter)} */}
                    {!createChapter && clickedChapter?.content?.length > 0 ? clickedChapter.content.map((content, index) => (
                        <div className='content_lists_item' key={content.id} onClick={e => handleClickContent(e, content)}>
                            {index + 1}/{clickedChapter.content.length}. {chapterCategory.filter((cat) => cat.id == content.chapter_category)[0].title}
                        </div>
                    ))
                        : <div></div>
                    }
                </div>
            </div>
            {/* ---------------------- 4. Detail of Content of Chapter ------------------------- */}
            <div className='content_detail'>
                <h3>Content details</h3>
                <div>{clickedContent?.id}</div>
            </div>
        </div>
    )
}

export default AddChapter