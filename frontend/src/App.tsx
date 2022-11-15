import React, { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/forms/Login'
import AddUser from './components/forms/AddUser'
import AddGame from './components/forms/AddGame'
import GamesView from './components/GamesView'
import Navigationbar from './components/Navigtionbar'
import { useApolloClient } from '@apollo/client'
import AddItem from './components/forms/AddItem'
import AddEnchantment from './components/forms/AddEnchantment'
import AddStore from './components/forms/AddStore'
import StoresView from './components/StoresView'
import ItemsView from './components/ItemsView'
import ItempoolView from './components/ItempoolView'

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
    <div className = 'flex items-start'>
      <Navigationbar token = { token } logout = { logout }/>
      <Routes>
        <Route path = "/" element = { <Home /> } />
        <Route path = "/login" element = { <Login setToken = { setToken }/> } />

        <Route path = "/adduser" element = { <AddUser /> } />
        <Route path = "/addgame" element = { <AddGame /> } />
        <Route path = "/addItem" element = { <AddItem /> } />
        <Route path = "/addStore" element = { <AddStore /> } />
        <Route path = '/addEnchantment' element = { <AddEnchantment/> } />

        <Route path = "/games" element = { token ? <GamesView /> : <Navigate replace to = '/login'/> } />
        <Route path = "/stores" element = { <StoresView /> }/>
        <Route path = "/items" element = { <ItemsView /> }/>
        <Route path = "/generateItempool" element = { <ItempoolView store = 'testStore' game = 'testGame' /> } />
      </Routes>
    </div>
  )
}

export default App
