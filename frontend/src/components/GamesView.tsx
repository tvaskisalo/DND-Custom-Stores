import { useQuery } from '@apollo/client'
import React from 'react'
import { GETGAMES } from '../queries'


const GamesView = () => {
  const games = useQuery(GETGAMES)
  if (games.loading) return <p> Please wait a second</p>
  if (!games.data.getGames) return <div>No games found</div>
  return (
    <div>
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
          <div key={game.id}>
            <div>Game name: {game.name}</div>
            {Enchantments}
            <div>Rarities and enchantment tiers: {RarityDefs}</div>
            <br/>
          </div>
        )
      })}
    </div>
  )
}

export default GamesView


