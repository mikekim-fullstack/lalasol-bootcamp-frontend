import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getClickedCourse, setClickedCourse } from '../slices/courseSlice'
import {
    getClickedChapter, setClickedChapter, setClickedContent,
    getClickedContent, getChapterCategory, resetContentAction,
    getContentAction, getContentActionById, deleteContentAction,
    createContentAction, updateContentActionById, setContentAction,
    getChapterUpdatedStatus, setChapters, getChapters,
} from '../slices/chapterSlice'

import { setPathChapterID, getPathID, setPathContentID } from '../slices/pathSlice'
import './AddChapter.css'
import EditChapter from './EditChapter'
import { ContentCutTwoTone } from '@mui/icons-material'
import PreviewContent from './PreviewContent'
import AddContent from './AddContent'
import DialogBox from './DialogBox'
const AddChapter = ({ teacherId }) => {

    const dispatch = useDispatch()
    const pathID = useSelector(getPathID)
    const clickedChapter = useSelector(getClickedChapter)
    const chapterCategory = useSelector(getChapterCategory)
    const contentAction = useSelector(getContentAction)
    const clickedCourse = useSelector(getClickedCourse)

    // const [chapterLists, setChapterLists] = useState(null)
    const chapterLists = useSelector(getChapters)
    const [createChapter, setCreateChapter] = useState(false)
    const [previousClickedChapter, setPreviousClickedChapter] = useState(null)
    const [isCreateContentMode, setIsCreateContentMode] = useState(null)
    const [isPreViewMode, setIsPreViewMode] = useState(true)
    const [isCompleteFetchChapter, setIsCompleteFetchChapter] = useState(false)
    const chapterUpdatedStatus = useSelector(getChapterUpdatedStatus)


    /** 
     * -- 
     * 1. operateChapter: show on and off for + and - sign 
     * 2. clickedAddChapter: When add(+sign) clicked set it to true
     * 3. clickedUpdateChapter: When update(pen sign) clicked set it to true
     *  */
    const [updateRender, setUpdateRender] = useState(false)
    const [clickedAddChapter, setClickedAddChapter] = useState(false)
    const [clickedUpdateChapter, setClickedUpdateChapter] = useState(false)
    const [operateChapter, setOperateChapter] = useState(true)

    const clickedContent = useSelector(getClickedContent)

    const [isChapterUpdated, setIsChapterUpdated] = useState(false)
    const [operationStage, setOperationStage] = useState('')
    const [dialogDeleteChapter, setDialogDeleteChapter] = useState({
        message: "",
        isLoading: false,
        itemName: "",
        chapter: null,
    });
    const [inputData, setInputData] = useState({
        // course: clickedCourse?.course?.id,
        name: '',
        description: '',
    })
    const [toggleRefresh, setToggleRefresh] = useState(false)


    const copyObject = (_clickedCourseItem, objItem) => {

        // console.log('first copyObject: ', _clickedCourseItem, objItem)
        if (objItem == null) return
        if (typeof (objItem) == 'object') {
            Object.keys(objItem).map((key) => {
                // console.log('inside map copyObject: ', key, objItem[key])
                if (objItem[key] != null && typeof (objItem[key]) == 'object') {
                    _clickedCourseItem[key] = {}

                    copyObject(_clickedCourseItem[key], objItem[key])
                }
                else _clickedCourseItem[key] = objItem[key]
            })


        }
        else {

            _clickedCourseItem = objItem
        }

    }
    /** When refresh window it automatically selects the first chapter */
    const initSelectChapter = (_clickedChapter) => {
        // console.log('init-click Chapter:', _clickedChapter, ', clickedContent:', clickedContent, ', pathID?.chapterID:', pathID?.chapterID)
        dispatch(setClickedChapter(_clickedChapter))

        /** -- Initially highlight the first chapter and make a sure the rest of chapters aren't highlighted. -- */
        outlinedChapterCard(pathID?.chapterID)
    }

    /** Gell all chapters by userID and courseID from server */
    const fetchChapters = async (mode, course, seq) => {
        if (!course) return
        // setCreateChapter(false)
        setOperateChapter(true)
        const url = axios.defaults.baseURL + `/api/course-chapter/${course.id}`
        await axios({
            method: 'GET',
            url,
        })
            .then(res => {

                const chapters = res.data
                // console.log('fetchChapters:  course-', course, ', response-chapters: ', chapters, ', endpoint-', url)
                dispatch(setChapters({ chapter_list_sequence: course?.chapter_list_sequence, res_data: chapters }))

                /** When chapter was deleted select first chapter */
                if (mode == 'refresh' || mode == 'delete') {
                    if (chapters.length > 0) {
                        // const seq = course?.chapter_list_sequence
                        if (seq) {
                            const keyChapters = Object.keys(seq)
                            if (keyChapters.length > 0) {
                                // select the first chapter
                                const sortedChapterKeys = keyChapters.sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                                const chapterId = Number(sortedChapterKeys[0])
                                dispatch(setPathChapterID(chapterId))
                                const firstChapter = chapters.filter(chapter => chapter.id == chapterId)
                                dispatch(setClickedChapter(firstChapter[0]))
                            }
                            else {
                                dispatch(setPathChapterID(null))
                            }
                        }
                    }
                    else {
                        dispatch(setClickedChapter(null))
                        dispatch(setPathChapterID(null))
                        dispatch(setPathContentID(null))
                    }
                }
                setIsCompleteFetchChapter(!isCompleteFetchChapter)



            })
            .catch(err => console.log('error: ' + url, err))
    }

    /** Find current Chapter Card by the card index and cat ID */
    const outlinedChapterCard = (chapterID) => {
        // console.log('outlinedChapterCard - chapterID', chapterID)
        const chapter_card_outline = document.querySelectorAll('.add_chapter__component .chapter_lists')
        const shadowColor = '0px 0px 3px 2px rgba(0, 200,200 , 0.95)'
        for (let i = 0; i < chapter_card_outline.length; i++) {

            const card = chapter_card_outline[i]
            const id = card.className.split(' ').pop()
            /** Reset previous outline to nothing */
            card.style['box-shadow'] = ''
            card.style['-webkit-box-shadow'] = ''
            card.style['-moz-box-shadow'] = ''
            /** Once find the clicled element and highlight outline(box-shadow) */
            if (chapterID && Number(id) == chapterID) {
                // card.style['border-radius'] = '5px'
                card.style['box-shadow'] = shadowColor
                card.style['-webkit-box-shadow'] = shadowColor
                card.style['-moz-box-shadow'] = shadowColor
            }
            else if (chapterID == null || typeof (chapterID) == 'undefined') {
                if (i == 0) {
                    card.style['box-shadow'] = shadowColor
                    card.style['-webkit-box-shadow'] = shadowColor
                    card.style['-moz-box-shadow'] = shadowColor
                }
            }


        }
    }

    const handleClickChapter = (e, chapterId) => {
        const clickCht = chapterLists.filter((chapter) => chapter.id == chapterId)
        // fetchChapters('', clickCht.length > 0 ? clickCht[0].course : null)
        fetchChapters('', clickedCourse?.course)
        dispatch(setPathChapterID(chapterId))
        outlinedChapterCard(chapterId)
        // clickCht.length > 0 && selectChapter(clickCht[0])

        // if (clickCht.length > 0 && clickCht[0].content_list_sequence) {
        //     const keyContent = Object.keys(clickCht[0]?.content_list_sequence)
        //     if (keyContent.length > 0) {
        //         // select the first chapter
        //         dispatch(setPathContentID(Number(keyContent[0])))
        //     }
        //     else {
        //         dispatch(setPathContentID(null))
        //     }
        //     dispatch(setClickedChapter(clickCht[0]))
        // }
        // else {
        //     dispatch(setClickedChapter(clickCht[0]))
        //     dispatch(setPathContentID(null))
        // }
        //-----------------------------

        if (clickCht.length > 0) {
            // dispatch(setPathChapterID(clickCht[0].id))
            dispatch(setClickedChapter(clickCht[0]))
            if (clickCht[0].content_list_sequence) {
                const keyContent = Object.keys(clickCht[0]?.content_list_sequence)
                if (keyContent.length > 0) {
                    // select the first chapter
                    dispatch(setPathContentID(Number(keyContent[0])))
                }
                else {
                    dispatch(setPathContentID(null))
                }
            }
            else {
                dispatch(setPathContentID(null))
            }

        }
        else {
            dispatch(setClickedChapter(null))
            dispatch(setPathChapterID(null))
            dispatch(setPathContentID(null))
        }


        // console.log('handleClickChapter- clickCht:', clickCht, ', chapter id: ', chapterId, ', chapterLists: ', chapterLists, ', pathID', pathID)
    }





    const handleCreateChapter = (e) => {
        // console.log('handleCreateChapter', chapterLists?.length)
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
        // console.log('handleDeleteChapterResponse: ', choose, messageData)

        if (choose) {
            //   setProducts(products.filter((p) => p.id !== idProductRef.current));
            // -- Delete course by dispatch it to server. --
            axios({
                method: 'DELETE',
                url: axios.defaults.baseURL + '/api/chapter/' + messageData.chapter.id
            })
                .then(res => {

                    // -- Remove map(deletedCourseID:orderNumber) from course_list_sequence. ---
                    const chapterListSequence = clickedCourse?.course?.chapter_list_sequence
                    const seqChapterData = { "chapter_list_sequence": {} }
                    setOperationStage('delete')
                    if (chapterListSequence) {
                        // -- Copy all current courseID:order into seqChapterData{}. --
                        Object.keys(chapterListSequence)
                            .forEach(key => {
                                if (messageData.chapter.id != Number(key)) {
                                    const val = Number(chapterListSequence[key])
                                    seqChapterData.chapter_list_sequence[key] = Number(val)
                                }

                            })

                    }

                    console.log('  ----Delete chapter seqChapterData---', seqChapterData, ', after deleted chapter: ', res.data)
                    // --------------------------------------------------------
                    updateCourseChapterSequence(seqChapterData)

                    // setClickedChapter(null)

                    fetchChapters('delete', clickedCourse?.course, seqChapterData.chapter_list_sequence)
                    setClickedAddChapter(false)


                    setUpdateRender(!updateRender)

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
        // console.log('handleDeleteCourse-clickedChapter', clickedChapter)
    }
    const handleUpdateChapter = (e) => {
        setInputData({ name: clickedChapter.name, description: clickedChapter.description })
        setOperateChapter(false)

        setClickedUpdateChapter(true)
    }
    const handleAddChapter = (e) => {
        setInputData({ name: '', description: '' })

        setOperateChapter(false)

        setClickedAddChapter(true)


    }
    const handleClickCloseChapter = (e) => {

        setOperateChapter(true)

        setClickedAddChapter(false)
        setClickedUpdateChapter(false)
    }


    //------------------------------------
    const updateCourseChapterSequence = async (chapterSeqData) => {
        await axios({
            method: 'PATCH',
            url: axios.defaults.baseURL + '/api/course-update/' + clickedCourse?.course?.id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: chapterSeqData
        })
            .then(res => {
                dispatch(setClickedCourse({ catId: clickedCourse.catId, courseId: clickedCourse.courseId, course: res.data }))
                setIsChapterUpdated(true)
                console.log('onSubmitUpdateCourseForm:', res.data)

            })

            .catch(res => {

                console.log('onSubmitUpdateCourseForm--error: ', res);
            })

    }
    //------------------------------------
    const onHandleInputChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
        if (e.target.name == 'description') {
            e.target.style.height = "1px";
            e.target.style.height = (e.target.scrollHeight) + "px";
        }
    }
    const onSubmitAddChapterForm = async (e) => {
        e.preventDefault()
        let formData = new FormData()

        // Object.entries(inputData).forEach((input, index) => console.log(input, index))
        formData.append('course', clickedCourse?.course?.id)
        Object.entries(inputData).forEach((input, index) => formData.append(input[0], input[1]))
        console.log('------------- onSubmitAddCourseForm--:', formData)
        await axios({
            method: 'POST',
            url: axios.defaults.baseURL + '/api/chapters/',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                // --- Reset input fields. ---
                setInputData({ name: '', description: '' })

                // --------------------------------------------------------
                const chapterListSequence = clickedCourse?.course?.chapter_list_sequence
                const seqChapterData = { "chapter_list_sequence": {} }
                let maxVal = -1
                if (chapterListSequence) {
                    // -- Copy all current courseID:order into seqChapterData{}. --
                    Object.keys(chapterListSequence)
                        .forEach(key => {
                            const val = Number(chapterListSequence[key])
                            seqChapterData.chapter_list_sequence[key] = Number(val)
                            maxVal = (maxVal > val) ? maxVal : val
                        })
                    // -- Add new key:value pair which is created by new one. --
                    seqChapterData.chapter_list_sequence[String(res.data.id)] = Number(maxVal + 1)
                }
                else {
                    seqChapterData.chapter_list_sequence[String(res.data.id)] = Number(1)
                }
                // console.log('  ----seqChapterData---', seqChapterData, ', after added new chapter: ', res.data)
                // --------------------------------------------------------
                updateCourseChapterSequence(seqChapterData)
                // fileRef.current.value = "";//Resets the file name of the file input 
                // fetchChapters('', clickedCourse?.course)

                setIsChapterUpdated(true)
                setClickedAddChapter(false)
                setOperateChapter(true)

                dispatch(setPathChapterID(res.data.id))
                dispatch(setPathContentID(null))

                // setUploadSuccess(true)
                // handleSuccessUploadingChapter(true, res.data.id, res.data.category, res.data.teacher)
                // console.log('onSubmitAddChapterForm:', res)

            })

            .catch(res => { console.log('onSubmitAddChapterForm--error: ', res); })

    }
    const funcSetCreateMode = (state) => {
        // console.log('funcSetCreateMode: ', state)
        setIsCreateContentMode(state)
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
                setInputData({ name: '', description: '' })
                setIsChapterUpdated(true)
                setClickedUpdateChapter(false)
                fetchChapters('', clickedCourse?.course)
                setToggleRefresh(!toggleRefresh)
                console.log('onSubmitUpdateChapterForm:', res)

            })

            .catch(res => { console.log('onSubmitUpdateChapterForm--error: ', res); })
    }
    /**
     * -------------------------------------------------------------------------------------
     */
    // useEffect(() => {
    //     fetchChapters('refresh', clickedCourse?.course)
    // }, [clickedCourse?.course?.id])
    useEffect(() => {
        if (operationStage == 'delete') {
            setOperationStage('')
        }
        else {

            fetchChapters('', clickedCourse?.course)
        }
    }, [clickedCourse?.course?.chapter_list_sequence])


    // useEffect(() => {
    //     // setClickedChapter(null)
    //     // fetchChapters('refresh')
    //     console.log('useEffect - 1. AddChapter->fetchChapters', ', course_id:', clickedCourse?.course?.id, ', chapterLists-', chapterLists, ', operateChapter-', operateChapter)
    // }, [isChapterUpdated,])

    useEffect(() => {
        // console.log('useEffect - 2. AddChapter->fetchChapters', ', course_id:', clickedCourse?.course?.id)
    }, [chapterUpdatedStatus], toggleRefresh)

    useEffect(() => {
        // setIsChapterUpdated(false)
        setClickedChapter(null)
        dispatch(setContentAction([]))
        if (chapterLists?.length > 0) {

            const foundChapter = chapterLists.filter(chapter => chapter.id == pathID?.chapterID)
            if (foundChapter.length == 1) initSelectChapter(foundChapter[0])
            else initSelectChapter(chapterLists[0])
        }


        // console.log('useEffect - 3. AddChapter->chapterLists: setClickedChapter-pathID?.chapterID', pathID?.chapterID)
    }, [isCompleteFetchChapter, updateRender])

    useEffect(() => {

        // console.log('useEffect - inputData:', inputData)
        // contentFileRef && contentFileRef.current.files[0].name
    }, [inputData])


    useEffect(() => {

        setClickedAddChapter(false)
        setClickedUpdateChapter(false)
        setOperateChapter(true)
    }, [clickedCourse])

    useEffect(() => {

    }, [clickedUpdateChapter, clickedAddChapter, isCreateContentMode, isPreViewMode, clickedChapter])


    const textAreaAdjust = (e) => {
        // console.log('testAreaAdjust: ', e)
        e.target.style.height = "1px";
        e.target.style.height = (e.target.scrollHeight) + "px";
    }

    /** -- When clicked on the chapter it triggers useEffect [clickedChapter].-- */
    // useEffect(() => {
    //     console.log('useEffect - 4. AddChapter->clickedChapter: ', clickedChapter, ', clickedContent: ', clickedContent, ' end')

    //     setClickedAddChapter(false)
    //     setClickedUpdateChapter(false)
    //     setOperateChapter(true)

    // }, [clickedChapter])

    useEffect(() => {


        // console.log('useEffect - pathID:', pathID, ', chapterLists:', chapterLists)
    }, [chapterLists])

    // console.log('<<<< refreshed in AddChapter - contentAction', contentAction, ', chapterLists:', chapterLists)
    // ----------------------------------------------------
    return (
        <div className='add_chapter__view'>
            <h2 id='id_edit_chapter'> Chapter Modifier </h2>
            <div className={`add_chapter__component`}>
                <div className='chapters_view'>
                    {/* -- Display chapter Header Bar. --- */}
                    <div className='title'>
                        <div><span className='t1'>Manage Chapters</span> On<span className='t2'>{clickedCourse?.course?.title}</span> Course</div>
                        <div className='svg_icon'>
                            {/* -- delete sign -- */}
                            {(chapterLists?.length > 0 && operateChapter) && <svg onClick={e => handleDeleteChapter(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.3 20.5q-.75 0-1.275-.525Q5.5 19.45 5.5 18.7V6h-1V4.5H9v-.875h6V4.5h4.5V6h-1v12.7q0 .75-.525 1.275-.525.525-1.275.525ZM17 6H7v12.7q0 .125.088.213.087.087.212.087h9.4q.1 0 .2-.1t.1-.2ZM9.4 17h1.5V8H9.4Zm3.7 0h1.5V8h-1.5ZM7 6V19v-.3Z" /></svg>}
                            {/* -- edit sign -- */}
                            {(chapterLists?.length > 0 && operateChapter) && <svg onClick={e => handleUpdateChapter(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.15 19H6.4l9.25-9.25-1.225-1.25-9.275 9.275Zm13.7-10.35L15.475 5.3l1.3-1.3q.45-.425 1.088-.425.637 0 1.062.425l1.225 1.225q.425.45.45 1.062.025.613-.425 1.038Zm-1.075 1.1L7.025 20.5H3.65v-3.375L14.4 6.375Zm-2.75-.625-.6-.625 1.225 1.25Z" /></svg>}


                            {/* //close add - sign  */}
                            {!operateChapter && <svg id='id_plus_sign' onClick={e => handleClickCloseChapter(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.25 12.75v-1.5h13.5v1.5Z" /></svg>}

                            {/* //add expend + sign */}
                            {operateChapter && <svg id='id_plus_sign' onClick={e => handleAddChapter(e,)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.25 16.75h1.5v-4h4v-1.5h-4v-4h-1.5v4h-4v1.5h4ZM5.3 20.5q-.75 0-1.275-.525Q3.5 19.45 3.5 18.7V5.3q0-.75.525-1.275Q4.55 3.5 5.3 3.5h13.4q.75 0 1.275.525.525.525.525 1.275v13.4q0 .75-.525 1.275-.525.525-1.275.525Zm0-1.5h13.4q.1 0 .2-.1t.1-.2V5.3q0-.1-.1-.2t-.2-.1H5.3q-.1 0-.2.1t-.1.2v13.4q0 .1.1.2t.2.1ZM5 5v14V5Z" /></svg>}
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

                        {chapterLists?.map((chapter) => {
                            return <div key={chapter.id} className={`chapter_lists ${chapter.id}`} onClick={e => handleClickChapter(e, chapter.id)}>
                                <div><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M9 19.225q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm6 0q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm-6-6q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm6 0q-.5 0-.863-.362-.362-.363-.362-.863t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.863q-.363.362-.863.362Zm-6-6q-.5 0-.863-.363Q7.775 6.5 7.775 6t.362-.863Q8.5 4.775 9 4.775t.863.362q.362.363.362.863t-.362.862Q9.5 7.225 9 7.225Zm6 0q-.5 0-.863-.363-.362-.362-.362-.862t.362-.863q.363-.362.863-.362t.863.362q.362.363.362.863t-.362.862q-.363.363-.863.363Z" /></svg></div>
                                <div >
                                    {chapter?.name}
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
                {chapterLists?.length > 0 && <AddContent funcSetCreateMode={funcSetCreateMode} teacherId={teacherId} />}


            </div >
            {/* -------Preview-------- */}
            <div className='preview__layout'>
                <div className='preview__control'>

                    <h3>Preview Content</h3>
                    {/* Visibility Off */}
                    {!isPreViewMode && <svg onClick={e => setIsPreViewMode(true)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M15.775 12.975 14.65 11.85q.225-1.25-.712-2.237Q13 8.625 11.65 8.85l-1.125-1.125q.35-.15.7-.225.35-.075.775-.075 1.7 0 2.887 1.188Q16.075 9.8 16.075 11.5q0 .425-.075.787-.075.363-.225.688Zm3.175 3.1-1.1-1.025q.95-.725 1.688-1.588.737-.862 1.262-1.962-1.25-2.525-3.588-4.013Q14.875 6 12 6q-.725 0-1.425.1-.7.1-1.375.3L8.025 5.225q.95-.375 1.938-.55Q10.95 4.5 12 4.5q3.525 0 6.35 1.938 2.825 1.937 4.1 5.062-.55 1.35-1.425 2.512-.875 1.163-2.075 2.063Zm.8 5.8-4.025-4.025q-.775.3-1.712.475-.938.175-2.013.175-3.525 0-6.338-1.938Q2.85 14.625 1.55 11.5q.55-1.325 1.425-2.475Q3.85 7.875 4.9 7.05l-2.775-2.8 1.05-1.075 17.65 17.65ZM5.95 8.1q-.8.625-1.537 1.513Q3.675 10.5 3.2 11.5q1.25 2.525 3.587 4.012Q9.125 17 12 17q.675 0 1.35-.113.675-.112 1.15-.237l-1.25-1.3q-.275.1-.6.162-.325.063-.65.063-1.7 0-2.887-1.188Q7.925 13.2 7.925 11.5q0-.3.063-.638.062-.337.162-.612Zm7.575 2.625Zm-3.3 1.65Z" /></svg>}
                    {/* Visibility On */}
                    {isPreViewMode && <svg onClick={e => setIsPreViewMode(false)} xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.575q1.7 0 2.887-1.188 1.188-1.187 1.188-2.887t-1.188-2.887Q13.7 7.425 12 7.425T9.113 8.613Q7.925 9.8 7.925 11.5t1.188 2.887Q10.3 15.575 12 15.575Zm0-1.375q-1.125 0-1.912-.788Q9.3 12.625 9.3 11.5t.788-1.913Q10.875 8.8 12 8.8t1.913.787q.787.788.787 1.913t-.787 1.912q-.788.788-1.913.788Zm0 4.3q-3.45 0-6.287-1.9-2.838-1.9-4.163-5.1 1.325-3.2 4.163-5.1Q8.55 4.5 12 4.5q3.45 0 6.288 1.9 2.837 1.9 4.162 5.1-1.325 3.2-4.162 5.1Q15.45 18.5 12 18.5Zm0-7Zm0 5.5q2.825 0 5.188-1.488Q19.55 14.025 20.8 11.5q-1.25-2.525-3.612-4.013Q14.825 6 12 6 9.175 6 6.812 7.487 4.45 8.975 3.2 11.5q1.25 2.525 3.612 4.012Q9.175 17 12 17Z" /></svg>}

                </div>
                {isPreViewMode && <div >
                    <PreviewContent contentAction={contentAction} clickedContentId={clickedContent?.id} isCreateContentMode={isCreateContentMode} />
                </div>}
            </div>
        </div >
    )
}

export default AddChapter