import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Routes>
    </div>
  );
}

export default App;
