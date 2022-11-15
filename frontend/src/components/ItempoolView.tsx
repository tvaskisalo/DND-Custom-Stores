import { useQuery } from '@apollo/client'
import React from 'react'
import { GENERATEITEMPOOL } from '../queries'
import Proptypes from 'prop-types'


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
  return (
    <div>
      {
        items.data.generateItempool.map(item => {
          return (
            <div key={ item.id }>
              <div>Item name: { item.name }</div>
              { item.material ? <div>Material: { item.material }</div> : <div/> }
              { item.baseCost ? <div>Basecost: { item.baseCost }</div> : <div/> }
              { item.weight ? <div>Weight: { item.weight }</div> : <div/> }
              { item.properties ? <div>Properties: { item.properties }</div> : <div/> }
              { item.damage ? <div>Damage: { item.damage }</div> : <div/> }
              { item.damageTypes && item.damageTypes.length !== 0 ? <div>Damagetypes: { ''.concat(item.damageTypes, ' ').trimEnd() }</div> : <div/> }
              { item.baseItem !== undefined ? <div>Baseitem: { item.baseItem ? 'true' : 'false' }</div> : <div/> }
              { item.unique !== undefined ? <div>Unique: { item.unique ? 'true' : 'false' }</div> : <div/> }
              { item.weapon !== undefined ? <div>Weapon: { item.weapon ? 'true' : 'false' }</div> : <div/> }
              { item.weaponType ? <div>Weapontype: { item.weaponType }</div> : <div/> }
              { item.armor !== undefined ? <div>Armor: { item.armor ? 'true' : 'false' }</div> : <div/> }
              { item.armorType ? <div>Armortype: { item.armorType }</div> : <div/> }
              { item.armorClass ? <div>Armorclass: { item.armorClass }</div> : <div/> }
              { item.strength ? <div>Strength: { item.strength }</div> : <div/> }
              { item.stealth ? <div>Stealth: { item.stealth }</div> : <div/> }
              { item.rarity ? <div>Rarity: { item.rarity }</div> : <div/> }
            </div>
          )
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
