// This file assumes that user_api.test.ts passes
import { typeDefs } from '../GraphQL/gqlTypes'
import { MONGODB } from '../utils/config'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Mutation } from '../GraphQL/mutations'
import { Query } from '../GraphQL/queries'
import { addUserMutation } from './testQueries'


const resolvers = {
  Mutation,
  Query
}


const testServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  await mongoose.connect(MONGODB)
  await User.deleteMany()
  await server.executeOperation({
    query: addUserMutation,
    variables: {
      username: 'testUser',
      password: 'test'
    }
  })
  await server.executeOperation({
    query: addUserMutation,
    variables: {
      username: 'otherUser',
      password: 'test'
    }
  })
  await server.stop()
  // Unfortunately testing GraphQL queries with headers/context does not work (at least to my knowledge, I tried several methods and none of them worked)
  // Thus I cannot test if additiong without token is allowed or not. I bypass the check by hardcoding a user to the server's context
  // I will test token usage with cypress later on (at least that is the plan)
  const user = await User.findOne({ username: 'testUser' })
  if (!user || !user.id) {
    throw new Error('Failed to start server')
  }
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
    // Normally the context checks the token and sets these values if the token is valid
    context: () => { return { username: 'testUser', id: user.id as string } },
  })
  return testServer
}

export default testServer