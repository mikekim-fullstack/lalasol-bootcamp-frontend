import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {
    getClickedChapter, setClickedChapter, setClickedContent,
    getClickedContent, getChapterCategory, resetContentAction,
    getContentAction, getContentActionById, deleteContentAction,
    createContentAction, updateContentActionById, setContentAction
} from '../slices/chapterSlice'
import './AddChapter.css'
import EditChapter from './EditChapter'
import { ContentCutTwoTone } from '@mui/icons-material'
import PreviewContent from './PreviewContent'
const AddChapter = ({ catTitle, userId, catId, course, teacherId }) => {

    const dispatch = useDispatch()
    const clickedChapter = useSelector(getClickedChapter)
    const chapterCategory = useSelector(getChapterCategory)
    const contentAction = useSelector(getContentAction)

    const [chapterLists, setChapterLists] = useState(null)
    const [createChapter, setCreateChapter] = useState(false)
    const [previousClickedChapter, setPreviousClickedChapter] = useState(null)
    const [previousClickedContent, setPreviousClickedContent] = useState(null)
    const [inputContent, setInputContent] = useState({ file: null, ulr: null, text: null })


    const contentFileRef = useRef(null)
    const contentLinkRef = useRef(null)
    const selectionRef = useRef(null)
    const titleRef = useRef(null)
    const imageRef = useRef(null)
    const paragraphRef = useRef(null)
    const codeRef = useRef(null)

    const [contentChoice, setContentChoice] = useState(null)
    const clickedContent = useSelector(getClickedContent)

    /**
     * Remove hash tag in file path
     */
    const getFileName = (filePath) => {
        console.log('getFileName - filePath', filePath)
        if (filePath && filePath.includes('/')) {
            const onlyFileName = filePath?.split('/').pop()
            return onlyFileName?.replace(/_.*\./, ".")
        }
        return ''
    }
    const initSelectContent = (_clickedContent) => {

        // dispatch(setClickedContent(_clickedContent))
        console.log('>>>>----initSelectContent: ', _clickedContent)
        /**
                 * Show filename in input file
                 */
        // const inputFileLabel = document.getElementById('fileinput_label')
        // console.log('inputFileLabel: ', inputFileLabel)
        // if (inputFileLabel && _clickedContent?.file) inputFileLabel.innerHTML = _clickedContent.file.split('/').pop()


        const contentListsEle = document.querySelector('.add_chapter__component .content_lists_item')
        console.log('contentListsEle: ', contentListsEle)
        if (contentListsEle) {
            console.log(' --- contentListsEle: ---')
            const shadowColor = '0px 0px 3px 2px rgba(0, 200,200 , 0.95)'
            contentListsEle.style['box-shadow'] = shadowColor
            contentListsEle.style['-webkit-box-shadow'] = shadowColor
            contentListsEle.style['-moz-box-shadow'] = shadowColor
            setPreviousClickedContent(contentListsEle)
        }
        dispatch(setClickedContent(_clickedContent))
        /**
         * selectionRef.current.value is for initial value of select tag
         */
        if (selectionRef?.current) selectionRef.current.value = _clickedContent.chapter_category
        // console.log('init-click Content:', _clickedContent, ', choice: ', chapterCategory?.filter((chCat) => chCat.id == _clickedContent.chapter_category)[0].title)
        setContentChoice(chapterCategory?.filter((chCat) => chCat.id == _clickedContent.chapter_category)[0])

    }

    const initSelectChapter = (_clickedChapter) => {
        console.log('init-click Chapter:', _clickedChapter, ', clickedContent:', clickedContent)
        dispatch(setClickedChapter(_clickedChapter))

        const chapterListsEle = document.querySelector('.add_chapter__component .chapter_lists')

        if (chapterListsEle) {
            const shadowColor = '0px 0px 3px 2px rgba(0, 200,200 , 0.95)'
            chapterListsEle.style['box-shadow'] = shadowColor
            chapterListsEle.style['-webkit-box-shadow'] = shadowColor
            chapterListsEle.style['-moz-box-shadow'] = shadowColor
            setPreviousClickedChapter(chapterListsEle)
        }

    }

    const fetchChapters = async () => {
        setCreateChapter(false)
        await axios.get(axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${userId}&course_id=${course?.id}`)
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
    const handleSubmitForm = (e) => {
        e.preventDefault()
        console.log('handleSubmitForm - ', e.target.innerText.toLowerCase(), ', contentFileRef: ', contentFileRef.current.files)
        if (e.target.innerText.toLowerCase() == 'update') {


        }
        else if (e.target.innerText.toLowerCase() == 'create') {

        }
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

        /**
         * Show filename in input file
         */
        const urlFilter = chapterCategory?.filter((chCat) => chCat.id == content.chapter_category)
        const linkInput = document.querySelector('input_url')
        if (urlFilter && urlFilter[0]?.title.includes('Link')) {

            console.log('-----clickContent:', content, urlFilter, ', linkInput', linkInput)
            if (linkInput) {
                linkInput.innerHTML = content.url
                linkInput.style.display = 'unset'
            }
        }
        // else {
        //     linkInput.innerHTML = ''
        //     linkInput.style.display = 'none'
        // }


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

        dispatch(setClickedContent(content))
        /**
         * selectionRef.current.value is for initial value of select tag
         */
        if (selectionRef?.current) selectionRef.current.value = content.chapter_category

        setContentChoice(chapterCategory?.filter((chCat) => chCat.id == content.chapter_category)[0])
        setInputContent({
            url: content.url,
            file: content.file,
            text: content.text,
            title: content.title,
            image: content.image,
            code: content.code,
        })



        // const inputFileLabel = document.getElementById('fileinput_label')
        // if (inputFileLabel) inputFileLabel.innerHTML = content.file.split('/').pop()

        // dispatch(deleteContentAction(6)) // for test
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


    const handleOnChangeInput = (e, type) => {

        if (type == 'file') {
            // console.log('input file: ', e, e.target.nextSibling, e.target.files[0])
            setInputContent({ ...inputContent, [e.target.name]: e.target.files[0] })
            e.target.nextSibling.innerHTML = e.target.files[0].name
            dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent.id, type: 'file', data: e.target.files[0] }))
        }
        else if (type == 'image') {
            console.log('input Image file: ', e, e.target.nextSibling, e.target.files[0])
            setInputContent({ ...inputContent, [e.target.name]: e.target.files[0] })
            dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent.id, type: 'image', data: e.target.files[0] }))
            e.target.nextSibling.innerHTML = e.target.files[0].name
        }
        else if (type == 'url') {
            setInputContent({ ...inputContent, [e.target.name]: e.target.value })
            dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent.id, type: 'url', data: e.target.value }))
        }
        else if (type == 'title') {
            // console.log('e.target.name-title: ', e.target.name, e.target.value)
            setInputContent({ ...inputContent, [e.target.name]: e.target.value })
            dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent.id, type: 'title', data: e.target.value }))
        }
        else if (type == 'text') {
            setInputContent({ ...inputContent, [e.target.name]: e.target.value })
            dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent.id, type: 'text', data: e.target.value }))
        }
    }
    /**
     * -------------------------------------------------------------------------------------
     */
    useEffect(() => {
        setClickedChapter(null)

        fetchChapters()

        console.log('useEffect - 1. AddChapter->fetchChapters', ', course_id:', course?.id)
    }, [course?.id])

    useEffect(() => {
        setClickedChapter(null)
        dispatch(setContentAction([]))
        chapterLists?.length > 0 && initSelectChapter(chapterLists[0])
        // chapterLists?.length > 0 && console.log('useEffect- chapterLists: ', chapterLists, chapterLists[0])
        console.log('useEffect - 2. AddChapter->chapterLists: setClickedChapter')
    }, [chapterLists])

    /** -- When clicked on the chapter trigger this useEffect.-- */
    useEffect(() => {
        console.log('useEffect - 3. AddChapter->clickedChapter: ', clickedChapter, ', clickedContent: ', clickedContent, ' end')

        if (!createChapter && clickedChapter?.content?.length > 0) {

            // test to delete item in contentAction
            // dispatch(deleteContentAction(8))
            // dispatch(createContentAction({ catId: 1, createrId: 1, type: 'file', data: 'a.html', }))
            // dispatch(updateContentActionById({ catId: 1, id: 16, type: 'url', data: 'https:www.youtube.com' }))

            /** --2. Initialize Content with first one.-- */
            contentAction.length > 0 && initSelectContent(contentAction[0])
        }

    }, [clickedChapter])
    useEffect(() => {
        // document.cookie = "CookieName=Cheecker; path =/; HttpOnly; samesite=None; Secure;"
        if (contentChoice?.title.includes('Break Line')) {
            console.log('useEffect --- contentChoice.title')
            dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent.id, type: 'text', data: '' }))
        }
    }, [contentChoice?.title])

    useEffect(() => {
        console.log('useEffect --- contentAction.action updated')
    }, [contentAction?.action])

    useEffect(() => {
        const tmp = contentLinkRef?.current
        if (tmp) {
            // tmp.files[0].name = 'a'
        }
        console.log('useEffect - contentLinkRef:', tmp, tmp?.url)
        // contentFileRef && contentFileRef.current.files[0].name
    }, [contentLinkRef?.current])

    console.log('contentAction', contentAction)
    // --------------------------------------------------
    const genContentDetailEle = (contentId) => {
        if (contentChoice?.title?.includes('PDF File'))
            return <div>
                <input ref={contentFileRef} type='file' accept="application/pdf" name='file' onChange={e => handleOnChangeInput(e, 'file')} />
                <label className='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
            </div>

        if (contentChoice?.title?.includes('HTML File'))
            return <div>
                <input ref={contentFileRef} type='file' accept=".html" name='file' onChange={e => handleOnChangeInput(e, 'file')} />
                <label id='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
            </div>
        if (contentChoice?.title?.includes('Image File')) {
            const sel = contentAction.filter(content => content.id == contentId)[0]
            console.log('clickedContent.Image File: ', inputContent?.image?.name, contentAction, sel, clickedContent)
            return <div>
                <input ref={contentFileRef} type='file' accept="image/*" name='image' onChange={e => handleOnChangeInput(e, 'image')} />
                <label id='fileinput_label'>{sel && sel?.action == 'updated' ? (inputContent?.image?.name) : getFileName(inputContent?.image) || 'Choose File'}</label>
            </div>
        }
        if (contentChoice.title.includes('Link'))
            return <input className='input_url' ref={contentLinkRef} name='url' type='text' value={inputContent.url} onChange={e => handleOnChangeInput(e, 'url')} />

        if (contentChoice.title.includes('Title')) {

            return <input className='input_title' ref={titleRef} name='title' type='text' value={inputContent.title} onChange={e => handleOnChangeInput(e, 'title')} />
        } if (contentChoice.title.includes('Paragraph'))
            // console.log('clickedContent.text: ', clickedContent.text)
            return <textarea className='input_paragraph' rows={7} ref={paragraphRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInput(e, 'text')} />

        if (contentChoice.title.includes('Code'))
            return <textarea className='input_code' rows='7' ref={codeRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInput(e, 'text')} />

        if (contentChoice.title.includes('Note'))
            return <textarea className='input_note' rows='7' ref={codeRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInput(e, 'text')} />

        if (contentChoice.title.includes('Break Line')) {
            // return <input className='input_break' ref={codeRef} name='text' type='text' value={'<br/>'} onChange={e => handleOnChangeInput(e, 'text')} />
            // setInputContent({ ...inputContent, ['break']: 1 })

            return <label >Break Line</label>
        }
    }
    // --------------------------------------------------
    // dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent.id, type: 'text', data: '' }))
    // setContentChoice(chapterCategory?.filter((chCat) => chCat.id == e.target.value)[0])

    return (
        <div className='add_chapter__view'>
            <div className='add_chapter__component'>
                {/* --------------------- 1. Lists of Chapters-------------------------- */}
                <div className='chapter_list_view'>
                    <h3><span>{course?.title}:</span> Chapters</h3>
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
                    {(chapterLists?.length > 0 || createChapter) && < EditChapter createChapter={createChapter} handleSubmitForm={handleSubmitForm} />}
                </div>

                {/* ---------------------- 3. Lists of Content of Chapter ------------------------- */}
                <div className='content_lists'>
                    <h3>Content lists</h3>
                    <div className='content_lists_body'>
                        {/* {console.log('content_lists_body: ', contentAction)} */}
                        {!createChapter && contentAction?.length > 0 ? contentAction?.map((content, index) => {
                            if (content.action != 'deleted') {

                                return <div className='content_lists_item' key={content.id} onClick={e => handleClickContent(e, content)}>
                                    {index + 1}/{contentAction.length}. {chapterCategory.filter((cat) => cat.id == content.chapter_category)[0].title}
                                </div>
                            }
                        }
                        )
                            : <div></div>
                        }
                    </div>
                </div>
                {/* ---------------------- 4. Detail of Content of Chapter ------------------------- */}
                <div className='content_detail'>
                    <h3>Content details</h3>
                    <div>{clickedContent?.id}</div>
                    {/* --------------- */}
                    {clickedContent && <div className="select-container">
                        {/* {console.log('val=', chapterCategory?.filter((chCat) => chCat.id == clickedContent?.chapter_category), clickedContent?.id, contentChoice)} */}
                        {/* <select onChange={e => console.log('e.target: ', e.target.value)} value={chapterCategory?.filter((chCat) => chCat.id == clickedContent?.chapter_category)[0].id}> */}
                        <select ref={selectionRef} value={contentChoice ? contentChoice.id : 0} onChange={e => setContentChoice(chapterCategory?.filter((chCat) => chCat.id == e.target.value)[0])}  >
                            {chapterCategory.map((chapterCat) => (
                                <option key={chapterCat.id} value={chapterCat.id} name={chapterCat.title}>{chapterCat.title}</option>
                            ))}
                        </select>
                    </div>}
                    {/* {console.log('getContentActionById: ', useSelector(state => getContentActionById(state, 6)))} */}
                    {/* <input ref={contentFileRef} type='file' /> */}
                    {contentChoice && console.log('contentChoice: ', contentChoice, inputContent)}
                    {contentChoice && genContentDetailEle(clickedContent?.id)}
                    {/* {contentChoice && contentChoice.title.includes('PDF File') && <div><input ref={contentFileRef} type='file' accept="application/pdf" name='file' onChange={e => handleOnChangeInput(e, 'file')} /><label className='fileinput_label'>Choose file</label></div>}
                    {contentChoice && contentChoice.title.includes('HTML File') &&
                        <div><input ref={contentFileRef} type='file' accept=".html" name='file' onChange={e => handleOnChangeInput(e, 'file')} />
                            <label id='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
                        </div>}
                    {contentChoice && contentChoice.title.includes('Image File') &&
                        <div><input ref={contentFileRef} type='file' accept="image/*" name='file' onChange={e => handleOnChangeInput(e, 'file')} />
                            <label id='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
                        </div>}
                    {contentChoice && contentChoice.title.includes('Link') && <input className='input_url' ref={contentLinkRef} type='text' defaultValue={clickedContent.url} onChange={e => handleOnChangeInput(e, 'url')} />} */}
                    {/* {contentChoice && contentChoice.title.includes('Link') && <input className='input_url' ref={contentLinkRef} type='text' defaultValue={clickedContent.url} value={inputContent.url} onChange={e => handleOnChangeInput(e, 'url')} />} */}
                    {/* <input className='input_url' style={{ display: 'unset' }} ref={contentLinkRef} type='text' value={inputContent.url} name='url' onChange={e => handleOnChangeInput(e, 'text')} /> */}


                </div>

            </div >
            {/* -------Preview-------- */}
            {clickedContent?.id && <PreviewContent contentAction={contentAction} clickedContentId={clickedContent?.id} />}
        </div>
    )
}

export default AddChapter