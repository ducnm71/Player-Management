import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LayoutAdmin from './Layout/LayoutAdmin';
import Transport from './pages/Transport'
import Statistic from './pages/Statistic'
import Login from './pages/Login'

function App() {

  const is_login = localStorage.getItem('is_login')

  return (
    <div className='h-sreen'>
    {
      is_login ? 
      <Router>
        <Routes>
          <Route path="/" element={<LayoutAdmin />}>
            <Route path="" element={<Transport />} />
            <Route path="statistic" element={<Statistic />} />
          </Route>
        </Routes>
      </Router>
      : <Login/>
    }
    </div>
  )
}

export default App
