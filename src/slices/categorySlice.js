import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    initialState: { cats: null, selectedCat: null, status: null },//{selectedId,lists}
    name: 'category',
    reducers: {
        setCat: (state, action) => {
            state.cats = action.payload
            // console.log('categorySlice-state.cat: ', state.cats)
        },

        setSelectedCat: (state, action) => {
            // console.log('categorySlice - setCurrentCat: ', action.payload)
            state.selectedCat = action.payload

        },
        setSelectedCatStatus: (state, action) => {
            // console.log('categorySlice - status: ', action.payload)
            state.status = action.payload // status: true/false

        },

    }

})
export default categorySlice.reducer

export const { setCat, setSelectedCat, setSelectedCatStatus } = categorySlice.actions

export const getCats = state => state.category.cats
export const getSelectedCat = (state) => {
    // console.log('-slice: getSelectedCat;', state.category.selectedCat)
    return state.category.selectedCat
}
export const getSelectedCatStatus = (state) => {
    // console.log('----slice: Status;', state.category.status)
    return state.category.status
}

// export const getCurrentCat = state => state.category.cats && Object.entries(state.category.cats.lists)
//     .filter(([key, cat]) => {
//         // console.log('getCurrentCat-slice: ', state.category.cats.selectedId, cat.id)
//         return (parseInt(state.category.cats.selectedId) === parseInt(cat.id))
//     })


// export const getCatIdByName = (state, catName) => state.category.cats && Object.entries(state.category.cats.lists)
//     .filter(([key, cat]) => cat.title === catName)


