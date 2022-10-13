import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import ContentScreen from './screens/ContentScreen'
import Nav from './components/Nav'
function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/content' element={<ContentScreen />} />
      </Routes>
    </div>
  );
}

export default App;
