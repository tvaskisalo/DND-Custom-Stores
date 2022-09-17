import { useQuery } from '@apollo/client'
import React from 'react'
import { GETGAMES } from '../queries'

const GamesView = () => {
  const games = useQuery(GETGAMES)
  if (games.loading) return <p> Please wait a second</p>
  if (!games.data.getGames) {
    return <div>no games found</div>
  }
  return (
    <div>
      {games.data.getGames.map(game => {
        return (
          <div key={game.id}>{game.name}</div>
        )
      } )}
    </div>
  )
}

export default GamesView


