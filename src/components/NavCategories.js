import React, { useState, useEffect } from 'react'
import './NavCategories.css'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { setAllCategories, setSelectedCat, getSelectedCat, setCat, setSelectedCatStatus } from '../slices/categorySlice'
import { setPathCatID, resetPathAll, getPathCatID, getPathID } from '../slices/pathSlice'
import { setCourses, setCoursesEnrolledStatus, } from '../slices/courseSlice'
import { setChapters, getChapters, setChapterCategory } from '../slices/chapterSlice'
import { getUser } from '../slices/userSlices'
import useAxios from '../useAxios'
import axios from 'axios'
import { Sync } from '@mui/icons-material'

const NavCategoreis = () => {
    const [pathCatID, courseID, chapterID] = useSelector(getPathID)
    const user = useSelector(getUser)
    // const pathCatID = useSelector(getPathCatID)
    // const sel = useSelector(state => { console.log('test'); return state.category.data; }, shallowEqual)
    const [sortedCat, setSortedCat] = useState(null)
    const dispatch = useDispatch()
    const chapters = useSelector(getChapters)
    const selectedCat = useSelector(getSelectedCat)

    const [categories, catError, catLoading] = useAxios({
        method: 'GET',
        url: '/api/course-category/',
        headers: {
            'Content-Type': 'Application/Json'
        },

    })
    const [coursesEnrolled, coursesEnrolledError, coursesEnrolledLoading] = useAxios({
        method: 'GET',
        url: `/api/courses-enrolled-status/${user?.id}`,
        headers: {
            'Content-Type': 'Application/Json'
        },
    })

    const fetchChapterCateory = async () => {
        await axios({
            method: 'GET',
            url: axios.defaults.baseURL + '/api/chapter-category/',
            headers: {
                'Content-Type': 'Application/Json'
            }
        })
            .then(res => dispatch(setChapterCategory(res.data)))
            .catch(e => console.log('fetchChapterCategory-Error:', e))
    }

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
                // console.log('--fetchEnrolledCourses:', res.data)
                const _courses = [...res.data]
                const _sortedCourses = _courses?.sort((a, b) => a.course_no > b.course_no ? 1 : a.course_no < b.course_no ? -1 : 0)
                dispatch(setCourses(_sortedCourses))
                // console.log('done:', _sortedCourses)

                // dispatch(setCourses(res.data))
                console.log('done-NavCategories:', _sortedCourses)
            })
            .catch(err => console.log('error: ', err))
    }

    const updateCategory = async (catId, cat) => {
        await fetchEnrolledCourses(user.id, catId)

        dispatch(setSelectedCat(cat))
        dispatch(setPathCatID(catId))

    }
    const selectCategory = async (_sortedCat, openSideMenu = true) => {
        // const _sortedCat = sortedCat[cat_id]
        // console.log('handleSelectCategoryClick: ', _sortedCat)

        // -- For letting the submenu(sideBar) to only show the subject lists not showing 
        //    previous items of selected subject. --
        const catId = _sortedCat[0]
        const catTitle = _sortedCat[1]
        await fetchEnrolledCourses(user.id, catId)

        dispatch(setSelectedCat(_sortedCat))
        openSideMenu && dispatch(setSelectedCatStatus(true))
        dispatch(resetPathAll())
        dispatch(setPathCatID(catId))
        dispatch(setChapters(null))
    }
    const handleSelectCategoryClick = (e) => {
        selectCategory(sortedCat[e.target.name])

    }
    useEffect(() => {
        if (user && user.id) {

        }
    }, [user])
    useEffect(() => {
        if (categories != null) {
            dispatch(setAllCategories(categories))
            const _sortedCat = Object.entries(categories)
                .sort(([, a], [, b]) => (a.order - b.order)) // ascending by order
                .map(([key, value_cat]) => [value_cat.id, value_cat.title, value_cat.description, , { 'course_list_sequence': value_cat.course_list_sequence }])
            console.log('-----_sortedCat----:', _sortedCat)
            dispatch(setCat(_sortedCat))
            setSortedCat(_sortedCat)
            if (pathCatID && courseID && chapterID) {
                const _selectedCat = _sortedCat.filter((cat) => cat[0] == pathCatID)
                // console.log('-----_sortedCat----:', _sortedCat, selectedCat)
                updateCategory(pathCatID, _selectedCat[0])
            }
            console.log('-- pathCatID', pathCatID, typeof (pathCatID), ', end')

            // -- Initially after user login, by default select the first category. ---
            if (typeof (pathCatID) == 'undefined') {
                console.log('No pathCatId: ')
                selectCategory(_sortedCat[0], false)
            }
            else if (selectedCat == null) {

                const _selectedCat = _sortedCat.filter((cat) => cat[0] == pathCatID)[0]
                selectCategory(_selectedCat, false)
                console.log('Yes pathCatId: ', _selectedCat)
            }

        }
        fetchChapterCateory()
        console.log('-----Nav Path----:', pathCatID, courseID, chapterID)
    }, [categories])

    const getSortedCourseID = (catID) => {
        const course_list_sequence = categories.filter(cat => cat[0] == catID)[0][4].course_list_sequence
        if (course_list_sequence == null) return null
        const courseIDKey = Object.keys(course_list_sequence).sort((a, b) => course_list_sequence[a] > course_list_sequence[b] ? 1
            :
            course_list_sequence[a] < course_list_sequence[b] ? -1 : 0)
        return courseIDKey // output: sorted keys in array sequence. e.g. courseIDKey[0]=='courseid'
    }

    useEffect(() => {
        console.log('NavCategores-useEffect-coursesEnrolled:', coursesEnrolled, ', categories: ', categories)
        // if (categories == null) return
        // const tmp = [...categories]
        // const sss = tmp?.sort((a, b) => a.id > b.id ? 1 : a.id < a.id ? -1 : 0)
        // console.log('tmp:', sss)
        /*
        const _coursesEnrolled = []
        categories?.sort((a, b) => a.id > b.id ? 1 : a.id < a.id ? -1 : 0)
            .forEach(cat => {
                // const r = getSortedCourseID(cat.id)
                const seq = cat.course_list_sequence
                console.log('catID:', cat.id, ', seq: ', seq)
                let keyCourseID = null
                if (seq) {
                    keyCourseID = Object.keys(seq).sort((k1, k2) => seq[k1] > seq[k2] ? 1 : seq[k1] < seq[k2] ? -1 : 0)
                    console.log('keyCourseID: ', keyCourseID)
                }
                if (seq != null && keyCourseID != null) {
                    for (let i = 0; i < keyCourseID.length; i++) {

                        const res = coursesEnrolled.filter(course => (course.category == cat.id && course.id == Number(keyCourseID[i])))[0]
                        console.log('newCourse: ', res)
                        _coursesEnrolled.push(res)
                    }

                }
                else {
                    const res = coursesEnrolled.filter(course => (course.category == cat.id))
                    res.forEach(course => _coursesEnrolled.push(course))

                }
            })
            console.log('_coursesEnrolled: ', _coursesEnrolled)
            */
        // dispatch(setCoursesEnrolledStatus(coursesEnrolled))
        if (categories && coursesEnrolled)
            dispatch(setCoursesEnrolledStatus({ 'categories': categories, 'courses': coursesEnrolled }))
    }, [coursesEnrolled])

    useEffect(() => {

        console.log('selectedCat: ', selectedCat)
    }, [selectedCat])
    /*
    // //-- Detect Window is refreshed. --
    useEffect(() => {

        window.onbeforeunload = (event) => {
            const e = event || window.event;
            // Cancel the event
            console.log('------onbeforeunload------')
            e.preventDefault();
            if (e) {
                e.returnValue = ''; // Legacy method for cross browser support
            }
            return ''; // Legacy method for cross browser support
        };

    }, []);
    const alertUser = (e) => {
        e.preventDefault();
        e.returnValue = "";
        // console.log('selectedCat: ', selectedCat)
        dispatch(setSelectedCatStatus(false))
    };
*/
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