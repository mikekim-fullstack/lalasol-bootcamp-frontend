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
import AddContent from './AddContent'
import DialogBox from './DialogBox'
const AddChapter = ({ catTitle, userId, clickedCourseInfo, handleSuccessUploadingChapter, teacherId }) => {

    const dispatch = useDispatch()
    const clickedChapter = useSelector(getClickedChapter)
    const chapterCategory = useSelector(getChapterCategory)
    const contentAction = useSelector(getContentAction)

    const [chapterLists, setChapterLists] = useState(null)
    const [createChapter, setCreateChapter] = useState(false)
    const [previousClickedChapter, setPreviousClickedChapter] = useState(null)

    const [isSelectChapter, setIsSelectChapter] = useState([])
    const [clickedAddChapter, setClickedAddChapter] = useState(false)
    const [clickedUpdateChapter, setClickedUpdateChapter] = useState(false)
    const [operateChapter, setOperateChapter] = useState(true)

    // const [contentChoice, setContentChoice] = useState(null)
    const clickedContent = useSelector(getClickedContent)

    const [isChapterUpdated, setIsChapterUpdated] = useState(false)
    const [dialogDeleteChapter, setDialogDeleteChapter] = useState({
        message: "",
        isLoading: false,
        itemName: "",
        chapter: null,
    });
    const [inputData, setInputData] = useState({
        course: clickedCourseInfo?.course?.id,
        name: '',
        description: '',
    })



    /** When refresh window it automatically selects the first chapter */
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

    /** Gell all chapters by userID and courseID from server */
    const fetchChapters = async () => {
        setCreateChapter(false)
        await axios.get(axios.defaults.baseURL + `/api/fetch-viewed-chapters-bycourse/?user_id=${userId}&course_id=${clickedCourseInfo?.course?.id}`)
            .then(res => {
                console.log('fetchChapters: ', res.data)
                const chapterListData = res.data
                /** If there is chapter_list_sequence, then sort key by sequence and reproduce chapter array in to _sortedChapters */
                if (clickedCourseInfo?.course?.chapter_list_sequence && Object.keys(clickedCourseInfo?.course?.chapter_list_sequence).length > 0) {
                    const seq = clickedCourseInfo?.course?.chapter_list_sequence
                    const keyChapterID = Object.keys(seq).sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                    console.log('keyChapterID: ', keyChapterID)
                    const _sortedcChapters = []
                    for (let i = 0; i < keyChapterID.length; i++) {

                        const res = chapterListData.filter(chapter => (chapter.id == Number(keyChapterID[i])))[0]
                        // console.log('cat.id', cat.id, 'orderedCourse: ', res)
                        _sortedcChapters.push(res)
                    }
                    setChapterLists(_sortedcChapters)
                }
                else {
                    setChapterLists(chapterListData)
                }
                // if (res.data.length > 1) {
                //     _sortedData.sort((a, b) => a.chapter_no > b.chapter_no ? 1 : a.chapter_no < b.chapter_no ? -1 : 0)
                // }

                // setChapterLists(_sortedData)
            })
            .catch(err => console.log('error: ', err))
    }
    // const handleSubmitForm = (e) => {
    //     e.preventDefault()
    //     console.log('handleSubmitForm - ', e.target.innerText.toLowerCase(), ', contentFileRef: ', contentFileRef.current.files)
    //     if (e.target.innerText.toLowerCase() == 'update') {


    //     }
    //     else if (e.target.innerText.toLowerCase() == 'create') {

    //     }
    // }

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

        console.log('clickCht:', clickCht, chapterId)
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
    // --------------------------------------------------
    const handleDeleteChapterResponse = (choose, messageData) => {
        console.log('handleDeleteChapterResponse: ', choose, messageData)

        if (choose) {
            //   setProducts(products.filter((p) => p.id !== idProductRef.current));
            // -- Delete course by dispatch it to server. --
            axios({
                method: 'DELETE',
                url: axios.defaults.baseURL + '/api/chapter/' + messageData.chapter.id
            })
                .then(res => {

                    // -- Remove map(deletedCourseID:orderNumber) from course_list_sequence. ---
                    /*
                    const seqCatData = { "chapter_list_sequence": {} }
                    const courseID = messageData.chapter.id
                    const selectedCat = allCategories?.filter(cat => cat.id == messageData.catId)[0]
                    if (selectedCat?.course_list_sequence) {
                        // -- Copy all current courseID:order into seqCatData{}. --
                        Object.keys(selectedCat.course_list_sequence)
                            .forEach(key => {
                                if (courseID != key) {
 
                                    const val = Number(selectedCat.course_list_sequence[key])
                                    seqCatData.course_list_sequence[key] = Number(val)
                                }
                            })
                        updateCourseSequenceInCategory(messageData.catId, seqCatData)
                    }
 
                    successfullyDeleted(res, messageData)
                    */
                    setClickedChapter(null)

                    fetchChapters()
                    setClickedAddChapter(false)


                })
                .catch(err => console.log(err))
            console.log('delete chapter', messageData.chapter)
        } else {
        }
        setDialogDeleteChapter({ message: "", isLoading: false, itemName: '', chapter: null, });

    }
    const handleDeleteChapter = (e) => {
        setDialogDeleteChapter({
            message: "Are you sure you want to delete?",
            isLoading: true,
            itemName: clickedChapter?.name + ' Chapter',
            chapter: clickedChapter,
        });
        console.log('handleDeleteCourse-clickedChapter', clickedChapter)
    }
    const handleUpdateChapter = (e) => {
        setInputData({ ...inputData, name: clickedChapter.name, description: clickedChapter.description })
        setOperateChapter(false)

        setClickedUpdateChapter(true)
    }
    const handleAddChapter = (e) => {
        setInputData({ ...inputData, name: '', description: '' })

        setOperateChapter(false)

        setClickedAddChapter(true)


    }
    const handleClickCloseChapter = (e) => {

        setOperateChapter(true)


        setClickedAddChapter(false)
        setClickedUpdateChapter(false)
    }


    //------------------------------------
    const updateCourseChapterSequence = async (formData) => {
        await axios({
            method: 'PATCH',
            url: axios.defaults.baseURL + '/api/course-update/' + clickedCourseInfo?.course?.id,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                // --- Reset input fields. ---
                // setInputData({ ...inputData, title: '', description: '' })
                // fileRef.current.value = "";//Resets the file name of the file input 



                // setUploadSuccess(true)
                // handleSuccessUploading(true, res.data.id, res.data.category, res.data.teacher)
                console.log('onSubmitUpdateCourseForm:', res)

            })

            .catch(res => { console.log('onSubmitUpdateCourseForm--error: ', res); })

    }
    //------------------------------------
    const onHandleInputChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
        if (e.target.name == 'description') {
            e.target.style.height = "1px";
            e.target.style.height = (e.target.scrollHeight) + "px";
        }
    }
    const onSubmitAddChapterForm = (e) => {
        e.preventDefault()
        let formData = new FormData()

        // Object.entries(inputData).forEach((input, index) => console.log(input, index))
        Object.entries(inputData).forEach((input, index) => formData.append(input[0], input[1]))
        console.log('------------- onSubmitAddCourseForm--:', formData)
        axios({
            method: 'POST',
            url: axios.defaults.baseURL + '/api/chapters/',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                // --- Reset input fields. ---
                setInputData({ ...inputData, name: '', description: '' })

                // updateCourseChapterSequence()
                // fileRef.current.value = "";//Resets the file name of the file input 


                setIsChapterUpdated(true)
                setClickedAddChapter(false)
                // setUploadSuccess(true)
                // handleSuccessUploadingChapter(true, res.data.id, res.data.category, res.data.teacher)
                console.log('onSubmitAddChapterForm:', res)

            })

            .catch(res => { console.log('onSubmitAddChapterForm--error: ', res); })

    }
    const onSubmitUpdateChapterForm = (e) => {
        e.preventDefault()
        let formData = new FormData()

        // Object.entries(inputData).forEach((input, index) => console.log(input, index))
        Object.entries(inputData).forEach((input, index) => formData.append(input[0], input[1]))
        console.log('------------- onSubmitAddCourseForm--:', formData)
        axios({
            method: 'PATCH',
            url: axios.defaults.baseURL + '/api/chapter/' + clickedChapter.id,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                // --- Reset input fields. ---
                setInputData({ ...inputData, name: '', description: '' })

                // updateCourseChapterSequence()
                // fileRef.current.value = "";//Resets the file name of the file input 

                if (previousClickedChapter) {
                    previousClickedChapter.style['box-shadow'] = ''
                    previousClickedChapter.style['-webkit-box-shadow'] = ''
                    previousClickedChapter.style['-moz-box-shadow'] = ''

                }
                setIsChapterUpdated(true)
                setClickedUpdateChapter(false)
                // setUploadSuccess(true)
                // handleSuccessUploadingChapter(true, res.data.id, res.data.category, res.data.teacher)
                console.log('onSubmitUpdateChapterForm:', res)

            })

            .catch(res => { console.log('onSubmitUpdateChapterForm--error: ', res); })
    }
    /**
     * -------------------------------------------------------------------------------------
     */
    useEffect(() => {
        setClickedChapter(null)

        fetchChapters()

        console.log('useEffect - 1. AddChapter->fetchChapters', ', course_id:', clickedCourseInfo?.course?.id)
    }, [clickedCourseInfo?.course?.id, isChapterUpdated])

    useEffect(() => {
        setIsChapterUpdated(false)
        setClickedChapter(null)
        dispatch(setContentAction([]))
        if (chapterLists?.length > 0) {

            initSelectChapter(chapterLists[0])
            setIsSelectChapter(new Array(chapterLists.length).fill(false))
        }


        // chapterLists?.length > 0 && console.log('useEffect- chapterLists: ', chapterLists, chapterLists[0])
        console.log('useEffect - 2. AddChapter->chapterLists: setClickedChapter')
    }, [chapterLists])

    /** -- When clicked on the chapter it triggers useEffect [clickedChapter].-- */
    // useEffect(() => {
    //     console.log('useEffect - 3. AddChapter->clickedChapter: ', clickedChapter, ', clickedContent: ', clickedContent, ' end')

    //     if (!createChapter && clickedChapter?.content?.length > 0) {

    //         // test to delete item in contentAction
    //         // dispatch(deleteContentAction(8))
    //         // dispatch(createContentAction({ catId: 1, createrId: 1, type: 'file', data: 'a.html', }))
    //         // dispatch(updateContentActionById({ catId: 1, id: 16, type: 'url', data: 'https:www.youtube.com' }))

    //         /** --2. Initialize Content with first one.-- */
    //         contentAction.length > 0 && initSelectContent(contentAction[0])
    //     }

    // }, [clickedChapter])

    // useEffect(() => {
    //     // document.cookie = "CookieName=Cheecker; path =/; HttpOnly; samesite=None; Secure;"
    //     if (contentChoice?.title.includes('Break Line')) {
    //         console.log('useEffect --- contentChoice.title')
    //         dispatch(updateContentActionById({ catId: contentChoice.id, id: clickedContent.id, type: 'text', data: '' }))
    //     }
    // }, [contentChoice?.title])


    useEffect(() => {
        console.log('useEffect --- contentAction.action updated')


    }, [contentAction?.action])

    useEffect(() => {

        console.log('useEffect - inputData:', inputData)
        // contentFileRef && contentFileRef.current.files[0].name
    }, [inputData])


    // // --------------------------------------------------

    const mouseOverListener = (e) => {
        // console.log('mouseover', isAddMode)
        if (clickedAddChapter) document.getElementById('id_edit_chapter').innerText = 'Add Chapter'
        else document.getElementById('id_edit_chapter').innerText = 'Close Edit Chapter'
    }
    const mouseLeaveListener = (e) => {
        // console.log('mouseover', isAddMode)
        document.getElementById('id_edit_chapter').innerText = 'Chapter Modifier'
    }
    const id_plus_sign = document.getElementById('id_plus_sign')
    useEffect(() => {
        console.log('id_plus_sign: ', id_plus_sign)
        id_plus_sign?.addEventListener('mouseover', mouseOverListener)
        id_plus_sign?.addEventListener('mouseleave', mouseLeaveListener)
        return () => {
            id_plus_sign?.removeEventListener('mouseover', mouseOverListener)
            id_plus_sign?.removeEventListener('mouseleave', mouseLeaveListener)
        }

    }, [id_plus_sign])

    useEffect(() => {
        setClickedAddChapter(false)
        setClickedUpdateChapter(false)
        setOperateChapter(true)
    }, [clickedCourseInfo])

    useEffect(() => {
        // const txHeight = 16;
        // const tx = document.getElementsByTagName("textarea");
        // console.log('textarea: ', tx)
        // for (let i = 0; i < tx?.length; i++) {
        //     if (tx[i].value == '') {
        //         tx[i].setAttribute("style", "height:" + txHeight + "px;overflow-y:hidden;");
        //     } else {
        //         tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
        //     }
        //     tx[i].addEventListener("input", e => eventListenerInput(e, tx), false);
        // }
        // // return () => {
        // //     tx.removeEventListener("input", eventListenerInput, false);
        // // }


    }, [clickedUpdateChapter, clickedAddChapter])


    const textAreaAdjust = (e) => {
        // console.log('testAreaAdjust: ', e)
        e.target.style.height = "1px";
        e.target.style.height = (e.target.scrollHeight) + "px";
    }

    /** -- When clicked on the chapter it triggers useEffect [clickedChapter].-- */
    useEffect(() => {
        console.log('useEffect - 4. AddChapter->clickedChapter: ', clickedChapter, ', clickedContent: ', clickedContent, ' end')

        // if (clickedChapter?.content?.length > 0) {

        //     // test to delete item in contentAction
        //     // dispatch(deleteContentAction(8))
        //     // dispatch(createContentAction({ catId: 1, createrId: 1, type: 'file', data: 'a.html', }))
        //     // dispatch(updateContentActionById({ catId: 1, id: 16, type: 'url', data: 'https:www.youtube.com' }))

        //     /** --2. Initialize Content with first one.-- */
        //     contentAction.length > 0 && initSelectContent(contentAction[0])
        // }
        setClickedAddChapter(false)
        setClickedUpdateChapter(false)
        setOperateChapter(true)




    }, [clickedChapter])

    console.log('<<<< refreshed in AddChapter - contentAction', contentAction, ',id_plus_sign:', id_plus_sign)
    // ----------------------------------------------------
    return (
        <div className='add_chapter__view'>
            <h2 id='id_edit_chapter'> Edit Chapter </h2>
            <div className='add_chapter__component'>
                <div className='chapters_view'>
                    {/* -- Display chapter Header Bar. --- */}
                    <div className='title'>
                        <div><span className='t1'>Chapters On Course: </span><span className='t2'>{clickedCourseInfo?.course?.title}</span></div>
                        <div className='svg_icon'>
                            {/* -- delete sign -- */}
                            {(chapterLists?.length > 0 && operateChapter) && <svg onClick={e => handleDeleteChapter(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.3 20.5q-.75 0-1.275-.525Q5.5 19.45 5.5 18.7V6h-1V4.5H9v-.875h6V4.5h4.5V6h-1v12.7q0 .75-.525 1.275-.525.525-1.275.525ZM17 6H7v12.7q0 .125.088.213.087.087.212.087h9.4q.1 0 .2-.1t.1-.2ZM9.4 17h1.5V8H9.4Zm3.7 0h1.5V8h-1.5ZM7 6V19v-.3Z" /></svg>}
                            {/* -- edit sign -- */}
                            {(chapterLists?.length > 0 && operateChapter) && <svg onClick={e => handleUpdateChapter(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.15 19H6.4l9.25-9.25-1.225-1.25-9.275 9.275Zm13.7-10.35L15.475 5.3l1.3-1.3q.45-.425 1.088-.425.637 0 1.062.425l1.225 1.225q.425.45.45 1.062.025.613-.425 1.038Zm-1.075 1.1L7.025 20.5H3.65v-3.375L14.4 6.375Zm-2.75-.625-.6-.625 1.225 1.25Z" /></svg>}


                            {/* //close add - sign  */}
                            {!operateChapter && <svg id='id_plus_sign' onClick={e => handleClickCloseChapter(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.25 12.75v-1.5h13.5v1.5Z" /></svg>}

                            {/* //add expend + sign */}
                            {operateChapter && <svg id='id_plus_sign' onClick={e => handleAddChapter(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M10.85 19.15v-6h-6v-2.3h6v-6h2.3v6h6v2.3h-6v6Z" /></svg>}
                        </div>

                    </div>
                    {/* -- When the Add Chapter + sign pressed.-- */}
                    {clickedAddChapter &&
                        <div className='add_chapter__form'>
                            <form onSubmit={onSubmitAddChapterForm}>
                                <div className='group-1'>
                                    <div className='input'>

                                        <input onChange={onHandleInputChange} value={inputData?.name} required type='text' name='name' placeholder='Enter Chapter Name*' />
                                    </div>
                                    <div>
                                        {/* {showLabel && <label>Description</label>} */}
                                        <textarea onChange={onHandleInputChange} value={inputData?.description} rows='1' required name='description' placeholder='Enter Chapter Description*' />
                                    </div>
                                </div>

                                <button type='submit'>Add Chapter</button>
                            </form>
                        </div>}
                    {/* -- When the Update Chapter sign pressed.-- */}
                    {clickedUpdateChapter &&
                        <div className='add_chapter__form'>
                            <form onSubmit={onSubmitUpdateChapterForm}>
                                <div className='group-1'>
                                    <div className='input'>

                                        <input onChange={onHandleInputChange} value={inputData?.name} required type='text' name='name' placeholder='Enter Chapter Name*' />
                                    </div>
                                    <div>
                                        <textarea onChange={onHandleInputChange} value={inputData?.description} rows='1' required name='description' placeholder='Enter Chapter Description*' />
                                    </div>
                                </div>

                                <button type='submit'>Update Chapter</button>
                            </form>
                        </div>}
                    {/* --------------------- 1. Lists of Chapters-------------------------- */}

                    {chapterLists?.length > 0 && <div className='chapter_list_view'>

                        {chapterLists.map((chapter) => {
                            return <div key={chapter.id} className='chapter_lists' onClick={e => handleClickChapter(e, chapter.id)}>
                                <div><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M9 19.225q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm6 0q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm-6-6q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm6 0q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm-6-6q-.5 0-.863-.363Q7.775 6.5 7.775 6t.362-.863Q8.5 4.775 9 4.775t.863.362q.362.363.362.863t-.362.862Q9.5 7.225 9 7.225Zm6 0q-.5 0-.863-.363-.362-.362-.362-.862t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.862q-.363.363-.863.363Z" /></svg></div>
                                <div >
                                    {chapter.name}
                                </div>
                            </div>
                        })}
                        {/* <div className='btn' onClick={handleCreateChapter} >Create Chapter</div> */}
                    </div>}
                    {/** When delete button clicked on course it pops up */}
                    {dialogDeleteChapter.isLoading && <DialogBox
                        dialogData={dialogDeleteChapter} onDialog={handleDeleteChapterResponse} backgroundColor={'rgba(0,0,0,0.6)'}
                    />
                    }
                </div>
                {/* ---------------------- 2. Details of Chapter------------------------- */}
                {/* <div className='chapter_detail'>
                    {(chapterLists?.length > 0 || createChapter) && < EditChapter createChapter={createChapter} handleSubmitForm={handleSubmitForm} />}
                </div> */}

                {/* ---------------------- 3. Lists of Content of Chapter ------------------------- */}
                {chapterLists?.length > 0 && <AddContent />}


            </div >
            {/* -------Preview-------- */}
            <h3>Preview</h3>
            {clickedContent?.id && <PreviewContent contentAction={contentAction} clickedContentId={clickedContent?.id} />}
        </div >
    )
}

export default AddChapter