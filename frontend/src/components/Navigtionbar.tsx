import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Proptypes from 'prop-types'

const Navigationbar = ({ token, logout }) => {
  const navigate = useNavigate()
  const [collapse, setCollapse] = useState(true)
  const liClassName = 'inline-block px-2 py-2'
  const buttonClassName = 'inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs rounded'
  return (
    <div className='bg-slate-900  rounded w-fit'>
      <button className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs rounded' onClick={() => setCollapse(!collapse)}>
        Show menu
      </button>
      {
        collapse
          ? <div></div>
          : <nav >
            <ul className='flex-row justify-between mx-auto left-5 inline-block px-2 py-2'>
              <li>
                <ul className='flex flex-col'>
                  <li className={ liClassName }>
                    <button className = { buttonClassName } onClick={() => navigate('/')}>Home</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { buttonClassName } onClick={() => navigate('/login')}>Login</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { buttonClassName } onClick={() => navigate('/addUser')}>Sign Up</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { buttonClassName } onClick={() => navigate('/addGame')}>New Game</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { buttonClassName } onClick={() => navigate('/games')} disabled={!token}>Games</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { buttonClassName } onClick={logout}>Logout</button>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
      }
    </div>
  )
}

Navigationbar.propTypes = {
  token: Proptypes.string,
  logout: Proptypes.func
}

export default Navigationbar