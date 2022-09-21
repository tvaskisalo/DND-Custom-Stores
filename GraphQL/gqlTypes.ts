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
type Username {
  value: String!
}
type Game {
  name: String!,
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
  itempool: [Item],
  itemTypeProbabilities: [ItemTypeProbability]
}
type Item {
  name: String!,
  id: ID!,
  storepool: [String]
  material: String,
  baseCost: Int,
  weight: Int,
  properties: String,
  damage: String,
  damageTypes: [String],
  baseItem: Boolean!,
  unique: Boolean!
}
type Query {
  getGames: [Game],
  getStores(game: String): [Store],
  getItems(store: String): [Item]
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
    name: String!
  ): Game,
  addStore(
    name: String!,
    itemTypeProbabilities: [ItemTypeProbabilityInput]
  ): Store,
  addItem(
    name: String!,
    storepool: [String]
    material: String,
    baseCost: Int,
    weight: Int,
    properties: String,
    damage: String,
    damageTypes: [String],
    baseItem: Boolean!,
    unique: Boolean!
  ): Item
}
`