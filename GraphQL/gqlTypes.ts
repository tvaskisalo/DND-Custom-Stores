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

type Query {
  getGames: [Game]
}

type Mutation {
  login(
    username: String!
    password: String!
  ): Token,
  addUser(
    username: String!
    password: String!
  ): Username
}
`