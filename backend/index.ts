import { ApolloServer, gql } from 'apollo-server'


const user = {
  username: 'test',
  password: 'test',
  id: 1
}


const typeDefs = gql`
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

const resolvers = {
  Mutation: {
    login: (root: any, args: any) => {
      console.log(args)
      if (args.username === user.username && args.password === user.password) {
        return user.username
      } else {
        return 'no'
      }
    }
  },
  Query: {
    getUser: () => user
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen()
  .then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
  .catch(() => console.log('Failed to start'))