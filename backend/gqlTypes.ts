import { gql } from 'apollo-server'

export const typeDefs = gql`
type User {
  username: String!
  password: String!,
  id: ID!
}
type Query {
  getUser: User
}
type Mutation {
  login(
    username: String!
    password: String!
  ): String!
}
`