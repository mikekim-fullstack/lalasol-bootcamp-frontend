import React, { useState, useEffect } from 'react'
import './NavCategories.css'
import { useDispatch, useSelector } from 'react-redux'
import { setCat, setCurrentCat, getCurrentCat } from '../slices/categorySlice'
import { setCourses } from '../slices/courseSlice'
import { getUser } from '../slices/userSlices'
import useAxios from '../useAxios'
import axios from 'axios'
const NavCategoreis = () => {
    const user = useSelector(getUser)
    const selectedCat = useSelector(getCurrentCat)
    const [sortedCat, setSortedCat] = useState(null)
    const [categories, catError, catLoading] = useAxios({
        method: 'GET',
        url: '/api/course-category/',
        headers: {
            'Content-Type': 'Application/Json'
        },

    })
    // const [categories, setCategories]=useState([])
    // const categories = ['HTML', 'CSS', 'JavaScript', 'Data Structure', 'ReactJS', 'Practices', 'General', 'HR']
    // const categories = [
    //     {
    //         "id": 1,
    //         'order': 8,
    //         "title": "HR",
    //         "description": "HR Category"
    //     },
    //     {
    //         "id": 2,
    //         'order': 7,
    //         "title": "General",
    //         "description": "General Category"
    //     },
    //     {
    //         "id": 9,
    //         'order': 6,
    //         "title": "Practices",
    //         "description": "ReactJS Category"
    //     },
    //     {
    //         "id": 3,
    //         'order': 5,
    //         "title": "ReactJS",
    //         "description": "ReactJS Category"
    //     },
    //     {
    //         "id": 4,
    //         'order': 4,
    //         "title": "Data Structure",
    //         "description": "Data Structure Category"
    //     },
    //     {
    //         "id": 5,
    //         'order': 3,
    //         "title": "JavaScript",
    //         "description": "JavaScript Cagtegory"
    //     },
    //     {
    //         "id": 6,
    //         'order': 2,
    //         "title": "CSS",
    //         "description": "CSS Category"
    //     },
    //     {
    //         "id": 8,
    //         'order': 1,
    //         "title": "HTML",
    //         "description": "HTML Category"
    //     }
    // ]
    // ++ Output from sort ++
    //- id: category[0]
    //- title: category[1]
    // const sortedCat = Object.entries(categories)
    //     .sort(([, a], [, b]) => (a.order - b.order)) // ascending by order
    //     .map(([key, value_cat]) => [value_cat.id, value_cat.title])
    // console.log('sorted: ', sortedCat)

    const dispatch = useDispatch()
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
            })
            .catch(err => console.log('error: ', err))
    }
    const handleSelectCategoryClick = (e) => {
        const selectedCat = sortedCat[e.target.name]
        // console.log('selectedCat: ', sortedCat, selectedCat)

        // -- For letting the submenu(sideBar) to only show the subject lists not showing 
        //    previous items of selected subject. --
        dispatch(setCurrentCat({ id: selectedCat[0], title: selectedCat[1], status: true }))
        fetchEnrolledCourses(user.id, selectedCat[0])
        /*
        console.log('selected Cat: ', e.target.name, categories, categories[0].title)
        dispatch(setCat({ selectedId: e.target.name, lists: categories }))

        // -- For letting the submenu(sideBar) to only show the subject lists not showing 
        //    previous items of selected subject. --
        // dispatch(setSelCatStatus({...selectedCat,status:true}))
        // dispatch(setSelCatStatus({ id: e.target.name, title: categories[0][1].title, status: true }))
        
        */

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
            {sortedCat?.map((category, index) => <button key={category[0]} className='nav__btn_category' onClick={handleSelectCategoryClick} name={index} dangerouslySetInnerHTML={{ __html: (category[1].replace(' ', '&nbsp;')) }}></button>)}
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