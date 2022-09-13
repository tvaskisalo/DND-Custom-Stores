import { ApolloServer } from 'apollo-server'
import { typeDefs } from './gqlTypes'
import { resolvers } from './resolvers'
import mongoose from 'mongoose'
import { MONGODB } from './config'
import { errorHandling } from './errorHandling'
//import cors from 'cors'

mongoose.connect(MONGODB)
  .then( () => {
    console.log('Connected succesfully')
  })
  .catch((e: Error) => {
    console.log(e.message)
    console.log('error connecting')
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: errorHandling,
})


server.listen()
  .then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
  .catch(() => console.log('Failed to start'))