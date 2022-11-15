import { useQuery } from '@apollo/client'
import React from 'react'
import { GETITEMS } from '../queries'
import { toItem } from '../utils/parsers'
import ItemView from './ItemView'

const ItemsView = () => {
  const items = useQuery(GETITEMS)
  if (items.loading) return <p>Please wait a second...</p>
  if (!items.data.getItems) return <div>No items found</div>
  let id = 0
  return (
    <div>
      {
        items.data.getItems.map(i => {
          return <div key={id++}>{ItemView(toItem(i))}</div>
        })
      }
    </div>
  )
}

export default ItemsView