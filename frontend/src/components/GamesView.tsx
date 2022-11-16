import { useQuery } from '@apollo/client'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GETGAMES } from '../queries'
import { smallButton } from '../utils/syling'


const GamesView = () => {
  const games = useQuery(GETGAMES)
  const navigate = useNavigate()
  if (games.loading) return <p> Please wait a second</p>
  if (!games.data.getGames) return <div>No games found</div>
  return (
    <div className='grid grid-cols-2 gap-4 px-4 py-4 bg-slate-600'>
      {games.data.getGames.map(game => {
        let Enchantments = <div/>
        let RarityDefs = <div/>
        if (game.enchantments) {
          const enchants = ''
          Enchantments = <div>Enchantments: {enchants.concat(game.enchantments, ', ')}</div>
        }
        if (game.rarities) {
          RarityDefs = game.rarities.map(r => {
            let tiers = ''
            r.enchantmentTiers.forEach(e => tiers = tiers.concat(e as string, ', '))
            tiers = tiers.substring(0, tiers.length - 2)
            return (<div key={r.rarity}>
              <div>{r.rarity}: {tiers}</div>
            </div>)
          })
        }
        return (
          <div key={game.id} className = 'inline-block px-2 w-fit bg-slate-500 rounded'>
            <div>Game name: {game.name}</div>
            {Enchantments}
            <div>Rarities and enchantment tiers: {RarityDefs}</div>
            {<button className={smallButton} onClick={() => navigate(`/updateGame/?id=${game.id}`)}>Update</button> }
          </div>
        )
      })}
    </div>
  )
}

export default GamesView


