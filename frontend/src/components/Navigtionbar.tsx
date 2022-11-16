import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Proptypes from 'prop-types'
import { buttonClassName, disabledButton, liClassName } from '../utils/syling'

const Navigationbar = ({ token, logout }) => {
  const navigate = useNavigate()
  const [collapse, setCollapse] = useState(true)
  return (
    <div className={ collapse ? '' : 'bg-slate-900  rounded min-w-[15%] h-screen'}>
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
                    <button className = { token ? buttonClassName : disabledButton } onClick={() => navigate('/addGame') } disabled={!token}>New Game</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { token ? buttonClassName : disabledButton } onClick={() => navigate('/addStore')} disabled={!token}>New Store</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { token ? buttonClassName : disabledButton } onClick={() => navigate('/addItem')} disabled={!token}>New Item</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { token ? buttonClassName : disabledButton } onClick={() => navigate('/addEnchantment')} disabled={!token}>New Enchantment</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { token ? buttonClassName : disabledButton } onClick={() => navigate('/games')} disabled={!token}>Games</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { token ? buttonClassName : disabledButton } onClick={() => navigate('/stores')} disabled={!token}>Stores</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { token ? buttonClassName : disabledButton } onClick={() => navigate('/items')} disabled={!token}>Items</button>
                  </li>
                  <li className={ liClassName }>
                    <button className = { token ? buttonClassName : disabledButton } onClick={() => navigate('/generateItempool')} disabled={!token}>Generate Itempool</button>
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