import React, { useState, useEffect } from 'react'
import './NavCategories.css'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { setSelectedCat, setSelectedCatStatus } from '../slices/categorySlice'
import { setPathCatID, getPathCatID } from '../slices/pathSlice'
import { setCourses } from '../slices/courseSlice'
import { setChapters, getChapters } from '../slices/chapterSlice'
import { getUser } from '../slices/userSlices'
import useAxios from '../useAxios'
import axios from 'axios'
import { Sync } from '@mui/icons-material'
const NavCategoreis = () => {
    const user = useSelector(getUser)
    const pathCatID = useSelector(getPathCatID)
    // const sel = useSelector(state => { console.log('test'); return state.category.data; }, shallowEqual)
    const [sortedCat, setSortedCat] = useState(null)
    const dispatch = useDispatch()

    const [categories, catError, catLoading] = useAxios({
        method: 'GET',
        url: '/api/course-category/',
        headers: {
            'Content-Type': 'Application/Json'
        },

    })

    const fetchEnrolledCourses = async (userId, selectedCatId) => {
        console.log('user info:', process.env.REACT_APP_DEBUG, process.env.REACT_APP_BASE_URL, userId, selectedCatId)
        // await axios.get(process.env.REACT_APP_BASE_URL + `/api/course/${subjectId}`,

        await axios.get(axios.defaults.baseURL + `/api/student-course-enrollment/${userId}/${selectedCatId}`,
            {
                headers: {
                    "Content-type": "Application/Json",
                }
            }
        )
            .then(res => {
                // console.log(res.data)
                dispatch(setCourses(res.data))
                console.log('done')
            })
            .catch(err => console.log('error: ', err))
    }


    const handleSelectCategoryClick = async (e) => {
        const _sortedCat = sortedCat[e.target.name]
        console.log('handleSelectCategoryClick: ', _sortedCat)

        // -- For letting the submenu(sideBar) to only show the subject lists not showing 
        //    previous items of selected subject. --
        const catId = _sortedCat[0]
        const catTitle = _sortedCat[1]
        await fetchEnrolledCourses(user.id, catId)

        dispatch(setSelectedCat(_sortedCat))
        dispatch(setSelectedCatStatus(true))
        dispatch(setPathCatID(catId))
        dispatch(setChapters(null))

    }

    useEffect(() => {
        if (categories != null) {

            const _sortedCat = Object.entries(categories)
                .sort(([, a], [, b]) => (a.order - b.order)) // ascending by order
                .map(([key, value_cat]) => [value_cat.id, value_cat.title])
            setSortedCat(_sortedCat)
            // console.log('-----_sortedCat----:', _sortedCat)

        }
    }, [categories])


    return (
        <div className='nav__categories'>
            {sortedCat?.map((category, index) => {
                // console.log(category)
                return <button key={category[0]}
                    // className={`nav__btn_category btn_selected`}
                    className={`nav__btn_category ${pathCatID == category[0] && 'btn_selected'}`}
                    onClick={handleSelectCategoryClick}
                    name={index}
                    dangerouslySetInnerHTML={{ __html: (category[1].replace(' ', '&nbsp;')) }}>
                </button>
            })}
        </div>
    )
}

export default NavCategoreis


/*

const maxSpeed = {
    car: 300,
    bike: 60,
    motorbike: 200,
    airplane: 1000,
    helicopter: 400,
    rocket: 8 * 60 * 60
};
//String sorting decending order
// In the sorting([a,]) => select key
// In the sorting([,a]) => select value
Object.entries(maxSpeed)
    .sort(([a,],[b,]) => {
        console.log(a,b)
        const _a = a.toUpperCase()
        const _b = b.toUpperCase()
        if(_a>_b) return -1; // return 1; for ascending
        if(_a<_b) return 1; // return -1; for ascending
        if(_a===_b) return 0;
        
})
// ----  soring value ---- 
Object.entries(maxSpeed)
    .sort(([,a],[,b]) => {
        console.log(a,b)
        return a-b; // for ascending, b-s
        
})
*/