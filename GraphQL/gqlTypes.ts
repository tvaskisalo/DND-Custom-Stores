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
type Store {
  name: String!,
  id: ID!
}
type Item {
  name: String!,
  id: ID!
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
    name: String!
  ): Store,
  addItem(
    name: String!
  ): Item
}
`