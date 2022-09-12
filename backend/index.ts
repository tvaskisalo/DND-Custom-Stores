import { ApolloServer } from 'apollo-server'
import { typeDefs } from './gqlTypes'
import { resolvers } from './resolvers'
import mongoose from 'mongoose'
import { MONGODB } from './config'
import cors from 'cors'

mongoose.connect(MONGODB)
  .then( () => {
    console.log('Connected succesfully')
  })
  .catch(() => {
    console.log('error connecting')
  })

const server = new ApolloServer({
  typeDefs,
  resolvers
})
server.applyMiddleware(cors())

server.listen()
  .then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
  .catch(() => console.log('Failed to start'))