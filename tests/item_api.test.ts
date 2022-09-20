// This test expects that user_api.test.ts passes

import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from '../GraphQL/gqlTypes'
import { Mutation } from '../GraphQL/mutations'
import { Query } from '../GraphQL/queries'
import { MONGODB } from '../utils/config'
import mongoose from 'mongoose'

const resolvers = {
  Mutation,
  Query
}

const testServer = new ApolloServer({
  typeDefs,
  resolvers
})

let token: string

beforeAll( async () => {
  await mongoose.connect(MONGODB)
  await testServer.executeOperation({
    query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
    variables: {
      username: 'testName',
      password: 'test'
    }
  })
  const result = await testServer.executeOperation({
    query: 'mutation login($username: String!, $password: String!) { login ( username: $username, password: $password ) { value } }',
    variables: {
      username: 'testName',
      password: 'test'
    }
  })
  if (result && result.data && result.data.login && result.data.login.value) {
    token = result.data.login.value as string
  }
},100000)

describe('Test for item addition', () => {
  test('todo', () => {
    expect(token).toBeDefined()
  })
})