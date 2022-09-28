// This test expects that user_api.test.ts passes'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from '../GraphQL/gqlTypes'
import { Mutation } from '../GraphQL/mutations'
import { Query } from '../GraphQL/queries'
import { MONGODB } from '../utils/config'
import mongoose from 'mongoose'
import { User } from '../schemas/user'
import { Item } from '../schemas/item'

const addItemMutation = `mutation addItem(
  $name: String!, 
  $storepool: [String], 
  $material: String, 
  $baseCost: Int, 
  $weight: Int, 
  $properties: String, 
  $damage: String, 
  $damageTypes: [String], 
  $baseItem: Boolean!, 
  $unique: Boolean!) { 
    addItem (
      name: $name, 
      storepool: $storepool, 
      material: $material, 
      baseCost: $baseCost, 
      weight: $weight, 
      properties: $properties, 
      damage: $damage, 
      damageTypes: $damageTypes, 
      baseItem: $baseItem, 
      unique: $unique
    ) {
      name,
      storepool,
      material,
      baseCost,
      weight,
      properties,
      damage,
      damageTypes,
      baseItem,
      unique
    }
  }`

const removeItemMutation = `mutation removeItem(
  $name: String!) {
    removeItem(
      name: $name
    ) {
      name
    }
  }`

const resolvers = {
  Mutation,
  Query
}

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
      username: 'testUser',
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
  // Unfortunately testing GraphQL queries with headers/context does not work (at least to my knowledge, I tried several methods and none of them worked)
  // Thus I cannot test if additiong without token is allowed or not. I bypass the check by hardcoding a user to the server's context
  // I will test token usage with cypress later on (at least that is the plan)
  const user = await User.findOne({ username: 'testUser' })
  if (user && user.id) {
    testServer = new ApolloServer({
      typeDefs,
      resolvers,
      // Normally the context checks the token and sets these values if the token is valid
      context: () => { return { username: 'testUser', id: user.id as string } },
    })
  }
},100000)

describe('Item addition', () => {
  beforeEach(async () => {
    await Item.deleteMany()
  })

  test('Valid item can be added', async () => {
    //Valid storepools are tested elsewhere
    const item = {
      name: 'testName',
      material: 'testMaterial',
      baseCost: 100,
      weight: 10,
      properties: 'testProperties',
      damage: 'testDamage',
      damageTypes: ['testDamageType'],
      baseItem: true,
      unique: false
    }
    const result = await testServer.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addItem).toBeDefined()
  })

  test('Some fields can be empty', async () => {
    const item = {
      name: 'testName',
      baseItem: false,
      unique: true
    }
    const result = await testServer.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addItem).toBeDefined()
  })

  test('Name can not be empty', async () => {
    const item = {
      name: '',
      baseItem: false,
      unique: true
    }
    const result = await testServer.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.addItem).toEqual(null)
  })

  test('Field name must be defined', async () => {
    const item = {
      baseItem: false,
      unique: true
    }
    const result = await testServer.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
  })

  test('Field baseItem must be defined', async () => {
    const item = {
      name: 'testName',
      unique: true
    }
    const result = await testServer.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.addItem).toBeUndefined()
  })

  test('Field unique must be defined', async () => {
    const item = {
      name: 'testName',
      baseItem: false
    }
    const result = await testServer.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.addItem).toBeUndefined()
  })

  test('Name must be unique', async () => {
    const item = {
      name: 'testName',
      baseItem: false,
      unique: true
    }
    const user = await User.findOne({ username: 'testUser' })
    const newItem = new Item({ ...item, user })
    await newItem.save()

    const result = await testServer.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
  })
})

describe('Item deletion', () => {
  beforeEach(async () => {
    await Item.deleteMany()
    const item1 = {
      name: 'testName1',
      baseItem: false,
      unique: true
    }
    const item2 = {
      name: 'testName2',
      baseItem: true,
      unique: true
    }
    const item3 = {
      name: 'testName3',
      baseItem: true,
      unique: true
    }
    const otherUser = await User.findOne({ username: 'otherUser' })
    const user = await User.findOne({ username: 'testUser' })
    const newItem1 = new Item({ ...item1, user: user?.id as string })
    await newItem1.save()
    const newItem2 = new Item({ ...item2, user: user?.id as string })
    await newItem2.save()
    const newItem3 = new Item({ ...item3, user: otherUser?.id as string })
    await newItem3.save()
  })

  test('Correct item gets deleted', async () => {
    const result = await testServer.executeOperation(
      {
        query: removeItemMutation,
        variables: { name: 'testName1' }
      }
    )
    expect(result.errors).toBeUndefined()
    const items = await Item.find({})
    expect(items.length).toEqual(2)
    if (items && items[0] && items[0].name && items[1] && items[1].name) {
      expect(items[0].name).not.toEqual('testName1')
      expect(items[1].name).not.toEqual('testName1')
    }
  })

  test('User can not delete other users items', async () => {
    const result = await testServer.executeOperation(
      {
        query: removeItemMutation,
        variables: { name: 'testName3' }
      }
    )
    expect(result.errors).toBeDefined()
    const items = await Item.find({})
    expect(items.length).toEqual(3)
  })
})