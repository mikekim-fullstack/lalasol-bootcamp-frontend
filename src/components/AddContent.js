import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getClickedCourse, setClickedCourse } from '../slices/courseSlice'
import {
    getClickedChapter, setClickedChapter, setClickedContent,
    getClickedContent, getChapterCategory, resetContentAction,
    getContentAction, getContentActionById, deleteContentAction,
    createContentAction, updateContentActionById, setContentAction,
    deleteContentAddAction, setChapterUpdatedStatus,
} from '../slices/chapterSlice'
import './AddContent.css'
import PreviewContent from './PreviewContent'

const AddContent = ({ funcSetCreateMode, teacherId }) => {
    const dispatch = useDispatch()
    const clickedChapter = useSelector(getClickedChapter)
    const chapterCategory = useSelector(getChapterCategory)
    const contentAction = useSelector(getContentAction)
    const clickedContent = useSelector(getClickedContent)
    const clickedCourseInfo = useSelector(getClickedCourse)


    const [contentChoice, setContentChoice] = useState(null)
    const [inputContent, setInputContent] = useState({ file: null, ulr: null, text: null })
    const [previousClickedContent, setPreviousClickedContent] = useState(null)
    const [isBreakLine, setIsBreakLine] = useState(false)

    /** 
    * -- 
    * 1. operateContent: show on and off for + and - sign 
    * 2. clickedAddContent: When add(+sign) clicked set it to true
    * 3. clickedUpdateContent: When update(pen sign) clicked set it to true
    *  */
    const [clickedAddContent, setClickedAddContent] = useState(false)
    const [clickedUpdateContent, setClickedUpdateContent] = useState(false)
    const [operateContent, setOperateContent] = useState(true)


    const contentFileRef = useRef(null)
    const contentLinkRef = useRef(null)
    const selectionRef = useRef(null)
    const titleRef = useRef(null)
    const imageRef = useRef(null)
    const paragraphRef = useRef(null)
    const codeRef = useRef(null)



    // ----------------------------------------------------
    const handleDeleteContent = (e) => {

    }
    const handleUpdateContent = (e) => {

    }
    const handleAddContent = (e) => {
        setInputContent({ file: null, ulr: null, text: null })
        setContentChoice(null)
        setOperateContent(false)
        setClickedAddContent(true)
        funcSetCreateMode(true)
    }
    const handleClickCloseContent = (e) => {
        console.log('handleClickCloseContent: ', contentAction)
        /** reset inputContent */
        setInputContent({ file: null, ulr: null, text: null })
        /** delete any created acation */
        dispatch(deleteContentAddAction())
        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)
        funcSetCreateMode(false)
    }

    /**
      * Remove hash tag(xxxx) in file path between _xxxx by regular expression /_.*\./.
      */
    const getFileName = (filePath) => {
        console.log('getFileName - filePath', filePath)
        if (filePath && filePath.includes('/')) {
            const onlyFileName = filePath?.split('/').pop()
            return onlyFileName?.replace(/_.*\./, ".")
        }
        return ''
    }
    const handleOnChangeInputAdd = (e, type) => {
        setInputContent({ file: null, ulr: null, text: null })

        if (type == 'file') {
            // console.log('input file: ', e, e.target.nextSibling, e.target.files[0])
            setInputContent({ ...inputContent, [e.target.name]: e.target.files[0] })
            e.target.nextSibling.innerHTML = e.target.files[0].name
            dispatch(createContentAction({ catId: contentChoice.id, type: 'file', data: e.target.files[0], creater: teacherId }))
        }
        else if (type == 'image') {
            console.log('input Image file: ', e, e.target.nextSibling, e.target.files[0])
            setInputContent({ ...inputContent, [e.target.name]: e.target.files[0] })
            dispatch(createContentAction({ catId: contentChoice.id, type: 'image', data: e.target.files[0], creater: teacherId }))
            e.target.nextSibling.innerHTML = e.target.files[0].name
        }
        else if (type == 'url') {
            setInputContent({ ...inputContent, [e.target.name]: e.target.value })
            dispatch(createContentAction({ catId: contentChoice.id, type: 'url', data: e.target.value, creater: teacherId }))
        }
        else if (type == 'title') {
            // console.log('e.target.name-title: ', e.target.name, e.target.value)
            setInputContent({ ...inputContent, [e.target.name]: e.target.value })
            dispatch(createContentAction({ catId: contentChoice.id, type: 'title', data: e.target.value, creater: teacherId }))
        }
        else if (type == 'text') {
            setInputContent({ ...inputContent, [e.target.name]: e.target.value })
            dispatch(createContentAction({ catId: contentChoice.id, type: 'text', data: e.target.value, creater: teacherId }))
        }
        else if (type == 'content_name') {
            setInputContent({ ...inputContent, [e.target.name]: e.target.value, creater: teacherId })
        }
        // else if (type == 'break_line') {
        //     setInputContent({ ...inputContent, 'text': null, creater: teacherId })
        //     dispatch(createContentAction({ catId: contentChoice.id, type: 'text', data: null }))
        // }
    }
    const handleOnChangeInput = (e, type) => {
        // setInputContent({ file: null, ulr: null, text: null })
        setInputContent({ ...inputContent, 'text': null, creater: teacherId })
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
    // --------------------------------------------------
    const genContentDetailEleAdd = () => {
        console.log('genContentDetailEleAdd: ', contentChoice, contentAction)
        if (contentChoice.title.includes('Break Line')) {
            // return <input className='input_break' ref={codeRef} name='text' type='text' value={'<br/>'} onChange={e => handleOnChangeInputAdd(e, 'text')} />
            // setInputContent({})
            // dispatch(createContentAction({ catId: contentChoice.id, type: 'text', data: null }))
            // return <input className='break_line' value={'<hr>'} onFocus={e => handleOnChangeInputAdd(e, 'text')} />
            // return handleOnChangeInputAdd(null, 'break_line')
            // setIsBreakLine(true)
            return
        }
        // setIsBreakLine(false)
        if (contentChoice?.title?.includes('PDF File'))
            return <div className='element_input'>
                <input required ref={contentFileRef} type='file' accept="application/pdf" name='file' onChange={e => handleOnChangeInputAdd(e, 'file')} />
                <label className='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
            </div>

        if (contentChoice?.title?.includes('HTML File'))
            return <div className='element_input'>
                <input required ref={contentFileRef} type='file' accept=".html" name='file' onChange={e => handleOnChangeInputAdd(e, 'file')} />
                <label id='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
            </div>
        if (contentChoice?.title?.includes('Image File')) {
            const sel = null;
            // const sel = contentAction.filter(content => content.id == contentId)[0]
            console.log('clickedContent.Image File: ', inputContent?.image?.name, contentAction, sel, clickedContent)
            return <div className='element_input'>
                <input required ref={contentFileRef} type='file' accept="image/*" name='image' onChange={e => handleOnChangeInputAdd(e, 'image')} />
                <label id='fileinput_label'>{(inputContent?.image?.name) ? (inputContent?.image?.name) : 'Choose File'}</label>
            </div>
        }
        if (contentChoice.title.includes('Link'))
            return <div className='element_input'>
                <input className='input_url' ref={contentLinkRef} required name='url' type='text' value={inputContent.url} onChange={e => handleOnChangeInputAdd(e, 'url')} />
            </div>

        if (contentChoice.title.includes('Title')) {

            return <div className='element_input'>
                <input required className='input_title' ref={titleRef} name='title' type='text' value={inputContent.title} onChange={e => handleOnChangeInputAdd(e, 'title')} />
            </div>
        }
        if (contentChoice.title.includes('Paragraph'))
            // console.log('clickedContent.text: ', clickedContent.text)
            return <div className='element_input'>
                <textarea required className='input_paragraph' rows={7} ref={paragraphRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInputAdd(e, 'text')} />
            </div>

        if (contentChoice.title.includes('Code'))
            return <div className='element_input'>
                <textarea required className='input_code' rows='7' ref={codeRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInputAdd(e, 'text')} />
            </div>

        if (contentChoice.title.includes('Note'))
            return <div className='element_input'>
                <textarea required className='input_note' rows='7' ref={codeRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInputAdd(e, 'text')} />
            </div>


    }
    // --------------------------------------------------
    const genContentDetailEle = (contentId) => {
        if (contentChoice?.title?.includes('PDF File'))
            return <div className='element_input'>
                <input required ref={contentFileRef} type='file' accept="application/pdf" name='file' onChange={e => handleOnChangeInput(e, 'file')} />
                <label className='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
            </div>

        if (contentChoice?.title?.includes('HTML File'))
            return <div className='element_input'>
                <input required ref={contentFileRef} type='file' accept=".html" name='file' onChange={e => handleOnChangeInput(e, 'file')} />
                <label id='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
            </div>
        if (contentChoice?.title?.includes('Image File')) {
            const sel = contentAction.filter(content => content.id == contentId)[0]
            console.log('clickedContent.Image File: ', inputContent?.image?.name, contentAction, sel, clickedContent)
            return <div className='element_input'>
                <input required ref={contentFileRef} type='file' accept="image/*" name='image' onChange={e => handleOnChangeInput(e, 'image')} />
                <label id='fileinput_label'>{sel && sel?.action == 'updated' ? (inputContent?.image?.name) : getFileName(inputContent?.image) || 'Choose File'}</label>
            </div>
        }
        if (contentChoice.title.includes('Link'))
            return <div className='element_input'>
                <input className='input_url' ref={contentLinkRef} required name='url' type='text' value={inputContent.url} onChange={e => handleOnChangeInput(e, 'url')} />
            </div>

        if (contentChoice.title.includes('Title')) {

            return <div className='element_input'>
                <input required className='input_title' ref={titleRef} name='title' type='text' value={inputContent.title} onChange={e => handleOnChangeInput(e, 'title')} />
            </div>
        } if (contentChoice.title.includes('Paragraph'))
            // console.log('clickedContent.text: ', clickedContent.text)
            return <div className='element_input'>
                <textarea required className='input_paragraph' rows={7} ref={paragraphRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInput(e, 'text')} />
            </div>

        if (contentChoice.title.includes('Code'))
            return <div className='element_input'>
                <textarea required className='input_code' rows='7' ref={codeRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInput(e, 'text')} />
            </div>

        if (contentChoice.title.includes('Note'))
            return <div className='element_input'>
                <textarea required className='input_note' rows='7' ref={codeRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInput(e, 'text')} />
            </div>

        if (contentChoice.title.includes('Break Line')) {

            console.log('Break Line-inputContent', inputContent)
            // return <input className='input_break' ref={codeRef} name='text' type='text' value={'<br/>'} onChange={e => handleOnChangeInput(e, 'text')} />
            // setInputContent({ ...inputContent })
            // setInputContent({ ...inputContent, [e.target.name]: e.target.value })

            // dispatch(createContentAction({ catId: contentChoice.id, type: 'text', data: null }))

            return <label ></label>
        }
    }

    const handleClickContent = (e, content) => {//clickedChapter?.content
        console.log('handleClickContent: ', content)
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
        console.log('chapterCategory?.filter((chCat) => chCat.id == content.chapter_category)[0]: ', chapterCategory?.filter((chCat) => chCat.id == content.chapter_category)[0])
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
    const onSubmitAddContentForm = (e) => {
        e.preventDefault()


        funcSetCreateMode(false)

        /** reset inputContent */
        setInputContent({ file: null, ulr: null, text: null })
        /** delete any created acation */
        dispatch(deleteContentAddAction())
        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)
        funcSetCreateMode(false)


        let formData = new FormData()
        formData.append('title', e.target[0].value)
        formData.append('chapter_category', Number(contentChoice.id))
        formData.append('creater', Number(teacherId))
        const _contentAction = contentAction.filter((item) => item.action == 'created')
        if (_contentAction.length == 1) {
            console.log('contentAction.image: ', _contentAction[0].image)
            _contentAction[0].file && formData.append('file', _contentAction[0].file)
            _contentAction[0].url && formData.append('url', _contentAction[0].url)
            _contentAction[0].text && formData.append('text', _contentAction[0].text)
            _contentAction[0].image && formData.append('img', _contentAction[0].image)
        }
        console.log('+++===> onSubmitAddContentFor: - contentChoice:', contentChoice,
            ', e.target.name: ', e.target[0].name, e.target[0].value, e.target[1].name, e.target[1].value,
            'contentAction: ', contentAction, ', formData', formData
        )
        // return
        // Object.entries(inputData).forEach((input, index) => formData.append(input[0], input[1]))

        axios({
            method: 'POST',
            url: axios.defaults.baseURL + '/api/chapter-content/',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                console.log('Success - End point-/api/chapter-content/', res.data)
                const formData = new FormData()
                formData.append('chapter_id', clickedChapter?.id)
                formData.append('content_id', res.data.id)
                axios({
                    method: 'PUT',
                    url: axios.defaults.baseURL + '/api/chapter-content-add/',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: formData
                })
                    .then(res => {
                        console.log('Success-End point-/api/chapter-content-add/', res.data)
                        /** For rerendering to update */
                        // dispatch(setClickedChapter(null))
                        dispatch(setChapterUpdatedStatus())
                    })
                    .catch(err => console.log('Error-End point-/api/chapter-content-add/', err))
            })
            .catch(err => console.log('Error - End point-/api/chapter-content/', err))

    }

    /** When refresh window it automatically selects the first content */
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
    /** -- When clicked on the chapter it triggers useEffect [clickedChapter].-- */
    useEffect(() => {
        dispatch(setClickedContent(null))

        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)

        console.log('useEffect - 3. AddChapter->clickedChapter: ', clickedChapter, ', clickedContent: ', clickedContent, ' end')

        if (clickedChapter?.content?.length > 0) {

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

    }, [contentChoice?.title, operateContent,])// contentAction])

    console.log('<<<< refesth from AddContent-clickedContent: ', clickedContent)

    useEffect(() => {
        if (contentChoice?.title.includes('Break Line')) {
            console.log('useEffect --- contentChoice: ', contentChoice, ', clickedContent', clickedContent)
            dispatch(createContentAction({ catId: contentChoice.id, type: 'text', data: null }))
        }
        console.log('useEffect AddContent-clickedContent: ', clickedContent)
    }, [isBreakLine])
    return (
        <div className='chapter_content__view'>
            {/* -- Display Content Header Bar. --- */}
            <div className='title'>
                <div><span className='t1'>Manage Content</span> On <span className='t2'>{clickedChapter?.name}</span> Chapter</div>
                <div className='svg_icon'>
                    {/* -- delete sign -- */}
                    {contentAction?.length > 0 && operateContent && <svg onClick={e => handleDeleteContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.3 20.5q-.75 0-1.275-.525Q5.5 19.45 5.5 18.7V6h-1V4.5H9v-.875h6V4.5h4.5V6h-1v12.7q0 .75-.525 1.275-.525.525-1.275.525ZM17 6H7v12.7q0 .125.088.213.087.087.212.087h9.4q.1 0 .2-.1t.1-.2ZM9.4 17h1.5V8H9.4Zm3.7 0h1.5V8h-1.5ZM7 6V19v-.3Z" /></svg>}
                    {/* -- edit sign -- */}
                    {contentAction?.length > 0 && operateContent && <svg onClick={e => handleUpdateContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.15 19H6.4l9.25-9.25-1.225-1.25-9.275 9.275Zm13.7-10.35L15.475 5.3l1.3-1.3q.45-.425 1.088-.425.637 0 1.062.425l1.225 1.225q.425.45.45 1.062.025.613-.425 1.038Zm-1.075 1.1L7.025 20.5H3.65v-3.375L14.4 6.375Zm-2.75-.625-.6-.625 1.225 1.25Z" /></svg>}
                    {/*-- add expend + sign --*/}
                    {operateContent && <svg onClick={e => handleAddContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M10.85 19.15v-6h-6v-2.3h6v-6h2.3v6h6v2.3h-6v6Z" /></svg>}
                    {/* close add - sign */}
                    {!operateContent && <svg onClick={e => handleClickCloseContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.25 12.75v-1.5h13.5v1.5Z" /></svg>}
                </div>
            </div>
            {/* -- When the Add Chapter + sign pressed.-- */}
            {clickedAddContent &&
                <form className='add_content_form' onSubmit={onSubmitAddContentForm}>
                    <div className='input_content_name'>
                        <label>Content Name</label>
                        {/* {console.log('inputContent: ', inputContent)} */}
                        <input type='text' name='content_name' value={inputContent.content_name} onChange={e => handleOnChangeInputAdd(e, 'content_name')} required placeholder='Enter Content Name*' />
                    </div>
                    <div className='chapter_categories'>
                        <label className='descpriton'>Select Content Element</label>
                        <div className='chapter_categories_content'>

                            {chapterCategory.map(chapterCat => (<div key={chapterCat.id} className='item' onClick={e => setContentChoice(chapterCategory?.filter((chCat) => chCat.id == chapterCat.id)[0])} >{chapterCat.title}</div>))
                            }
                        </div>
                    </div>
                    <div className='content_element'>
                        {contentChoice && <div className='choice'>{contentChoice?.title}</div>}
                        {contentChoice && genContentDetailEleAdd()}
                    </div>
                    {<button disabled={contentChoice ? false : true} type='submit'>Add Content</button>}
                </form>

            }
            {/* ---------------------- 4. Detail of Content of Chapter ------------------------- */}
            {!clickedAddContent &&
                <div className='content_lists'>

                    <div className='content_lists_body'>
                        {console.log('content_lists_body: ', contentAction)}
                        {contentAction?.length > 0 ? contentAction?.map((content, index) => {
                            if (content.action != 'deleted') {

                                return <div>
                                    <div className='content_lists_item' key={content.id} onClick={e => handleClickContent(e, content)}>
                                        <div><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M9 19.225q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm6 0q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm-6-6q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm6 0q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm-6-6q-.5 0-.863-.363Q7.775 6.5 7.775 6t.362-.863Q8.5 4.775 9 4.775t.863.362q.362.363.362.863t-.362.862Q9.5 7.225 9 7.225Zm6 0q-.5 0-.863-.363-.362-.362-.362-.862t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.862q-.363.363-.863.363Z" /></svg></div>
                                        <div>{index + 1}/{contentAction.length}. {chapterCategory.filter((cat) => cat.id == content.chapter_category)[0].title} [{content.title}]</div>
                                    </div>
                                </div>
                            }
                        }
                        )
                            : <div></div>
                        }
                    </div>
                </div>
            }
            {clickedAddContent
                // <div>
                //     {/* -------Preview-------- */}
                //     <h3>Preview</h3>
                //     {<PreviewContent contentAction={contentAction} clickedContentId={clickedContent?.id} isCreateMode={true} />}
                // </div>

                // <div className='content_lists'>

                //     <div className='content_lists_body'>
                //         {console.log('content_lists_body: ', contentAction)}
                //         {contentAction?.length > 0 ? contentAction?.map((content, index) => {
                //             if (content.action == 'created') {

                //                 return <div className='content_lists_item' key={content.id} onClick={e => handleClickContent(e, content)}>
                //                     {index + 1}/{contentAction.length}. {chapterCategory.filter((cat) => cat.id == content.chapter_category)[0].title}
                //                 </div>
                //             }
                //         }
                //         )
                //             : <div></div>
                //         }
                //     </div>
                // </div>
            }


        </div>
    )
}

export default AddContent