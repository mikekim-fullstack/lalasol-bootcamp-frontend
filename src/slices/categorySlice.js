import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    initialState: { cats: null },//{selectedId,lists}
    name: 'category',
    reducers: {
        setCat: (state, action) => {
            state.cats = action.payload
            // console.log('categorySlice-state.cat: ', state.cats)
        },

        setSelCatStatus: (state, action) => {
            state.selCatStatus = action.payload // true/false
        }

    }

})
export default categorySlice.reducer

export const { setCat, setSelCatStatus } = categorySlice.actions
export const getCats = state => state.category.cats
export const getCurrentCat = state => state.category.cats && Object.entries(state.category.cats.lists)
    .filter(([key, cat]) => {
        // console.log('getCurrentCat-slice: ', state.category.cats.selectedId, cat.id)
        return (parseInt(state.category.cats.selectedId) === parseInt(cat.id))
    })
export const getCatIdByName = (state, catName) => state.category.cats && Object.entries(state.category.cats.lists)
    .filter(([key, cat]) => cat.title === catName)

export const getSelCatStatus = (state) => state.category.selCatStatus
