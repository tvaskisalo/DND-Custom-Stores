import { useQuery } from '@apollo/client'
import React from 'react'
import { GETITEMS } from '../queries'
import { toItem } from '../utils/parsers'
import ItemView from './ItemView'
import { useNavigate } from 'react-router-dom'


const ItemsView = () => {
  const items = useQuery(GETITEMS)
  const navigate = useNavigate()
  if (items.loading) return <p>Please wait a second...</p>
  if (!items.data.getItems) return <div>No items found</div>
  console.log(items.data.getItems)
  let id = 0
  return (
    <div>
      {
        items.data.getItems.map(i => {
          return <div key={id++}>{ItemView(toItem(i), navigate)}</div>
        })
      }
    </div>
  )
}

export default ItemsView