import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './gqlTypes'
import { resolvers } from './resolvers'
import mongoose from 'mongoose'
import { MONGODB } from './config'
import { errorHandling } from './errorHandling'
import express from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'

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
  csrfPrevention: true,
  formatError: errorHandling,
})

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
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
