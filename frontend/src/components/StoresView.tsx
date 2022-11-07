import { useQuery } from '@apollo/client'
import React from 'react'
import { GETSTORES } from '../queries'

const StoresView = () => {
  const stores = useQuery(GETSTORES)
  if (stores.loading) return <p>Please wait a second</p>
  if (!stores.data.getStores) return <div>No stores found</div>
  return (<div>
    {
      stores.data.getStores.map(store => {
        let iTP = <div/>
        let games = <div/>
        if (store.itemTypeProbabilities) {
          iTP = <div>Itemtype Probabilities: {
            store.itemTypeProbabilities.map(itp => {
              return(
                <div key={itp.rarity}>
                  <div>Rarity: {itp.rarity}</div>
                  <div>Probability: {itp.probability}</div>
                </div>
              )
            })
          }</div>
        }
        if (store.games && store.games.length !== 0) {
          let str = ''
          str = str.concat(store.games, ', ')
          str = str.substring(0, str.length - 2)
          games = <div>Games: {str}</div>
        }
        return (
          <div key={store.id}>
            <div>Store name: {store.name}</div>
            {iTP}
            {games}
            <br/>
          </div>
        )
      })
    }
  </div>)
}

export default StoresView