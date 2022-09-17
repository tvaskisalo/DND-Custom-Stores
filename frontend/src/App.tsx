import React, { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import AddUser from './components/AddUser'
import AddGame from './components/AddGame'
import GamesView from './components/GamesView'
import Navigationbar from './components/Navigtionbar'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [token, setToken] = useState('')
  const client = useApolloClient()
  useEffect(() => {
    const storedToken = localStorage.getItem('DnD-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])
  const logout = () => {
    localStorage.removeItem('DnD-user-token')
    setToken('')
    client.resetStore()
  }
  return (
    <div>
      <Navigationbar token={ token } logout={logout}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken}/>} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/addgame" element={<AddGame />} />
        <Route path="/games" element={token ? <GamesView /> : <Navigate replace to='/login'/>} />
      </Routes>
    </div>
  )
}

export default App
