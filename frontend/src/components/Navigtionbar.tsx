import React from 'react'
import { useNavigate } from 'react-router-dom'
import Proptypes from 'prop-types'

const Navigationbar = ({ token, logout }) => {
  const navigate = useNavigate()
  return (
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
              <button onClick={() => navigate('/login')}>
                Login
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/addUser')}>
                Sign Up
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/addGame')}>
                New Game
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/games')} disabled={!token}>
                Games
              </button>
            </li>
            <li>
              <button onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}

Navigationbar.propTypes = {
  token: Proptypes.string,
  logout: Proptypes.func
}

export default Navigationbar