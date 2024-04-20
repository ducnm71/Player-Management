import './App.css'
import Transport from './pages/Transport'
import Login from './pages/Login'

function App() {

  const is_login = localStorage.getItem('is_login')

  return (
    <div className='h-sreen'>
    {
      is_login ? <Transport/> : <Login/>
    }
    </div>
  )
}

export default App
