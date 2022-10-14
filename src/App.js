import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import CourseScreen from './screens/CourseScreen'
import QuizScreen from './screens/QuizScreen'
import HomeworkScreen from './screens/HomeworkScreen'
import ProjectScreen from './screens/ProjectScreen'
import SkillScreen from './screens/SkillScreen'
import ReferenceScreen from './screens/ReferenceScreen'
import NavHeader from './components/NavHeader'
import PracticeScreen from './screens/PracticeScreen'
import GeneralScreen from './screens/GeneralScreen'
import HRScreen from './screens/HRScreen'
function App() {
  return (
    <div className="App">
      <NavHeader />
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/courses/:course_id' element={<CourseScreen />} />
        <Route path='/quiz/:quiz_id' element={<QuizScreen />} />
        <Route path='/homeworks/:homework_id' element={<HomeworkScreen />} />
        <Route path='/projects/:project_id' element={<ProjectScreen />} />
        <Route path='/skills/:skill_id' element={<SkillScreen />} />
        <Route path='/references/:reference_id' element={<ReferenceScreen />} />

        <Route path='/practices/:practice_id' element={<PracticeScreen />} />
        <Route path='/general/:general_id' element={<GeneralScreen />} />
        <Route path='/hr/:hr_id' element={<HRScreen />} />
      </Routes>
    </div>
  );
}

export default App;
