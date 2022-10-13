import React from 'react'
import './NavCategories.css'
import { useDispatch } from 'react-redux'
import { setCat } from '../slices/categorySlice'
const NavCategoris = () => {
    // const categories = ['HTML', 'CSS', 'JavaScript', 'Data Structure', 'ReactJS', 'Practices', 'General', 'HR']
    const categories = [
        {
            "id": 1,
            'order': 8,
            "title": "HR",
            "description": "HR Category"
        },
        {
            "id": 2,
            'order': 7,
            "title": "General",
            "description": "General Category"
        },
        {
            "id": 9,
            'order': 6,
            "title": "Practices",
            "description": "ReactJS Category"
        },
        {
            "id": 3,
            'order': 5,
            "title": "ReactJS",
            "description": "ReactJS Category"
        },
        {
            "id": 4,
            'order': 4,
            "title": "Data Structure",
            "description": "Data Structure Category"
        },
        {
            "id": 5,
            'order': 3,
            "title": "JavaScript",
            "description": "JavaScript Cagtegory"
        },
        {
            "id": 6,
            'order': 2,
            "title": "CSS",
            "description": "CSS Category"
        },
        {
            "id": 8,
            'order': 1,
            "title": "HTML",
            "description": "HTML Category"
        }
    ]
    // ++ Output from sort ++
    //- id: category[0]
    //- title: category[1]
    const sortedCat = Object.entries(categories)
        .sort(([, a], [, b]) => (a.order - b.order)) // ascending by order
        .map(([key, value_cat]) => [value_cat.id, value_cat.title])
    // console.log('sorted: ', sortedCat)

    const dispatch = useDispatch()
    const handleBtnClick = (e) => {
        // console.log(e.target.name)
        dispatch(setCat({ selectedId: e.target.name, lists: categories }))

    }
    return (
        <div className='nav__categories'>
            {sortedCat.map((category, index) => <button key={category[0]} className='nav__btn_category' onClick={handleBtnClick} name={category[0]} dangerouslySetInnerHTML={{ __html: (category[1].replace(' ', '&nbsp;')) }}></button>)}
        </div>
    )
}

export default NavCategoris


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