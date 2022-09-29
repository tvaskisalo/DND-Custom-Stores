// This test expects that user_api.test.ts passes'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from '../GraphQL/gqlTypes'
import { Mutation } from '../GraphQL/mutations'
import { Query } from '../GraphQL/queries'
import { MONGODB } from '../utils/config'
import mongoose from 'mongoose'
import { User } from '../schemas/user'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'


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

const removeStoreMutation = `mutation removeStore(
  $name: String!) {
    removeStore(
      name: $name
    ) {
      name
    }
  }`

const updateStoreMutation = `mutation updateStore(
  $id: String!,
  $name: String,
  $itemTypeProbabilities: [ItemTypeProbabilityInput]){
    updateStore(
      id: $id,
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
  await User.deleteMany()
  await server.executeOperation({
    query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
    variables: {
      username: 'testName',
      password: 'test'
    }
  })
  await server.executeOperation({
    query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
    variables: {
      username: 'otherUser',
      password: 'test'
    }
  })
  await server.stop()
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

describe('Store deletion', () => {
  beforeEach(async () => {
    await Store.deleteMany()
    const store1 = {
      name: 'testName1',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const store2 = {
      name: 'testName2',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const store3 = {
      name: 'testName3',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const otherUser = await User.findOne({ username: 'otherUser' })
    const user = await User.findOne({ username: 'testName' })
    const newStore1 = new Store({ ...store1, user: user?.id as string })
    await newStore1.save()
    const newStore2 = new Store({ ...store2, user: user?.id as string })
    await newStore2.save()
    const newStore3 = new Store({ ...store3, user: otherUser?.id as string })
    await newStore3.save()
  })

  test('Correct store gets deleted', async () => {
    const result = await testServer.executeOperation(
      {
        query: removeStoreMutation,
        variables: { name: 'testName1' }
      }
    )
    expect(result.errors).toBeUndefined()
    const stores = await Store.find({})
    expect(stores.length).toEqual(2)
    if (stores && stores[0] && stores[0].name && stores[1] && stores[1].name) {
      expect(stores[0].name).not.toEqual('testName1')
      expect(stores[1].name).not.toEqual('testName1')
    }
  })

  test('User can not delete other users stores', async () => {
    const result = await testServer.executeOperation(
      {
        query: removeStoreMutation,
        variables: { name: 'testName3' }
      }
    )
    expect(result.errors).toBeDefined()
    const stores = await Store.find({})
    expect(stores.length).toEqual(3)
  })
})

describe('Store updating', () => {
  beforeEach(async() => {
    await Store.deleteMany()
    await Item.deleteMany()
    const store1 = {
      name: 'testName1',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const store2 = {
      name: 'testName2',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const store3 = {
      name: 'testName3',
      itemTypeProbabilities: [
        {
          rarity: 'Common',
          probability: 100
        }
      ]
    }
    const otherUser = await User.findOne({ username: 'otherUser' })
    const user = await User.findOne({ username: 'testName' })
    const newStore1 = new Store({ ...store1, user: user?.id as string })
    await newStore1.save()
    const newStore2 = new Store({ ...store2, user: user?.id as string })
    await newStore2.save()
    const newStore3 = new Store({ ...store3, user: otherUser?.id as string })
    await newStore3.save()
  })

  test('Correct update request is succesful, test 1', async () => {
    const store1 = await Store.findOne({ name: 'testName1' })
    const result = await testServer.executeOperation({
      query: updateStoreMutation,
      variables: {
        id: store1?.id as string,
        name: 'UpdatedStore',
        itemTypeProbabilities: [
          {
            rarity: 'Uncommon',
            probability: 50
          },
          {
            rarity: 'Common',
            probability: 50
          }
        ]
      }
    })
    expect(result.errors).toBeUndefined()
    if (result.data && result.data.name && result.data.itemTypeProbabilities) {
      expect(result.data.name).toEqual('UpdatedStore')
      expect(result.data.itemTypeProbabilities.length).toEqual(2)
      expect(result.data.itemTypeProbabilities[0]).toEqual({
        rarity: 'Uncommon',
        probability: 50
      })
      expect(result.data.itemTypeProbabilities[1]).toEqual({
        rarity: 'Common',
        probability: 50
      })
    }
  })

  test('Correct update request is succesful, test 2', async () => {
    const store1 = await Store.findOne({ name: 'testName1' })
    const result = await testServer.executeOperation({
      query: updateStoreMutation,
      variables: {
        id: store1?.id as string,
        itemTypeProbabilities: [
          {
            rarity: 'Uncommon',
            probability: 50
          },
          {
            rarity: 'Common',
            probability: 50
          }
        ]
      }
    })
    expect(result.errors).toBeUndefined()
    console.log(result.data)
    if (result.data && result.data.name && result.data.itemTypeProbabilities) {
      expect(result.data.name).toEqual('testName1')
      expect(result.data.itemTypeProbabilities.length).toEqual(2)
      expect(result.data.itemTypeProbabilities[0]).toEqual({
        rarity: 'Uncommon',
        probability: 50
      })
      expect(result.data.itemTypeProbabilities[1]).toEqual({
        rarity: 'Common',
        probability: 50
      })
    }
  })

  test('User cant update another users stores', async () => {
    const store3 = await Store.findOne({ name: 'testName3' })
    const result = await testServer.executeOperation({
      query: updateStoreMutation,
      variables: {
        id: store3?.id as string,
        name: 'UpdatedStore',
        itemTypeProbabilities: [
          {
            rarity: 'Uncommon',
            probability: 50
          },
          {
            rarity: 'Common',
            probability: 50
          }
        ]
      }
    })
    expect(result.errors).toBeUndefined()
    const updatedStore = await Store.findOne({ name: 'testName3' })
    expect(updatedStore?.name).toEqual('testName3')
    expect(updatedStore?.itemTypeProbabilities[0].rarity).toEqual('Common')
    expect(updatedStore?.itemTypeProbabilities[0].probability).toEqual(100)
  })

  test('User cant update with incorrect info', async () => {
    const store3 = await Store.findOne({ name: 'testName1' })
    const result = await testServer.executeOperation({
      query: updateStoreMutation,
      variables: {
        id: store3?.id as string,
        name: 'UpdatedStore',
        itemTypeProbabilities: [
          {
            rarity: 'Uncommon',
            probability: 55
          },
          {
            rarity: 'Common',
            probability: 50
          }
        ]
      }
    })
    expect(result.errors).toBeDefined()
    const updatedStore = await Store.findOne({ name: 'testName1' })
    expect(updatedStore?.name).toEqual('testName1')
    expect(updatedStore?.itemTypeProbabilities[0].rarity).toEqual('Common')
    expect(updatedStore?.itemTypeProbabilities[0].probability).toEqual(100)
  })
})



afterAll(async () => {
  //I found some undefined behavior and this should fix it
  await testServer.stop()
  await User.deleteMany()
  await Store.deleteMany()
  await Item.deleteMany()
})