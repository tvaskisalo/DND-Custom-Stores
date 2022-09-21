// This test expects that user_api.test.ts passes'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from '../GraphQL/gqlTypes'
import { Mutation } from '../GraphQL/mutations'
import { Query } from '../GraphQL/queries'
import { MONGODB } from '../utils/config'
import mongoose from 'mongoose'
import { User } from '../schemas/user'
import { Store } from '../schemas/store'


const resolvers = {
  Mutation,
  Query
}

const addStoreMutation = `mutation addStore(
  $name: String!,
  $itemTypeProbabilities: [ItemTypeProbabilityInput]) {
    addStore(
      name: $name,
      itemTypeProbabilities: $itemTypeProbabilities
    ) {
      name,
      itemTypeProbabilities {
        rarity,
        probability
      }
    }
  }`

let testServer: ApolloServer


beforeAll( async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  await mongoose.connect(MONGODB)
  await server.executeOperation({
    query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
    variables: {
      username: 'testName',
      password: 'test'
    }
  })
  // Unfortunately testing GraphQL queries with headers/context does not work (at least to my knowledge, I tried several methods and none of them worked)
  // Thus I cannot test if additiong without token is allowed or not. I bypass the check by hardcoding a user to the server's context
  // I will test token usage with cypress later on (at least that is the plan)
  const user = await User.findOne({ username: 'testName' })
  if (user && user.id) {
    testServer = new ApolloServer({
      typeDefs,
      resolvers,
      // Normally the context checks the token and sets these values if the token is valid
      context: () => { return { username: 'testName', id: user.id as string } },
    })
  }
},100000)

describe('Store addition', () => {
  beforeEach( async () => {
    await Store.deleteMany()
  })

  test('Valid store can be added, test 1', async () => {
    const store = {
      name: 'testName',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const result = await testServer.executeOperation(
      {
        query: addStoreMutation,
        variables: { ...store }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addStore).toBeDefined()
  })

  test('Valid store can be added, test 2', async () => {
    const store = {
      name: 'testName',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 50
        },
        {
          rarity: 'Epic',
          probability: 50
        }
      ]
    }
    const result = await testServer.executeOperation(
      {
        query: addStoreMutation,
        variables: { ...store }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addStore).toBeDefined()
  })

  test('Store name must be defined', async () => {
    const store = {
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const result = await testServer.executeOperation(
      {
        query: addStoreMutation,
        variables: { ...store }
      }
    )
    expect(result.errors).toBeDefined()
  })

  test('Store name can not be empty', async () => {
    const store = {
      name: '',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const result = await testServer.executeOperation(
      {
        query: addStoreMutation,
        variables: { ...store }
      }
    )
    expect(result.errors).toBeDefined()
  })

  test('Store name must be unique', async () => {
    const store = {
      name: 'testName',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const user = await User.findOne({ username: 'testName' })
    const newStore = new Store({ ...store, user })
    await newStore.save()

    const result = await testServer.executeOperation({
      query: addStoreMutation,
      variables: { ...store }
    })

    expect(result.errors).toBeDefined()
  })

  test('Store itemTypeProbabilities must be defined', async () => {
    const store = {
      name: 'testName',
    }
    const result = await testServer.executeOperation(
      {
        query: addStoreMutation,
        variables: { ...store }
      }
    )
    expect(result.errors).toBeDefined()
  })

  test('Store itemTypeProbabilities can not be empty', async () => {
    const store = {
      name: 'testName',
      itemTypeProbabilities: []
    }
    const result = await testServer.executeOperation(
      {
        query: addStoreMutation,
        variables: { ...store }
      }
    )
    expect(result.errors).toBeDefined()
  })

  test('Sum of probabilies must be 100, test 1', async () => {
    const store = {
      name: 'testName',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 10
        }
      ]
    }
    const result = await testServer.executeOperation({
      query: addStoreMutation,
      variables: { ...store }
    })

    expect(result.errors).toBeDefined()
  })

  test('Sum of probabilies must be 100, test 2', async () => {
    const store = {
      name: 'testName',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 10
        },
        {
          rarity: 'Rare',
          probability: 100
        }
      ]
    }
    const result = await testServer.executeOperation({
      query: addStoreMutation,
      variables: { ...store }
    })

    expect(result.errors).toBeDefined()
  })
})