import React, { useState, useEffect } from 'react'
import './NavCategories.css'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { setAllCategories, getAllCategories, setSelectedCat, getSelectedCat, setCat, setSelectedCatStatus } from '../slices/categorySlice'
import { setPathCatID, resetPathAll, getPathCatID, getPathID } from '../slices/pathSlice'
import { setCourses, setCoursesEnrolledStatus, } from '../slices/courseSlice'
import { setChapters, getChapters, setChapterCategory } from '../slices/chapterSlice'
import { getUser } from '../slices/userSlices'
import useAxios from '../useAxios'
import axios from 'axios'
import { Sync } from '@mui/icons-material'

const NavCategoreis = () => {
    // const [pathCatID, courseID, chapterID] = useSelector(getPathID)
    const pathID = useSelector(getPathID)
    const user = useSelector(getUser)
    // const pathCatID = useSelector(getPathCatID)
    // const sel = useSelector(state => { console.log('test'); return state.category.data; }, shallowEqual)
    const [sortedCat, setSortedCat] = useState(null)
    const dispatch = useDispatch()
    const chapters = useSelector(getChapters)
    const selectedCat = useSelector(getSelectedCat)
    const categories = useSelector(getAllCategories)

    const fetchAllCategories = async () => {
        const url = axios.defaults.baseURL + '/api/course-category/'
        await axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'Application/Json'
            },
        })
            .then(res => {
                dispatch(setAllCategories(res.data))
                // fetchAllCourses(res.data)
            })
            .catch(err => console.log('error: ' + axios.defaults.baseURL + '/api/course-category/', err))
    }
    const fetchAllCourses = async () => {
        const url = user.role == 'student' ? `/api/courses-enrolled-status/${user?.id}`
            : `/api/courses-all-by-teacher/${user?.id}`

        await axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'Application/Json'
            },
        })
            .then(res => {
                // console.log('--------- NavCategories - fetchAllCourses: categories', categories)
                dispatch(setCoursesEnrolledStatus({ 'categories': categories, 'courses': res.data }))
            })
            .catch(err => console.log('error: ' + axios.defaults.baseURL + '/api/course-category/', err))
    }

    const fetchEnrolledCourses = async (userId, selectedCatId) => {
        // console.log('user info:', process.env.REACT_APP_DEBUG, process.env.REACT_APP_BASE_URL, userId, selectedCatId)
        const url = user.role == 'student' ? `/api/student-course-enrollment/${userId}/${selectedCatId}`
            : `/api/courses-all-by-teacher-cat/${userId}/${selectedCatId}`
        await axios.get(url,
            {
                headers: {
                    "Content-type": "Application/Json",
                }
            }
        )
            .then(res => {
                const sortedCourses = []
                const seq = categories.filter(cat => cat.id == selectedCatId)[0].course_list_sequence
                // console.log('fetchEnrolledCourses:-seq: ', seq)
                if (seq && seq?.seq) {
                    // console.log('fetchEnrolledCourses:-seq: ', seq.seq)
                    seq.seq.forEach(key => {
                        const foundCourse = res.data.filter(course => course.id == Number(key))
                        if (foundCourse.length > 0) {
                            sortedCourses.push(foundCourse[0])
                        }
                    })
                }
                dispatch(setCourses(sortedCourses))
                // console.log('done-NavCategories:', sortedCourses)
            })
            .catch(err => console.log('error: ', err))
    }


    const fetchChapterCateory = async () => {
        await axios({
            method: 'GET',
            url: axios.defaults.baseURL + '/api/chapter-category/',
            headers: {
                'Content-Type': 'Application/Json'
            }
        })
            .then(res => {
                const _sortedChapterCat = res.data.sort((a, b) => a.seq_no > b.seq_no ? 1 : a.seq_no < b.seq_no ? -1 : 0)
                // console.log('_sortedChapterCat: ', _sortedChapterCat, res.data)
                dispatch(setChapterCategory(_sortedChapterCat))
            })
            .catch(e => console.log('fetchChapterCategory-Error:', e))
    }

    const updateCategory = async (catId, cat) => {
        await fetchEnrolledCourses(user.id, catId)

        dispatch(setSelectedCat(cat))
        dispatch(setPathCatID(catId))

    }
    const selectCategory = async (_sortedCat, openSideMenu = true) => {
        if (!_sortedCat) return
        // const _sortedCat = sortedCat[cat_id]
        // console.log('handleSelectCategoryClick: ', _sortedCat)

        // -- For letting the submenu(sideBar) to only show the subject lists not showing 
        //    previous items of selected subject. --
        const catId = _sortedCat[0]
        const catTitle = _sortedCat[1]
        await fetchEnrolledCourses(user.id, catId)

        dispatch(setSelectedCat(_sortedCat))
        openSideMenu && dispatch(setSelectedCatStatus(true))
        // dispatch(resetPathAll())
        dispatch(setPathCatID(catId))
        // dispatch(setChapters(null))
        dispatch(setChapters({ chapter_list_sequence: null, res_data: null }))

    }
    const handleSelectCategoryClick = (e) => {
        selectCategory(sortedCat[e.target.name])

    }

    useEffect(() => {

        // dispatch(setAllCategories(categories))
        fetchAllCategories()
    }, [])

    useEffect(() => {
        if (user && user.id) {

        }
    }, [user])

    useEffect(() => {
        if (categories != null) {
            fetchAllCourses(categories)
            const _sortedCat = Object.entries(categories)
                .sort(([, a], [, b]) => (a.order - b.order)) // ascending by order
                .map(([key, value_cat]) => [value_cat.id, value_cat.title, value_cat.description, , { 'course_list_sequence': value_cat.course_list_sequence?.seq }])
            // console.log('-----_sortedCat----:', _sortedCat)
            dispatch(setCat(_sortedCat))
            setSortedCat(_sortedCat)
            if (pathID?.catID && pathID?.courseID && pathID?.chapterID) {
                const _selectedCat = _sortedCat.filter((cat) => cat[0] == pathID.catID)
                // console.log('-----_sortedCat----:', _sortedCat, selectedCat)
                updateCategory(pathID?.catID, _selectedCat[0])
            }
            // console.log('-- pathCatID', pathID?.catID, typeof (pathID?.catID), ', end')

            // -- Initially after user login, by default select the first category. ---
            if (pathID?.catID == null) {
                // console.log('No pathCatId: ')
                selectCategory(_sortedCat[0], false)
            }
            else if (selectedCat == null) {

                const _selectedCat = _sortedCat.filter((cat) => cat[0] == pathID?.catID)[0]
                selectCategory(_selectedCat, false)
                // console.log('Yes pathCatId: ', _selectedCat)
            }

        }
        fetchChapterCateory()
        // console.log('-----Nav Path----:', pathID)
    }, [categories])

    const getSortedCourseID = (catID) => {
        const course_list_sequence = categories.filter(cat => cat[0] == catID)[0][4].course_list_sequence
        if (course_list_sequence == null) return null
        const courseIDKey = Object.keys(course_list_sequence).sort((a, b) => course_list_sequence[a] > course_list_sequence[b] ? 1
            :
            course_list_sequence[a] < course_list_sequence[b] ? -1 : 0)
        return courseIDKey // output: sorted keys in array sequence. e.g. courseIDKey[0]=='courseid'
    }

    // useEffect(() => {
    //     console.log('NavCategores-useEffect-coursesEnrolled:', coursesEnrolled, ', categories: ', categories)

    //     if (categories && coursesEnrolled)
    //         dispatch(setCoursesEnrolledStatus({ 'categories': categories, 'courses': coursesEnrolled }))
    // }, [coursesEnrolled])

    useEffect(() => {

        // console.log('selectedCat: ', selectedCat)
    }, [selectedCat])
    // console.log('navCategories: pathCatID && courseID && chapterID', pathID)
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
                    className={`nav__btn_category ${pathID?.catID == category[0] && 'btn_selected'}`}
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