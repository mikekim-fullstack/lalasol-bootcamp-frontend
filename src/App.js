import './App.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import ChapterScreen from './screens/ChapterScreen'
import QuizScreen from './screens/QuizScreen'
import HomeworkScreen from './screens/HomeworkScreen'
import ProjectScreen from './screens/ProjectScreen'
import SkillScreen from './screens/SkillScreen'
import ReferenceScreen from './screens/ReferenceScreen'
import NavHeader from './components/NavHeader'
import PracticeJSScreen from './screens/PracticeJSScreen'
import PracticeHtmlScreen from './screens/PracticeHtmlScreen'
import GeneralScreen from './screens/GeneralScreen'
import HRScreen from './screens/HRScreen'
import Screen404 from './screens/Screen404'
import LoginScreen from './screens/LoginScreen'

import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { login, getUser } from './slices/userSlices';
import AddCourseScreen from './screens/AddCourseScreen'

import './fonts/Euclid Circular A Light.ttf'
import './fonts/Euclid Circular A Bold Italic.ttf'
import './fonts/Euclid Circular A Bold.ttf'
import './fonts/Euclid Circular A Italic.ttf'
import './fonts/Euclid Circular A Light Italic.ttf'
import './fonts/Euclid Circular A Medium Italic.ttf'
import './fonts/Euclid Circular A Medium.ttf'
import './fonts/Euclid Circular A Regular.ttf'
import './fonts/Euclid Circular A SemiBold.ttf'
import './fonts/Euclid Circular A SemiBold Italic.ttf'
import LandingPage from './pages/LandingPage'
import SigninPage from './pages/LandingPage/SigninPage'

// process.env.REACT_API_DEBUG
process.env.REACT_APP_DEBUG == 'true' ?
  axios.defaults.baseURL = 'http://127.0.0.1:8000'
  : axios.defaults.baseURL = 'https://lalasol-bootcamp-backend-production.up.railway.app'
// if (process.env.REACT_APP_DEBUG == 'true') {
//     BASE_URL = process.env.REACT_APP_BASE_URL_DEBUG
// } else {
//     BASE_URL = process.env.REACT_APP_BASE_URL
// }

function App() {
  // const [user, setUser] = useState(false)
  const user = useSelector(getUser)
  // console.log(user)

  return (
    <div className="App">
      {/* {!user ? <LoginScreen /> : */}
      {!user ?
        <>

          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/signin' element={<SigninPage />} />
          </Routes>
        </>
        :
        <>
          <NavHeader />
          <Routes>
            <Route path='/' element={<HomeScreen />} />

            <Route path='/add-course' element={<AddCourseScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/chapter/:chapter_id/:user_id/' element={<ChapterScreen />} />
            <Route path='/quiz/:quiz_id' element={<QuizScreen />} />
            <Route path='/homeworks/:homework_id' element={<HomeworkScreen />} />
            <Route path='/projects/:project_id' element={<ProjectScreen />} />
            <Route path='/skills/:skill_id' element={<SkillScreen />} />
            <Route path='/references/:reference_id' element={<ReferenceScreen />} />

            <Route path='/practices-js/' element={<PracticeJSScreen />} />
            <Route path='/practices-html/' element={<PracticeHtmlScreen />} />
            <Route path='/hr/:hr_id' element={<HRScreen />} />

            <Route path='/screen404' element={<Screen404 />} />
          </Routes>
        </>
      }
    </div>
  );
}

export default App;
