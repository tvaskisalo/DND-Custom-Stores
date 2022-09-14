import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './utils/gqlTypes'
import mongoose from 'mongoose'
import { MONGODB } from './utils/config'
import { errorHandling } from './utils/errorHandling'
import express from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'
import { Mutation } from './GraphQL/mutations'
import { Query } from './GraphQL/quaries'

const resolvers = {
  Mutation,
  Query
}

mongoose.connect(MONGODB)
  .then( () => {
    console.log('Connected succesfully')
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      csrfPrevention: true,
      formatError: errorHandling,
    })
    const app = express()
    app.use(cors())
    app.use(express.static('build'))
    app.get('/*', function(req,res) {
      res.sendFile(path.join(__dirname, 'build', 'index.html'))
    })
    const httpServer = http.createServer(app)
    server.start()
      .then(_s => {
        server.applyMiddleware({ app })
        try {
          httpServer.listen({ port: 4000 })
          console.log('listening on port: 4000')
        } catch (err) {
          console.log('failed to start')
        }
      })
      .catch(() => console.log('error starting server'))
  })
  .catch((e: Error) => {
    console.log(e.message)
    console.log('error connecting')
  })


