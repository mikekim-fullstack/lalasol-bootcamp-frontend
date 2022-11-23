import { createSlice } from "@reduxjs/toolkit"

const chapterSlice = createSlice({
    initialState: { data: null, clickedChapter: null, category: null, clickedContent: null, contentActionList: [] },
    name: 'chapters',
    reducers: {
        setChapters: (state, action) => {
            // console.log('setChapter-slice:', action.payload)

            // --- sort chapters by chapter_no in the ascending order. --- 
            if (action.payload && action.payload.length > 1) {

                const unSortedChapters = action.payload
                state.data = unSortedChapters.sort((a, b) => a.chapter_no > b.chapter_no ? 1 : (a.chapter_no < b.chapter_no) ? -1 : 0)
            }
            else {
                state.data = action.payload
            }

        },
        setClickedChapter: (state, action) => {
            if (action.payload == null) return
            state.clickedChapter = action.payload
            /** --1. Populate content array to store the status of action for content history-- */
            const contentList = []
            if (action.payload?.content.length > 0) {

                for (const contentItem of action.payload?.content) {
                    console.log('contentItem: ', contentItem)
                    const item = {}
                    Object.keys(contentItem).map(key => {
                        if (key != 'created_date') item[key] = contentItem[key]
                    })
                    item['action'] = ''
                    contentList.push(item)
                }
                state.contentActionList = contentList
            }
            else {
                state.contentActionList = null
            }
            console.log('slice - setClickedChapter: ', action.payload, ', ', contentList)
        },
        setChapterCategory: (state, action) => {
            state.category = action.payload
        },
        setClickedContent: (state, action) => {
            state.clickedContent = action.payload
            console.log('::slice - set Clicked Content: ', action.payload)
        },
        setContentAction: (state, action) => {
            state.contentActionList = action.payload
            console.log('slice - setContentAction: ', action.payload)
        },
        resetContentAction: (state, action) => {
            // state.clickedContent = action.payload
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

        createContentAction: (state, action) => {

            // -- action.payload { catId:'', createrId:'', type:'', data:'', } --
            const newItem = {}
            newItem['id'] = 0
            newItem['chapter_category'] = action.payload.catId
            newItem['creater'] = action.payload.createrId
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
            console.log('slice - createContentAction: _newContentActionList: ', _newContentActionList)

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
            state.contentActionList = state.contentActionList.map(item => {
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

    }
})


export default chapterSlice.reducer

export const { setChapters, setClickedChapter,
    setClickedContent, setChapterCategory,
    resetContentAction, updateContentActionById,
    deleteContentAction, createContentAction,
    setContentAction, deleteContentAddAction,
} = chapterSlice.actions
export const getChapters = (state) => state.chapters.data
export const getChapter = (state, id) => {
    if (state.chapters?.data) {
        const chapter = state.chapters.data.filter(data => data.id == id)
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
export const getContentActionById = (state, id) => state.chapters.contentActionList.filter(item => item.id == id)



