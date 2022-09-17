import { gql } from '@apollo/client'

export const GETGAMES = gql`
  query getGames {
    getGames {
      name
      id
    }
  }
`

export const GETSTORES = gql`
  query getStores($game: String) {
    getStores(
      game: $game
    ) {
      name
      id
    }
  }
`

export const GETITEMS = gql`
  query getItems($store: String) {
    getItems(
      store: $store
    ) {
      name
      id
    }
  }
`