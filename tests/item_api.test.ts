// This test expects that user_api.test.ts passes'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from '../GraphQL/gqlTypes'
import { Mutation } from '../GraphQL/mutations'
import { Query } from '../GraphQL/queries'
import { MONGODB } from '../utils/config'
import mongoose from 'mongoose'
import { User } from '../schemas/user'
import { Item } from '../schemas/item'

const addItemQuery = `mutation addItem(
  $name: String!, 
  $storePool: [String], 
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
      storePool: $storePool, 
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
      storePool,
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

describe('Test for item addition', () => {
  beforeEach(async () => {
    await Item.deleteMany()
  })
  test('Valid item can be added', async () => {
    const item = {
      name: 'testName',
      storePool: ['testStore'],
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
        query: addItemQuery,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeUndefined()
  })
})