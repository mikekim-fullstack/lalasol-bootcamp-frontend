import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import CourseScreen from './screens/CourseScreen'
// import Nav from './components/Nav'
import NavHeader from './components/NavHeader'
function App() {
  return (
    <div className="App">
      <NavHeader />
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/courses/:course_id' element={<CourseScreen />} />
      </Routes>
    </div>
  );
}

export default App;
