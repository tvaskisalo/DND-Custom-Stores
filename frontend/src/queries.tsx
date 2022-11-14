import { gql } from '@apollo/client'

export const GETGAMES = gql`
  query getGames {
    getGames {
      name
      enchantments
      rarities {
        rarity
        enchantmentTiers
      }
      id
    }
  }
`

export const GETGAMEINFO = gql`
  query getGameInfo($name: String!) {
    getGameInfo(
      name: $name
    ) {
      name
      enchantments
      rarities {
        rarity
        enchantmentTiers
      }
      id
    }
  }
`
export const GETSTOREINFO = gql`
  query getStoreInfo($name: String!) {
    getStoreInfo(
      name: $name
    ) {
      name
      id
      itemRarityProbabilities {
        rarity
        probability
      }
      games
      capacity
    }
  }
`
export const GETITEMINFO = gql`
  query getItemInfo($name: String!) {
    getItemInfo(
      name: $name
    ) {
      id
      name
      games
      storepool
      material
      baseCost
      weight
      properties
      damage
      damageTypes
      baseItem
      unique
      weapon
      weaponType
      armor
      armorType
      armorClass
      strength
      stealth
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
      itemRarityProbabilities {
        rarity
        probability
      }
      games
      capacity
    }
  }
`

export const GETITEMS = gql`
  query getItems($store: String) {
    getItems(
      store: $store
    ) {
      id
      name
      games
      storepool
      material
      baseCost
      weight
      properties
      damage
      damageTypes
      baseItem
      unique
      weapon
      weaponType
      armor
      armorType
      armorClass
      strength
      stealth
    }
  }
`

export const GETENCHANTMENTS = gql`
  query getEnchantments($game: String) {
    getEnchantments(
      game: $game
    ) {
      name
      games
      tier
      damage
      damageTypes
      description
    }
  }  
`

export const GENERATEITEMPOOL = gql`query generateItempool(
  $game: String!,
  $store: String!,
  $seed: String
  ) {
    generateItempool(
      game: $game,
      store: $store,
      seed: $seed
    ) {
      name
      material
      baseCost
      weight
      properties
      damage
      damageTypes
      baseItem
      unique
      weapon
      weaponType
      armor
      armorType
      armorClass
      strength
      stealth
      rarity
    }
  }`