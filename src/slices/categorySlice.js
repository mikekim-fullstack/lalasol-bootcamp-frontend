import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    initialState: { cat: null },
    name: 'category',
    reducers: {
        setCat: (state, action) => {
            state.cat = action.payload
            console.log('state.cat: ', state.cat)
        }
    }
})
export default categorySlice.reducer

export const { setCat } = categorySlice.actions
export const selectCat = state => state.category.cat