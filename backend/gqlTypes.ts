import { gql } from 'apollo-server'

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

type Query {
  getUser: User
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