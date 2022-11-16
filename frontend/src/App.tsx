import React, { useState } from 'react'
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
import UpdateItem from './components/forms/UpdateItem'
import UpdateGame from './components/forms/UpdateGame'
import UpdateStore from './components/forms/UpdateStore'
import UpdateEnchantment from './components/forms/UpdateEnchantment'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('DnD-user-token'))
  const client = useApolloClient()
  const logout = () => {
    localStorage.removeItem('DnD-user-token')
    setToken(null)
    client.resetStore()
  }
  return (
    <div className = 'flex items-start h-screen bg-slate-300 '>
      <div className='min-w-[15%]'><Navigationbar token = { token } logout = { logout }/></div>
      <Routes>
        <Route path = "/" element = { <Home /> } />
        <Route path = "/login" element = { <Login setToken = { setToken }/> } />

        <Route path = "/adduser" element = { <AddUser /> } />
        <Route path = "/addGame" element = { token ? <AddGame /> : <Navigate replace to = '/login'/>} />
        <Route path = "/addItem" element = { token ? <AddItem /> : <Navigate replace to = '/login'/>} />
        <Route path = "/addStore" element = { token ? <AddStore /> : <Navigate replace to = '/login'/>} />
        <Route path = '/addEnchantment' element = { token ? <AddEnchantment/> : <Navigate replace to = '/login'/>} />

        <Route path = "/updateGame" element = { token ? <UpdateGame /> : <Navigate replace to = '/login'/>} />
        <Route path = "/updateItem" element = { token ? <UpdateItem /> : <Navigate replace to = '/login'/>} />
        <Route path = "/updateStore" element = { token ? <UpdateStore /> : <Navigate replace to = '/login'/>} />
        <Route path = '/updateEnchantment' element = { token ? <UpdateEnchantment/> : <Navigate replace to = '/login'/>} />

        <Route path = "/games" element = { token ? <GamesView /> : <Navigate replace to = '/login'/> } />
        <Route path = "/stores" element = { <StoresView /> }/>
        <Route path = "/items" element = { <ItemsView /> }/>
        <Route path = "/generateItempool" element = { <ItempoolView store = 'testStore' game = 'testGame' /> } />
      </Routes>
    </div>
  )
}

export default App
