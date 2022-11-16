import { useQuery } from '@apollo/client'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GETSTORES } from '../queries'
import { smallButton } from '../utils/syling'

const StoresView = () => {
  const stores = useQuery(GETSTORES)
  const navigate = useNavigate()
  if (stores.loading) return <p>Please wait a second</p>
  if (!stores.data.getStores) return <div>No stores found</div>
  return (<div className='grid grid-cols-2 gap-4 px-4 py-4 bg-slate-600' >
    {
      stores.data.getStores.map(store => {
        let iTP = <div/>
        let games = <div/>
        if (store.itemRarityProbabilities) {
          iTP = <div>Itemtype Probabilities: {
            store.itemRarityProbabilities.map(itp => {
              return (
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
          <div key={store.id} className = 'inline-block px-2 w-fit bg-slate-500 rounded'>
            <div>Store name: {store.name}</div>
            {iTP}
            {games}
            <br/>
            {<button className={smallButton} onClick={() => navigate(`/updateStore/?id=${store.id}`)}>Update</button> }
          </div>
        )
      })
    }
  </div>)
}

export default StoresView