import React, { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import AddUser from './components/AddUser'
import AddGame from './components/AddGame'

function App() {
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    const storedToken = localStorage.getItem('DnD-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  return (
    <div>
      <nav className='bg-white border-gray-200 rounded'>
        <ul className='flex flex-row justify-between mx-auto w-full'>
          <li>
            DnD-custom stores
          </li>
          <li>
            <ul className='flex flex-row md:space-x-4'>
              <li>
                <button onClick={() => navigate('/')}>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/api/login')}>
                  Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/api/addUser')}>
                  Sign Up
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/api/addGame')}>
                  New Game
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api/login" element={<Login setToken={setToken}/>} />
        <Route path="/api/adduser" element={<AddUser />} />
        <Route path="/api/addgame" element={<AddGame />} />
      </Routes>
    </div>
  )
}

export default App
