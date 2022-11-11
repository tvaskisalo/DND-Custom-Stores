import { gql } from '@apollo/client'

export const LOGIN = gql`mutation login (
  $username: String!
  $password: String!) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
  `

export const ADDUSER = gql`mutation addUser (
  $username: String!
  $password: String!) {
    addUser(
      username: $username
      password: $password
    ) {
      value
    }
  }
`

export const ADDGAME = gql`mutation addGame (
  $name: String!
  $enchantments: [String]
  $rarities: [RarityDefinitionInput]){
    addGame(
      name: $name
      enchantments: $enchantments
      rarities: $rarities
    ){
      name
      id
      enchantments
      rarities {
        rarity
        enchantmentTiers
      }
    }
  }`

export const ADDSTORE = gql`mutation addStore (
  $name: String!
  $itemRarityProbabilities: [itemRarityProbabilityInput]
  $games: [String],
  $capacity: Int){
    addStore(
      name: $name
      itemRarityProbabilities: $itemRarityProbabilities
      games: $games
      capacity: $capacity
    ){
      name
      id
      itemRarityProbabilities {
        rarity
        probability
      }
      games
      capacity
    }
  }`

export const ADDITEM = gql`mutation addItem(
  $name: String! 
  $games: [String]
  $storepool: [String] 
  $material: String 
  $baseCost: Int 
  $weight: Int 
  $properties: String 
  $damage: String 
  $damageTypes: [String] 
  $baseItem: Boolean! 
  $unique: Boolean!
  $weapon: Boolean
  $weaponType: String
  $armor: Boolean
  $armorType: String
  $armorClass: String
  $strength: String
  $stealth: String) { 
    addItem (
      name: $name 
      games: $games
      storepool: $storepool 
      material: $material 
      baseCost: $baseCost 
      weight: $weight 
      properties: $properties 
      damage: $damage 
      damageTypes: $damageTypes 
      baseItem: $baseItem 
      unique: $unique
      weapon: $weapon
      weaponType: $weaponType
      armor: $armor
      armorType: $armorType
      armorClass: $armorClass
      strength: $strength
      stealth: $stealth
    ) {
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
  }`

export const ADDENCHANTMENT = gql`mutation addEnchantment(
  $name: String!
  $games: [String]
  $tier: Int
  $damage: String
  $damageTypes: [String]
  $description: String) {
    addEnchantment(
      name: $name
      games: $games
      tier: $tier
      damage: $damage
      damageTypes: $damageTypes
      description: $description
    ) {
      name
      games
      tier
      damage
      damageTypes
      description
    }
  }`

export const REMOVEGAME = gql`mutation removeGame($name: String!){
  removeGame(name: $name) {
    name
    id
    enchantments
    rarities {
      rarity
      enchantmentTiers
    }
  }
}`
export const REMOVESTORE = gql`mutation removeStore($name: String!){
  removeStore(name: $name) {
    name
    id
    itemRarityProbabilities
    games
  }
}`
export const REMOVEITEM = gql`mutation removeItem($name: String!){
  removeItem(name: $name) {
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
}`
export const REMOVENCHANTMENT = gql`mutation removeEnchantment($name: String!){
  removeEnchantment(name: $name) {
    name
    games
    tier
    damage
    damageTypes
    description
  }
}`

export const UPDATEGAME = gql`mutation updateGame (
  $id: String!
  $name: String
  $enchantments: [String]
  $rarities: [RarityDefinitionInput]){
    updateGame(
      id: $id
      name: $name
      enchantments: $enchantments
      rarities: $rarities
    ){
      id
      name
      id
      enchantments
      rarities {
        rarity
        enchantmentTiers
      }
    }
  }`

export const UPDATESTORE = gql`mutation updateStore (
  $id: String!
  $name: String
  $itemRarityProbabilities: [itemRarityProbabilityInput]
  $games: [String],
  $capacity: Int){
    updateStore(
      id: $id
      name: $name
      itemRarityProbabilities: $itemRarityProbabilities
      games: $games,
      capacity: $capacity
    ){
      id
      name
      id
      itemRarityProbabilities {
        rarity
        probability
      }
      games
      capacity
    }
  }`

export const UPDATEITEM = gql`mutation updateItem(
  $id: String!
  $name: String 
  $games: [String]
  $storepool: [String] 
  $material: String 
  $baseCost: Int 
  $weight: Int 
  $properties: String 
  $damage: String 
  $damageTypes: [String] 
  $baseItem: Boolean 
  $unique: Boolean
  $weapon: Boolean
  $weaponType: String
  $armor: Boolean
  $armorType: String
  $armorClass: String
  $strength: String
  $stealth: String) { 
    updateItem (
      id: $id
      name: $name 
      games: $games
      storepool: $storepool 
      material: $material 
      baseCost: $baseCost 
      weight: $weight 
      properties: $properties 
      damage: $damage 
      damageTypes: $damageTypes 
      baseItem: $baseItem 
      unique: $unique
      weapon: $weapon
      weaponType: $weaponType
      armor: $armor
      armorType: $armorType
      armorClass: $armorClass
      strength: $strength
      stealth: $stealth
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
  }`

export const UPDATEENCHANTMENT = gql`mutation updateEnchantment(
  $id: String!
  $name: String
  $games: [String]
  $tier: Int
  $damage: String
  $damageTypes: [String]
  $description: String) {
    updateEnchantment(
      id: $id
      name: $name
      games: $games
      tier: $tier
      damage: $damage
      damageTypes: $damageTypes
      description: $description
    ) {
      id
      name
      games
      tier
      damage
      damageTypes
      description
    }
  }`