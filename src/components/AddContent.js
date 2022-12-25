import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getClickedCourse, setClickedCourse } from '../slices/courseSlice'
import {
    getClickedChapter, setClickedChapter, setClickedContent,
    getClickedContent, getChapterCategory, resetContentAction,
    getContentAction, getContentActionById, deleteContentAction,
    createContentAction, updateContentActionById, setContentAction,
    deleteContentAddAction, setChapterUpdatedStatus, getChapterUpdatedStatus,
    setBackupContentAction, setRestoreContentAction, setChapters

} from '../slices/chapterSlice'

import { setPathContentID, getPathID } from '../slices/pathSlice'
import './AddContent.css'
import PreviewContent from './PreviewContent'
import DialogBox from './DialogBox'
import { Form } from 'react-router-dom'

const AddContent = ({ funcSetCreateMode, teacherId, selectedContentInPreview }) => {
    const dispatch = useDispatch()
    const pathID = useSelector(getPathID)
    const clickedChapter = useSelector(getClickedChapter)
    const chapterCategory = useSelector(getChapterCategory)
    const contentAction = useSelector(getContentAction)
    const clickedContent = useSelector(getClickedContent)
    const clickedCourse = useSelector(getClickedCourse)


    const [copidClickedContent, setCopidClickedContent] = useState(null)
    const [contentChoice, setContentChoice] = useState(null)
    const [inputContent, setInputContent] = useState({ file: null, url: null, text: null })
    // const [previousClickedContent, setPreviousClickedContent] = useState(null)
    const [triggerUseEffect, setTriggerUseEffect] = useState(false)
    const [dialogDeleteContent, setDialogDeleteContent] = useState({
        message: "",
        isLoading: false,
        itemName: "",
        content: null,
    });
    const [isCreatedContent, setIsCreatedContent] = useState(false)
    /** 
    * -- 
    * 1. operateContent: show on and off for + and - sign 
    * 2. clickedAddContent: When add(+sign) clicked set it to true
    * 3. clickedUpdateContent: When update(pen sign) clicked set it to true
    *  */
    const [clickedAddContent, setClickedAddContent] = useState(false)
    const [clickedUpdateContent, setClickedUpdateContent] = useState(false)
    const [operateContent, setOperateContent] = useState(true)

    // const [selectContent, setSelectContent] = useState(false)




    const contentFileRef = useRef(null)
    const contentLinkRef = useRef(null)
    const selectionRef = useRef(null)
    const titleRef = useRef(null)
    const imageRef = useRef(null)
    const paragraphRef = useRef(null)
    const codeRef = useRef(null)

    const [itemState, setItemState] = useState({ isHover: false, isDone: false })
    const dragStartedItem = useRef(null)
    const dragOverItem = useRef(null)

    const fetchChapters = async () => {
        if (!clickedCourse?.course?.id) return
        // setCreateChapter(false)
        const url = axios.defaults.baseURL + `/api/course-chapter/${clickedCourse?.course?.id}`
        await axios({
            method: 'GET',
            url,
            // headers: {
            //     'Content-Type': 'Application/json'
            // }
        })
            .then(res => {

                // console.log('fetchChapters:  course-', clickedCourse?.course, ', response: ', res.data, ', endpoint-', url)
                dispatch(setChapters({ chapter_list_sequence: clickedCourse?.course?.chapter_list_sequence, res_data: res.data }))
            })
            .catch(err => console.log('error: ' + url, err))
    }
    // --------------------------------------------------
    const handleDeleteContentResponse = (choose, messageData) => {
        // console.log('handleDeleteContentResponse: ', choose, messageData)
        if (choose) {
            //   setProducts(products.filter((p) => p.id !== idProductRef.current));
            // -- Delete course by dispatch it to server. --
            const formData = new FormData()
            formData.append('chapter_id', clickedChapter?.id)
            formData.append('content_id', messageData.content.id)
            axios({
                method: 'DELETE',
                // url: axios.defaults.baseURL + '/api/chapter-content/' + messageData.content.id
                url: axios.defaults.baseURL + '/api/chapter-content-delete/',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData,
            })
                .then(res => {
                    // console.log('/api/chapter-content-delete/: ', res.data)
                    // if (!res.data.content_list_sequence) {
                    //     setClickedContentId(null)
                    // }
                    fetchContentByCourseID()
                    dispatch(setPathContentID(null))
                    dispatch(setChapterUpdatedStatus())

                })
                .catch(err => console.log(err))
            // console.log('delete content', messageData.content)
        } else {
        }
        setDialogDeleteContent({ message: "", isLoading: false, itemName: '', content: null, });

    }
    // ----------------------------------------------------
    const handleDeleteContent = (e) => {
        const contentCat = chapterCategory.filter(item => item.id == clickedContent?.chapter_category)
        setDialogDeleteContent({
            message: "Are you sure you want to delete?",
            isLoading: true,
            itemName: contentCat.length == 0 && contentCat[0].title + ' Content',
            content: clickedContent,
        });
        // console.log('handleDeleteCourse-clickedChapter', clickedChapter)
    }

    const handleUpdateContent = (e) => {
        // console.log('handleUpdateCourse-clickedContent', clickedContent)
        fetchChapters()

        dispatch(setBackupContentAction())

        setOperateContent(false)
        setClickedAddContent(false)
        setClickedUpdateContent(true)
        funcSetCreateMode(false)

    }
    const handleCancelUpdate = (e) => {
        // const recovery_clickedContent = {}
        // Object.keys(copidClickedContent).map(key => recovery_clickedContent[key] = copidClickedContent[key])
        // dispatch(setClickedContent(recovery_clickedContent))

        // dispatch(createContentAction({ catId: contentChoice.id, type: 'title', data: e.target.value, creater: teacherId }))
        dispatch(setRestoreContentAction())
        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)
        funcSetCreateMode(false)
        setTriggerUseEffect(!triggerUseEffect)
        // console.log('handleCancelUpdate-recovery_clickedContent: ', recovery_clickedContent, ', copidClickedContent:', copidClickedContent, ', clickedContent:', clickedContent)
        // console.log('handleCancelUpdate-,  clickedContent:', clickedContent)
    }

    const handleAddContent = (e) => {

        dispatch(setBackupContentAction())
        setInputContent({ file: null, url: null, text: null })
        setContentChoice(null)
        setOperateContent(false)
        setClickedAddContent(true)
        funcSetCreateMode(true)
    }
    const handleClickCloseContent = (e) => {
        // console.log('handleClickCloseContent: ', contentAction, ', previousClickedContent:', previousClickedContent)

        if (clickedUpdateContent) {
            dispatch(setRestoreContentAction())
            setClickedUpdateContent(false)
        }
        else if (clickedAddContent) {
            dispatch(setRestoreContentAction())
            setInputContent({ file: null, url: null, text: null })
        }
        else {

            setInputContent({ file: null, url: null, text: null })
        }

        /** reset inputContent */
        // setInputContent({ file: null, url: null, text: null })
        /** delete any created acation */
        dispatch(deleteContentAddAction())
        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)
        funcSetCreateMode(false)
        setTriggerUseEffect(!triggerUseEffect)
        // if (previousClickedContent) {

        //     const shadowColor = '0px 0px 3px 2px rgba(0, 200,200 , 0.95)'
        //     previousClickedContent.style['box-shadow'] = shadowColor
        //     previousClickedContent.style['-webkit-box-shadow'] = shadowColor
        //     previousClickedContent.style['-moz-box-shadow'] = shadowColor

        // }

    }

    /**
      * Remove hash tag(xxxx) in file path between _xxxx by regular expression /_.*\./.
      */
    const getFileName = (filePath) => {
        // console.log('getFileName - filePath', filePath)
        if (filePath && filePath.includes('/')) {
            const onlyFileName = filePath?.split('/').pop()
            return onlyFileName?.replace(/_.*\./, ".")
        }
        return ''
    }
    const handleOnChangeInputAdd = (e, type) => {
        setInputContent({ file: null, url: null, text: null })

        if (type == 'file') {
            // console.log('input file: ', e, e.target.nextSibling, e.target.files[0])
            setInputContent({ ...inputContent, [e.target.name]: e.target.files[0] })
            e.target.nextSibling.innerHTML = e.target.files[0].name
            dispatch(createContentAction({ catId: contentChoice.id, type: 'file', data: e.target.files[0], creater: teacherId }))
        }
        else if (type == 'image') {
            // console.log('input Image file: ', e, e.target.nextSibling, e.target.files[0])
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
    const handleOnChangeInputUpdate = (e, type) => {
        // setInputContent({ file: null, url: null, text: null })
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
        // console.log('genContentDetailEleAdd: ', contentChoice, contentAction)
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
            // console.log('clickedContent.Image File: ', inputContent?.image?.name, contentAction, sel, clickedContent)
            return <div className='element_input'>
                <input required ref={contentFileRef}

                    type='file' accept="image/*" name='image'
                    onChange={e => handleOnChangeInputAdd(e, 'image')} />
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
    const genContentDetailEleUpdate = (contentId) => {
        // console.log('----- genContentDetailEleUpdate---- contentChoice:', contentChoice, ', clickedContent:', clickedContent, ', inputContent:', inputContent)
        if (contentChoice?.title?.includes('PDF File'))
            return <div className='element_input'>
                <input required ref={contentFileRef} type='file' accept="application/pdf" name='file' onChange={e => handleOnChangeInputUpdate(e, 'file')} />
                <label className='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
            </div>

        if (contentChoice?.title?.includes('HTML File'))
            return <div className='element_input'>
                <input required ref={contentFileRef} type='file' accept=".html" name='file' onChange={e => handleOnChangeInputUpdate(e, 'file')} />
                <label id='fileinput_label'>{clickedContent && clickedContent.action == 'updated' ? clickedContent.file.name : getFileName(clickedContent?.file) || 'Choose File'}</label>
            </div>
        if (contentChoice?.title?.includes('Image File')) {
            const sel = contentAction.filter(content => content.id == contentId)[0]
            // console.log('clickedContent.Image File: ', inputContent?.image?.name, contentAction, sel, clickedContent)
            return <div className='element_input'>
                <input required ref={contentFileRef}

                    type='file' accept="image/*" name='image' onChange={e => handleOnChangeInputUpdate(e, 'image')} />
                {/* <label id='fileinput_label'>{sel && sel?.action == 'updated' ? (inputContent?.image?.name) : getFileName(inputContent?.image) || 'Choose File'}</label> */}
                <label id='fileinput_label'>{sel && sel?.action == 'updated' && (inputContent?.image?.name) ? (inputContent?.image?.name) : 'Choose File'}</label>
                {/* <label id='fileinput_label'>{(inputContent?.image?.name) ? (inputContent?.image?.name) : 'Choose File'}</label> */}
            </div>
        }
        if (contentChoice.title.includes('Link'))
            return <div className='element_input'>
                <input className='input_url' ref={contentLinkRef} required name='url' type='text' value={inputContent.url} onChange={e => handleOnChangeInputUpdate(e, 'url')} />
            </div>

        if (contentChoice.title.includes('Title')) {

            return <div className='element_input'>
                <input required className='input_title' ref={titleRef} name='title' type='text' value={inputContent.title} onChange={e => handleOnChangeInputUpdate(e, 'title')} />
            </div>
        } if (contentChoice.title.includes('Paragraph'))
            // console.log('clickedContent.text: ', clickedContent.text)
            return <div className='element_input'>
                <textarea required className='input_paragraph' rows={7} ref={paragraphRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInputUpdate(e, 'text')} />
            </div>

        if (contentChoice.title.includes('Code'))
            return <div className='element_input'>
                <textarea required className='input_code' rows='7' ref={codeRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInputUpdate(e, 'text')} />
            </div>

        if (contentChoice.title.includes('Note'))
            return <div className='element_input'>
                <textarea required className='input_note' rows='7' ref={codeRef} name='text' type='text' value={inputContent.text} onChange={e => handleOnChangeInputUpdate(e, 'text')} />
            </div>

        if (contentChoice.title.includes('Break Line')) {

            // console.log('Break Line-inputContent', inputContent)
            return
        }
    }
    /** Find current Content Card by the card index and cat ID */
    const outlinedContentCard = (contentID, isFromPreview = false) => {
        // console.log('outlinedChapterCard - contentID', contentID)
        const content_card_outline = document.querySelectorAll('.add_chapter__component .content_lists_item')
        const shadowColor = '0px 0px 3px 2px rgba(0, 200,200 , 0.95)'

        for (let i = 0; i < content_card_outline.length; i++) {

            const card = content_card_outline[i]
            const id = card.className.split(' ').pop()

            /** Reset previous outline to nothing */
            card.style['box-shadow'] = ''
            card.style['-webkit-box-shadow'] = ''
            card.style['-moz-box-shadow'] = ''
            /** Once find the clicled element and highlight outline(box-shadow) */
            if (contentID && Number(id) == contentID) {
                // card.style['border-radius'] = '5px'
                card.style['box-shadow'] = shadowColor
                card.style['-webkit-box-shadow'] = shadowColor
                card.style['-moz-box-shadow'] = shadowColor
                isFromPreview && card.scrollIntoView();
            }
            else if (contentID == null || typeof (contentID) == 'undefined') {
                if (i == 0) {
                    card.style['box-shadow'] = shadowColor
                    card.style['-webkit-box-shadow'] = shadowColor
                    card.style['-moz-box-shadow'] = shadowColor
                }
            }


        }
    }
    const handleClickContent = (e, content, index) => {//clickedChapter?.content
        console.log('handleClickContent: ', content)
        /**
         * Show filename in input file
         */
        // 
        setIsCreatedContent(false)
        const urlFilter = chapterCategory?.filter((chCat) => chCat.id == content.chapter_category)
        const linkInput = document.querySelector('input_url')
        if (urlFilter && urlFilter[0]?.title.includes('Link')) {

            // console.log('-----clickContent:', content, urlFilter, ', linkInput', linkInput)
            if (linkInput) {
                linkInput.innerHTML = content.url
                linkInput.style.display = 'unset'
            }
        }
        outlinedContentCard(content.id)
        dispatch(setPathContentID(content.id))
        dispatch(setClickedContent(content))
        /**
         * selectionRef.current.value is for initial value of select tag
         */
        if (selectionRef?.current) selectionRef.current.value = content.chapter_category
        // console.log('chapterCategory?.filter((chCat) => chCat.id == content.chapter_category)[0]: ', chapterCategory?.filter((chCat) => chCat.id == content.chapter_category)[0])
        setContentChoice(chapterCategory?.filter((chCat) => chCat.id == content.chapter_category)[0])
        setInputContent({
            url: content.url,
            file: content.file,
            text: content.text,
            title: content.title,
            image: content.image,
            code: content.code,
        })
    }

    const fetchContentByCourseID = async () => {
        const url = axios.defaults.baseURL + `/api/chapter/${pathID.chapterID}`
        await axios.get(url)
            .then(res => {
                // console.log('fetchContentByCourseID: ' + url, ', response:', res.data)
                dispatch(setClickedChapter(res.data))

            })

            .catch(e => console.log('error-fetch-chapter: ' + url, e))
    }
    const updateContentSequence = async (seq) => {
        let formData = new FormData()
        formData.append('content_list_sequence', JSON.stringify(seq))
        // console.log('updateContentSequence - formData: ', formData)
        const url = axios.defaults.baseURL + '/api/chapter/' + clickedChapter.id
        axios({
            method: 'PATCH',
            url: url,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {

                // console.log('updateContentSequence:' + url, res.data)
                dispatch(setClickedChapter(res.data))
                setTriggerUseEffect(!triggerUseEffect)
            })

            .catch(res => { console.log('updateContentSequence--error: ', res); })
    }
    /** -- onPasteCaptureImage triggered when copy and paste image  */
    const onPasteCaptureImage = (e) => {
        if (contentChoice?.id != 15) return;
        e.preventDefault()
        console.log('onPasteCaptureImage', e.clipboardData, ', contentChoice', contentChoice, ', clickedContent?.id', clickedContent?.id)
        const clipboardItems = e.clipboardData.items;

        const items = [].slice.call(clipboardItems).filter(function (item) {
            // Filter the image items only
            return /^image\//.test(item.type);
        });
        if (items.length === 0) {
            return;
        }

        const item = items[0];
        const blob = item.getAsFile();

        let file = new File([blob], "clipboard.jpg", { type: "image/jpeg", lastModified: new Date().getTime() }, 'utf-8');
        let container = new DataTransfer();
        container.items.add(file);
        setInputContent({ ...inputContent, file: container.files[0] })
        dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent?.id, type: 'image', data: container.files[0] }))

        // The below line causes problem later on fix it to show it to preview.
        // clickedAddContent && dispatch(createContentAction({ catId: contentChoice.id, type: 'image', data: container.files[0], creater: teacherId }))

        setCopidClickedContent('image')
        contentFileRef.current.required = false
        const fileInputEle = document.getElementById('fileinput_label')
        if (fileInputEle) fileInputEle.innerHTML = 'copied clipboard image'

        console.log('e.clipboardData.files', e, container.files)
    }


    const onSubmitUpdateContentForm = (e) => {
        e.preventDefault()
        /** reset inputContent */
        setInputContent({ file: null, url: null, text: null })

        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)
        funcSetCreateMode(false)
        // setTriggerUseEffect(!triggerUseEffect)


        let formData = new FormData()
        const contentId = clickedContent.id

        // console.log('+++===> onSubmitUpdateContentFor:-contentAction', contentAction, ', contentChoice', contentChoice,)

        if (contentChoice.id == 12) {// Break Line
            formData.append('title', contentChoice.title)
            formData.append('file', '')
            formData.append('url', '')
            formData.append('text', '')
            formData.append('image', '')
        }
        else {
            const _contentAction = contentAction?.filter((item) => item.action == 'updated')
            if (_contentAction.length !== 1) return;
            formData.append('file', _contentAction[0].file)
            formData.append('url', _contentAction[0].url)
            formData.append('text', _contentAction[0].text)
            formData.append('image', _contentAction[0].image)
            formData.append('title', _contentAction[0].title)
        }


        formData.append('chapter_category', contentChoice.id)
        // console.log('---- onSubmitUpdateContentForm-formData: ', formData)

        axios({
            method: 'PATCH',
            url: axios.defaults.baseURL + '/api/chapter-content/' + contentId,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                // console.log('Success UPDATE CONTENT- End point-/api/chapter-content/' + contentId, res.data)


                fetchChapters()
                fetchContentByCourseID()
                setTriggerUseEffect(!triggerUseEffect)


            })
            .catch(err => console.log('Error - End point-/api/chapter-content/' + contentId, err))

        // console.log('+++===> onSubmitUpdateContentFor: - contentChoice:', contentChoice,
        //     'contentAction: ', contentAction, ', formData', formData
        // )

    }


    const onSubmitAddContentForm = (e) => {
        e.preventDefault()

        /** reset inputContent */
        setInputContent({ file: null, url: null, text: null })
        /** delete any created acation */
        dispatch(deleteContentAddAction())

        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)
        funcSetCreateMode(false)


        let formData = new FormData()
        // formData.append('title', e.target[0].value)
        formData.append('chapter_category', Number(contentChoice.id))
        formData.append('creater', Number(teacherId))
        const _contentAction = contentAction?.filter((item) => item.action == 'created')
        if (_contentAction?.length == 1) {
            // console.log('contentAction.image: ', _contentAction[0].image)
            _contentAction[0].file && formData.append('file', _contentAction[0].file)
            _contentAction[0].url && formData.append('url', _contentAction[0].url)
            _contentAction[0].text && formData.append('text', _contentAction[0].text)
            _contentAction[0].image && formData.append('image', _contentAction[0].image)
            _contentAction[0].title && formData.append('title', _contentAction[0].title)
        }
        if (copidClickedContent == 'image') {
            formData.append('image', inputContent.file)
            setCopidClickedContent(null)
        }
        // console.log('+++===> onSubmitAddContentFor: - contentChoice:', contentChoice,
        //     'contentAction: ', contentAction, ', formData', formData
        // )

        /** ++ create content database in server. ++ */
        axios({
            method: 'POST',
            url: axios.defaults.baseURL + '/api/chapter-content/',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                // console.log('Success - End point-/api/chapter-content/', res.data)
                const contentId = res.data.id
                // dispatch(setPathContentID(res.data.id))

                // console.log('clickedContentId:', clickedContentId, clickedContent?.id, ', res.data.id', res.data.id)



                /** ++ Add the created content into the chapter DB in server. ++*/
                const formData = new FormData()
                formData.append('chapter_id', clickedChapter?.id)
                formData.append('content_id', contentId)
                clickedContent?.id && formData.append('content_insert_id', clickedContent?.id)
                const url = axios.defaults.baseURL + '/api/chapter-content-add/'
                // console.log('formData' + url, formData)
                axios({
                    method: 'PUT',
                    url: url,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: formData
                })
                    .then(res => {
                        // console.log('Success-End point-/api/chapter-content-add/', res.data)
                        dispatch(setPathContentID(contentId))
                        /** For rerendering to update */
                        fetchChapters()
                        fetchContentByCourseID()
                        dispatch(setChapterUpdatedStatus())

                        /** ++ After add content the view point changes to show current current card.++ */
                        setIsCreatedContent(false)

                        // console.log('getPathID', pathID, ', id_content_select', id_content_select)

                        //-- end --


                    })
                    .catch(err => console.log('Error-End point-/api/chapter-content-add/', err))
            })
            .catch(err => console.log('Error - End point-/api/chapter-content/', err))

    }

    /** When refresh window it automatically selects the first content */
    const initSelectContent = (_clickedContent, isFromPreview = false) => {

        // dispatch(setClickedContent(_clickedContent))
        // console.log('>>>>----initSelectContent: ', _clickedContent)
        if (_clickedContent) {


            setInputContent({
                url: _clickedContent.url,
                file: _clickedContent.file,
                text: _clickedContent.text,
                title: _clickedContent.title,
                image: _clickedContent.image,
                code: _clickedContent.code,
            })



            outlinedContentCard(_clickedContent.id, isFromPreview)
            dispatch(setClickedContent(_clickedContent))
            /**
             * selectionRef.current.value is for initial value of select tag
             */
            if (selectionRef?.current) selectionRef.current.value = _clickedContent.chapter_category
            // console.log('init-click Content:', _clickedContent, ', choice: ', chapterCategory?.filter((chCat) => chCat.id == _clickedContent.chapter_category)[0].title)
            setContentChoice(chapterCategory?.filter((chCat) => chCat.id == _clickedContent.chapter_category)[0])
        }
    }




    const handleDragStart = (e, index) => {
        // console.log('handleDragStart-index', index)
        dragStartedItem.current = index
        setItemState({ isHover: false, isDone: false })
    }
    const handleDragEnter = (e, index) => {
        // console.log('handleDragEnter-index', index)
        e.preventDefault()
        if (dragStartedItem.current === index) return;
        dragOverItem.current = index
        setItemState({ ...itemState, isHover: !itemState.isHover })
    }
    const handleDragEnd = (e) => {
        // console.log('handleDragEnd')
        e.preventDefault()
        if (dragStartedItem.current === null) return
        // console.log('handleDragEnd: ')
        dragStartedItem.current = null
        dragOverItem.current = null
        setItemState({ isHover: false, isDone: true })
    }
    const handleDrop = (e, index) => {
        // console.log('handleDrop-index', index, ', contentAction:', contentAction, ', dragStartedItem:', dragStartedItem.current, ', dragOverItem', dragOverItem.current, ', clickedChapter', clickedChapter)
        e.preventDefault()

        const seq = clickedChapter.content_list_sequence
        if (seq && Object.keys(seq).length > 0) {
            const keys = Object.keys(seq)
                .sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                .map(key => Number(key))
            // console.log('before keys: ', keys)

            const deletedItem = keys.splice(dragStartedItem.current, 1)[0]

            keys.splice(index, 0, deletedItem)

            // console.log('after keys: ', keys)

            let newSeq = {}
            keys.forEach((key, index) => newSeq[String(key)] = index + 1)
            // console.log('newSeq: ', newSeq)
            updateContentSequence(newSeq)

        }
    }

    const scrollIntoView = () => {
        /** ++ After add content the view point changes to show current current card.++ */
        const id_content_select = document.getElementById('id_content_select')
        if (id_content_select) {
            id_content_select.scrollIntoView()
        }
        // setIsCreatedContent(false)
    }
    //-----------------------------------------------------------------------
    // useEffect(() => {
    //     selectedContentInPreview && handleClickContent(null, selectedContentInPreview)
    //     console.log('useEffect - ', selectedContentInPreview)
    // }, selectedContentInPreview)
    /** -- When clicked on the chapter it triggers useEffect [clickedChapter].-- */
    useEffect(() => {
        dispatch(setClickedContent(null))

        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)

        // console.log('useEffect - 3. AddChapter->clickedChapter: ', clickedChapter, ', clickedContent: ', clickedContent, ' end-pathID?.contentID', pathID?.contentID)

        if (clickedChapter?.content?.length > 0) {

            // test to delete item in contentAction
            // dispatch(deleteContentAction(8))
            // dispatch(createContentAction({ catId: 1, createrId: 1, type: 'file', data: 'a.html', }))
            // dispatch(updateContentActionById({ catId: 1, id: 16, type: 'url', data: 'https:www.youtube.com' }))

            /** --2. Initialize Content with first one.-- */
            if (contentAction.length > 0) {

                const foundContent = contentAction.filter(content => content.id == pathID?.contentID)
                if (foundContent.length == 1) initSelectContent(foundContent[0])
                else initSelectContent(contentAction[0])
            }
        }

    }, [clickedChapter, triggerUseEffect, clickedCourse?.course?.chapter_list_sequence])
    useEffect(() => {
        dispatch(setClickedContent(null))

        setOperateContent(true)
        setClickedAddContent(false)
        setClickedUpdateContent(false)

        // console.log('useEffect - 3. AddChapter->clickedChapter: ', clickedChapter, ', clickedContent: ', clickedContent, ' end-pathID?.contentID', pathID?.contentID)

        if (clickedChapter?.content?.length > 0) {
            setIsCreatedContent(false)
            initSelectContent(selectedContentInPreview, true)
            // selectedContentInPreview.scrollIntoView()
        }

    }, [selectedContentInPreview])


    useEffect(() => {
        // document.cookie = "CookieName=Cheecker; path =/; HttpOnly; samesite=None; Secure;"

    }, [contentChoice?.title, operateContent,])

    useEffect(() => {
        /** ++ After add content the view point changes to show current current card.++ */
        const id_content_select = document.querySelectorAll('.content_lists_block')
        if (id_content_select) {

            // id_content_select.scrollIntoView()
        }
        // console.log('useEffect- id_content_select', id_content_select, pathID)
        //-- end --
    }, [pathID?.contentID])
    // console.log('<<<< refesth from AddContent-clickedContent: ', clickedContent, ', previousClickedContent-', previousClickedContent)

    useEffect(() => {
        // console.log('useEffect AddContent- refresh: ')
        if (contentChoice?.title.includes('Break Line')) {
            // console.log('useEffect --- contentChoice: ', contentChoice, ', clickedContent', clickedContent)
            dispatch(createContentAction({ catId: contentChoice.id, type: 'text', data: null }))
        }
        // document.addEventListener('paste', pasteEvent)
        // return () => window.removeEventListener('paste', pasteEvent)

    }, [])
    return (
        <div className='chapter_content__view'>
            {/* -- Display Content Header Bar. --- */}
            <div className='title'>
                {/* <div><span className='t1'>Manage Content</span> On <span className='t2'>{clickedChapter?.name}</span> Chapter</div> */}
                <div>Build Web Page for <span className='t2'>{clickedChapter?.name}</span> Chapter</div>

            </div>
            <div className='svg_icon'>
                {/* -- delete sign -- */}
                {contentAction?.length > 0 && operateContent && <svg onClick={e => handleDeleteContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.3 20.5q-.75 0-1.275-.525Q5.5 19.45 5.5 18.7V6h-1V4.5H9v-.875h6V4.5h4.5V6h-1v12.7q0 .75-.525 1.275-.525.525-1.275.525ZM17 6H7v12.7q0 .125.088.213.087.087.212.087h9.4q.1 0 .2-.1t.1-.2ZM9.4 17h1.5V8H9.4Zm3.7 0h1.5V8h-1.5ZM7 6V19v-.3Z" /></svg>}
                {/* -- edit sign -- */}
                {contentAction?.length > 0 && operateContent && <svg onClick={e => handleUpdateContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.15 19H6.4l9.25-9.25-1.225-1.25-9.275 9.275Zm13.7-10.35L15.475 5.3l1.3-1.3q.45-.425 1.088-.425.637 0 1.062.425l1.225 1.225q.425.45.45 1.062.025.613-.425 1.038Zm-1.075 1.1L7.025 20.5H3.65v-3.375L14.4 6.375Zm-2.75-.625-.6-.625 1.225 1.25Z" /></svg>}
                {/*-- add expend + sign --*/}
                {/* {operateContent && <svg onClick={e => handleAddContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M10.85 19.15v-6h-6v-2.3h6v-6h2.3v6h6v2.3h-6v6Z" /></svg>} */}
                {operateContent && <svg onClick={e => handleAddContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.25 16.75h1.5v-4h4v-1.5h-4v-4h-1.5v4h-4v1.5h4ZM5.3 20.5q-.75 0-1.275-.525Q3.5 19.45 3.5 18.7V5.3q0-.75.525-1.275Q4.55 3.5 5.3 3.5h13.4q.75 0 1.275.525.525.525.525 1.275v13.4q0 .75-.525 1.275-.525.525-1.275.525Zm0-1.5h13.4q.1 0 .2-.1t.1-.2V5.3q0-.1-.1-.2t-.2-.1H5.3q-.1 0-.2.1t-.1.2v13.4q0 .1.1.2t.2.1ZM5 5v14V5Z" /></svg>}
                {/* close add - sign */}
                {!operateContent && <svg onClick={e => handleClickCloseContent(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.25 12.75v-1.5h13.5v1.5Z" /></svg>}
            </div>
            {/* -- When the Add Chapter + sign pressed.-- */}
            {clickedAddContent &&
                <form className='add_content_form' onSubmit={onSubmitAddContentForm} onPasteCapture={onPasteCaptureImage}>
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
            {/* -- When the Update Chapter edit sign pressed.-- */}
            {
                clickedUpdateContent &&
                <form className='add_content_form' onSubmit={onSubmitUpdateContentForm} onPasteCapture={onPasteCaptureImage}>

                    <div className='chapter_categories'>
                        <label className='descpriton'>Select Content Element</label>
                        <div className='chapter_categories_content'>

                            {chapterCategory.map(chapterCat => (<div key={chapterCat.id} className='item' onClick={e => setContentChoice(chapterCategory?.filter((chCat) => chCat.id == chapterCat.id)[0])} >{chapterCat.title}</div>))
                            }
                        </div>
                    </div>
                    <div className='content_element'>
                        {contentChoice && <div className='choice'>{contentChoice?.title}</div>}
                        {contentChoice && genContentDetailEleUpdate()}
                    </div>
                    {<button disabled={contentChoice ? false : true} type='button' onClick={handleCancelUpdate}>Cancel</button>}
                    {<button disabled={contentChoice ? false : true} type='submit'>Update Content</button>}
                </form>

            }
            {/** When delete button clicked on course it pops up */}
            {
                dialogDeleteContent.isLoading && <DialogBox
                    dialogData={dialogDeleteContent} onDialog={handleDeleteContentResponse} backgroundColor={'rgba(0,0,0,0.6)'}
                />
            }
            {/* ---------------------- 4. Detail of Content of Chapter ------------------------- */}
            {
                !clickedAddContent && !clickedUpdateContent &&
                <div className='content_lists'>

                    <div className='content_lists_body'>
                        {/* {console.log('content_lists_body: ', contentAction, ', pathID', pathID)} */}
                        {contentAction?.length > 0 ? contentAction?.map((content, index) => {
                            if (content.action != 'deleted') {

                                return <div key={content.id}
                                    id={(pathID?.contentID == content.id) ? 'id_content_select' : ''}
                                    className={`content_lists_block ${content.id}`}
                                    draggable
                                    onDragStart={e => handleDragStart(e, index)}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragOver={e => e.preventDefault()}
                                    onDragEnd={e => handleDragEnd(e)}
                                    onDrop={(e) => handleDrop(e, index)}
                                >
                                    <div className={`content_lists_item ${content.id}`} key={content.id} onClick={e => handleClickContent(e, content, index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M9 19.225q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm6 0q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm-6-6q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm6 0q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm-6-6q-.5 0-.863-.363Q7.775 6.5 7.775 6t.362-.863Q8.5 4.775 9 4.775t.863.362q.362.363.362.863t-.362.862Q9.5 7.225 9 7.225Zm6 0q-.5 0-.863-.363-.362-.362-.362-.862t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.862q-.363.363-.863.363Z" /></svg>
                                        <span>{index + 1}/{contentAction.length}. {chapterCategory.filter((cat) => cat.id == content.chapter_category)[0].title}</span>
                                    </div>
                                    <svg viewBox='9 9 30 30' xmlns="http://www.w3.org/2000/svg" height="30" width="20"><path d="M18.75 36.6 16 33.85l9.95-9.95L16 13.95l2.75-2.75 12.7 12.7Z" /></svg>
                                </div>
                            }
                        }
                        )
                            : <div></div>
                        }
                        {
                            /** ++ After add content the view point changes to show current current card.++ */
                            // const id_content_select = document.getElementById('id_content_select')
                            // if (id_content_select) {
                            //     id_content_select.scrollIntoView()
                            // }

                            isCreatedContent && scrollIntoView()

                        }


                    </div>
                </div>
            }



        </div >
    )
}

export default AddContent