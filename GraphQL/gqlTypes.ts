import { gql } from 'apollo-server-express'

export const typeDefs = gql`
type User {
  username: String!
  password: String!,
  id: ID!
}
type Token {
  value: String!
}
type Enchantment {
  name: String!,
  games: [String],
  tier: Int,
  damage: String,
  damageTypes: [String],
  description: String
}
type Username {
  value: String!
}
type RarityDefinition {
  rarity: String!,
  enchantments: [Int]!
}
input RarityDefinitionInput {
  rarity: String!,
  enchantments: [Int]!
}
type Game {
  name: String!,
  enchantments: [String],
  rarities: [RarityDefinition]
  id: ID!
}
type ItemTypeProbability {
  rarity: String!,
  probability: Int!
}
input ItemTypeProbabilityInput {
  rarity: String!,
  probability: Int!
}
type Store {
  name: String!,
  id: ID!,
  itemTypeProbabilities: [ItemTypeProbability],
  games: [String]
}
type Item {
  name: String!,
  games: [String],
  id: ID!,
  storepool: [String]
  material: String,
  baseCost: Int,
  weight: Int,
  properties: String,
  damage: String,
  damageTypes: [String],
  baseItem: Boolean,
  unique: Boolean,
  weapon: Boolean,
  weaponType: String,
  armor: Boolean,
  armorType: String,
  armorClass: String,
  strength: String,
  stealth: String
}
type Query {
  getGames: [Game],
  getGameInfo(name: String!): Game,
  getStores(game: String): [Store],
  getStoreInfo(name: String!): Store
  getItems(store: String): [Item]
  getItemInfo(name: String!): Item,
  getEnchantments(game: String): [Enchantment]
}
type Mutation {
  login(
    username: String!
    password: String!
  ): Token,
  addUser(
    username: String!
    password: String!
  ): Username,
  addGame(
    name: String!,
    enchantments: [String],
    rarities: [RarityDefinitionInput]
  ): Game,
  addStore(
    name: String!,
    itemTypeProbabilities: [ItemTypeProbabilityInput],
    games: [String]
  ): Store,
  addItem(
    name: String!,
    games: [String],
    storepool: [String],
    material: String,
    baseCost: Int,
    weight: Int,
    properties: String,
    damage: String,
    damageTypes: [String],
    baseItem: Boolean,
    unique: Boolean,
    weapon: Boolean,
    weaponType: String,
    armor: Boolean,
    armorType: String,
    armorClass: String,
    strength: String,
    stealth: String
  ): Item,
  addEnchantment(
    name: String!,
    games: [String],
    tier: Int,
    damage: String,
    damageTypes: [String],
    description: String
  ): Enchantment,
  removeGame(
    name: String!
  ): Game,
  removeStore(
    name: String!
  ): Store,
  removeItem(
    name: String!
  ): Item,
  removeEnchantment(
    id: String!,
  ): Enchantment,
  updateGame(
    id: String!,
    name: String,
    enchantments: [String],
    rarities: [RarityDefinitionInput]
  ): Game,
  updateStore(
    id: String!,
    name: String,
    itemTypeProbabilities: [ItemTypeProbabilityInput],
    games: [String]
  ): Store,
  updateItem(
    id: String!,
    name: String,
    games: [String],
    storepool: [String],
    material: String,
    baseCost: Int,
    weight: Int,
    properties: String,
    damage: String,
    damageTypes: [String],
    baseItem: Boolean,
    unique: Boolean,
    weapon: Boolean,
    weaponType: String,
    armor: Boolean,
    armorType: String,
    armorClass: String,
    strength: String,
    stealth: String
  ): Item,
  updateEnchantment(
    id: String!,
    name: String,
    games: [String],
    tier: Int,
    damage: String,
    damageTypes: [String],
    description: String
  ): Enchantment
  generateItempool(
    name: String!
  ): [Item]
}
`