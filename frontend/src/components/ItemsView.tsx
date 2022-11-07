import { useQuery } from '@apollo/client'
import React from 'react'
import { GETITEMS } from '../queries'

const ItemsView = () => {
  const items = useQuery(GETITEMS)
  if (items.loading) return <p>Please wait a second...</p>
  if (!items.data.getItems) return <div>No items found</div>
  return (
    <div>
      {
        items.data.getItems.map(item => {
          return (
            <div key={item.id}>
              <div>Item name: {item.name}</div>
              {item.games && item.games.length !==0? <div>Games: {''.concat(item.games, ' ').trimEnd()}</div> : <div/>}
              {item.storepool && item.storepool.length !==0 ? <div>Storepool: {''.concat(item.storepool, ' ').trimEnd()}</div> : <div/>}
              {item.material ? <div>Material: {item.material}</div> : <div/>}
              {item.baseCost ? <div>Basecost: {item.baseCost}</div> : <div/>}
              {item.weight ? <div>Weight: {item.weight}</div> : <div/>}
              {item.properties ? <div>Properties: {item.properties}</div> : <div/>}
              {item.damage ? <div>Damage: {item.damage}</div> : <div/>}
              {item.damageTypes && item.damageTypes.length !== 0 ? <div>Damagetypes: {''.concat(item.damageTypes, ' ').trimEnd()}</div> : <div/>}
              {item.baseItem !== undefined ? <div>Baseitem: {item.baseItem ? 'true' : 'false'}</div> : <div/>}
              {item.unique !== undefined ? <div>Unique: {item.unique ? 'true' : 'false'}</div> : <div/>}
              {item.weapon !== undefined ? <div>Weapon: {item.weapon ? 'true' : 'false'}</div> : <div/>}
              {item.weaponType ? <div>Weapontype: {item.weaponType}</div> : <div/>}
              {item.armor !== undefined ? <div>Armor: {item.armor ? 'true' : 'false'}</div> : <div/>}
              {item.armorType ? <div>Armortype: {item.armorType}</div> : <div/>}
              {item.armorClass ? <div>Armorclass: {item.armorClass}</div> : <div/>}
              {item.strength ? <div>Strength: {item.strength}</div> : <div/>}
              {item.stealth ? <div>Stealth: {item.stealth}</div> : <div/>}
            </div>
          )
        })
      }
    </div>
  )
}

export default ItemsView