import { useQuery } from '@apollo/client'
import React from 'react'
import { GENERATEITEMPOOL } from '../queries'
import Proptypes from 'prop-types'
import ItemView from './ItemView'
import { toItem } from '../utils/parsers'


const ItempoolView = ({ store, game }) => {
  const items = useQuery(
    GENERATEITEMPOOL, {
      variables: {
        store: store,
        game: game,
        seed: 'test'
      }
    }
  )
  if (items.loading) return <p>Please wait a second...</p>

  if (!items.data) return <div>No items generated</div>
  let id = 0
  return (
    <div>
      {
        items.data.generateItempool.map(i => {
          return <div key={id++}>{ItemView(toItem(i))}</div>
        })
      }
    </div>
  )
}

ItempoolView.propTypes = {
  game: Proptypes.string,
  store: Proptypes.string
}

export default ItempoolView
