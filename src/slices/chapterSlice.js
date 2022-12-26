import { createSlice } from "@reduxjs/toolkit"



const chapterSlice = createSlice({
    initialState: {
        data: null,
        lists: null,
        clickedChapter: null,
        category: null,
        clickedContent: null,
        contentActionList: [],
        chapterUpdated: false,
        backupContentAction: [],
    },
    name: 'chapters',
    reducers: {

        setChapterLists: (state, action) => {
            // console.log('setChapterList: ', action.payload)
            state.lists = action.payload
        },
        setChapters: (state, action) => {

            const chapters = action.payload?.res_data
            const seq = action.payload?.chapter_list_sequence

            // console.log('setChapter-slice:', action.payload, chapters, seq)
            const sortedChapters = []

            // --- sort chapters by chapter_no in the ascending order. --- 
            // const seq = action.payload.content_list_sequence
            if (chapters && chapters.length > 0) {
                if (seq) {
                    const sortedSeqKeys = Object.keys(seq).sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)

                    sortedSeqKeys?.forEach(key => {
                        const foundChapter = chapters.filter(chapter => chapter.id == Number(key))
                        foundChapter.length == 1 && sortedChapters.push(foundChapter[0])
                    })
                    state.data = sortedChapters
                    // console.log('sortedChapters: ', sortedChapters)
                }
                else {
                    state.data = chapters
                }
            }
            else {
                state.data = null
            }


        },
        setClickedChapter: (state, action) => {
            if (action.payload == null) return
            state.clickedChapter = action.payload
            /** --1. Populate content array to store the status of action for content history-- */
            const contentList = []
            const seq = action.payload.content_list_sequence


            if (action.payload?.content.length > 0) {
                if (seq) {
                    const sortedSeqKeys = Object.keys(seq).sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)

                    sortedSeqKeys?.forEach(key => {
                        const foundContentItem = action.payload?.content.filter(content => content.id == Number(key))
                        if (foundContentItem.length == 1) {
                            const item = {}
                            Object.keys(foundContentItem[0]).map(key => {
                                if (key != 'created_date') item[key] = foundContentItem[0][key]
                            })
                            item['action'] = ''

                            contentList.push(item)
                        }

                    })
                }
                else {
                    for (const contentItem of action.payload?.content) {
                        // console.log('contentItem: ', contentItem)
                        const item = {}
                        Object.keys(contentItem).map(key => {
                            if (key != 'created_date') item[key] = contentItem[key]
                        })
                        item['action'] = ''
                        contentList.push(item)
                    }
                }

                /*
                
                */
                state.contentActionList = contentList
            }
            else {
                state.contentActionList = null
            }
            // console.log('slice - setClickedChapter: ', action.payload, ', ', contentList,)
        },
        setChapterCategory: (state, action) => {
            state.category = action.payload
        },
        setClickedContent: (state, action) => {
            state.clickedContent = action.payload
            // console.log('::slice - set Clicked Content: ', action.payload)
        },
        setContentAction: (state, action) => {
            state.contentActionList = action.payload
            // console.log('slice - setContentAction: ', action.payload)
        },
        resetContentAction: (state, action) => {
            // console.log('slice - setClickedChapter: ', action.payload)
            /** --1. Populate content array to store the status of action for content history-- */
            const contentList = []
            if (state.clickedChapter?.content.length > 0) {

                for (const contentItem of state.clickedChapter?.content) {
                    // console.log('contentItem: ', contentItem)
                    const item = {}
                    Object.keys(contentItem).map(key => {
                        if (key != 'created_date') item[key] = contentItem[key]
                    })
                    item['action'] = ''
                    contentList.push(item)
                }
                state.contentActionList = contentList
            }
            else state.contentActionList = null
        },
        setBackupContentAction: (state, action) => {
            state.backupContentAction?.splice(0, state.backupContentAction?.length)
            state.contentActionList?.forEach(contentItem => {

                const item = {}
                Object.keys(contentItem).map(key => {
                    item[key] = contentItem[key]
                })

                // contentItem.push(item)
                state.backupContentAction.push(item)
            })
        },
        setRestoreContentAction: (state, action) => {
            if (state.contentActionList.length < 1) return
            state.contentActionList.splice(0, state.contentActionList.length)
            state.backupContentAction.forEach(contentItem => {
                const item = {}
                Object.keys(contentItem).map(key => {
                    item[key] = contentItem[key]
                })

                // contentItem.push(item)
                state.contentActionList.push(item)
            })
        },
        createContentAction: (state, action) => {

            // -- action.payload { catId:'', createrId:'', type:'', data:'', } --
            const newItem = {}
            newItem['id'] = 0
            newItem['chapter_category'] = action.payload.catId
            newItem['creater'] = action.payload.creater
            newItem['text'] = null
            newItem['file'] = null
            newItem['url'] = null
            newItem['action'] = 'created'
            newItem['content_no'] = 0
            newItem[action.payload.type] = action.payload.data

            // -- Find max id and max content_no, and then increase value by one. --
            // console.log('----Slice createContentAction----', state.contentActionList, newItem)
            let hasNewContent = false
            let _newContentActionList = []
            if (state.contentActionList) {
                // console.log('----Slice createContentAction----')
                let maxId = 0
                let maxNo = 0

                state.contentActionList.forEach(item => {

                    if (item.action == 'created') {
                        hasNewContent = true
                        _newContentActionList.push(newItem)
                    }
                    else {
                        _newContentActionList.push(item)
                    }
                    maxId = item.id >= maxId ? item.id : maxId
                    maxNo = item.content_no >= maxNo ? item.content_no : maxNo
                })
                if (!hasNewContent) {
                    newItem['id'] = maxId + 1
                    newItem['content_no'] = maxNo + 1
                    _newContentActionList.push(newItem)
                }


            }
            else {// -- null case (no content)
                newItem['id'] = 1
                newItem['content_no'] = 1
                _newContentActionList.push(newItem)
            }
            state.contentActionList = _newContentActionList
            // console.log('slice - createContentAction: _newContentActionList: ', _newContentActionList)

        },
        deleteContentAction: (state, action) => {
            // state.contentActionList = state.contentActionList.filter(item => item.id != action.payload)
            state.contentActionList = state.contentActionList.map(item => {
                if (item.id == action.payload) {
                    item.action = 'deleted'
                }
                return item
            })
        },
        deleteContentAddAction: (state) => {
            // state.contentActionList = state.contentActionList.filter(item => item.id != action.payload)
            state.contentActionList = state.contentActionList?.filter(item => item.action != 'created')
        },
        updateContentActionById: (state, action) => {
            // {id:'',catId='', type:'', data:''}
            // action.payload.id, action.payload.action
            // action: delete, updated,created
            state.contentActionList = state.contentActionList?.map(item => {
                if (item.id == action.payload.id) {
                    item.action = 'updated'
                    item.file = ''
                    item.url = ''
                    item.text = ''
                    item.image = ''
                    item.code = ''
                    item.title = ''
                    item[action.payload.type] = action.payload.data
                    // console.log('slice -- action.payload.type: ', action.payload.type)
                    item.chapter_category = action.payload.catId
                }
                return item
            })
            // if (item) {
            //     console.log('slice - updateContentActionById: ', item, ', input:', action.payload)
            //     item.action = 'updated'
            //     item[action.payload.type] = action.payload.data

            // }
            // console.log('slice - setClickedChapter: ', action.payload)
        },
        setChapterUpdatedStatus: (state, action) => {
            state.chapterUpdated = !state.chapterUpdated
        },

    }
})


export default chapterSlice.reducer

export const { setChapters, setClickedChapter,
    setClickedContent, setChapterCategory,
    resetContentAction, updateContentActionById,
    deleteContentAction, createContentAction,
    setContentAction, deleteContentAddAction,
    setChapterUpdatedStatus,
    setBackupContentAction,
    setRestoreContentAction,
    setChapterLists,
} = chapterSlice.actions
export const getChapterLists = (state) => state.chapters.lists
export const getChapters = (state) => state.chapters.data
export const getChapter = (state, id) => {
    if (state.chapters?.data) {
        const chapter = state.chapters.data?.filter(data => data.id == id)
        // console.log('slice -- getChapter: ', id, state.chapters.data, chapter)
        if (chapter.length == 1) return chapter[0]
        else return null
    }
    return null
}
export const getClickedChapter = (state) => state.chapters.clickedChapter
export const getChapterCategory = (state) => state.chapters.category
export const getClickedContent = (state) => state.chapters.clickedContent
export const getContentAction = (state) => state.chapters.contentActionList
export const getChapterUpdatedStatus = (state) => state.chapters.chapterUpdated
export const getContentActionById = (state, id) => state.chapters.contentActionList.filter(item => item.id == id)



