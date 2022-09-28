import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from '../GraphQL/gqlTypes'
import { Mutation } from '../GraphQL/mutations'
import { Query } from '../GraphQL/queries'
import { MONGODB, SECRET } from '../utils/config'
import { User } from '../schemas/user'
import mongoose from 'mongoose'
import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'
import { toToken } from '../utils/parsers'
import { Item } from '../schemas/item'
import { Store } from '../schemas/store'

const resolvers = {
  Mutation,
  Query
}

const testServer = new ApolloServer({
  typeDefs,
  resolvers
})

beforeAll( async () => {
  await mongoose.connect(MONGODB)
},100000)

describe('Test for user addition', () => {
  beforeEach(async () => {
    await User.deleteMany()
    const passwordHash1 = await bcrypt.hash('TestPassword1', 10)
    const testUser1 = new User({ username: 'testUser1', passwordHash: passwordHash1 })
    await testUser1.save()
  }, 10000)

  test('Valid users can be added with resolver', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
      variables: {
        username: 'testName',
        password: 'test'
      }
    })
    expect(result.errors).toBeUndefined()
    //This also implies that only username is returned, no passwordHash
    expect(result.data?.addUser).toEqual({ value: 'testName' })
  })

  test('Username must be non-empty', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
      variables: {
        username: '',
        password: 'test'
      }
    })
    expect(result.errors).toBeDefined()
    if (result && result.errors && result.errors[0] && result.errors[0].message) {
      expect(result.errors[0].message).toContain('Invalid or missing string')
    }
  })

  test('Password must be non-empty', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
      variables: {
        username: 'testName',
        password: ''
      }
    })
    expect(result.errors).toBeDefined()
    if (result && result.errors && result.errors[0] && result.errors[0].message) {
      expect(result.errors[0].message).toContain('Invalid or missing string')
    }
  })
  test('Users in database is incremented by one', async () => {
    await testServer.executeOperation({
      query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
      variables: {
        username: 'testName',
        password: 'test'
      }
    })
    const users = await User.find()
    expect(users.length).toEqual(2)
  })

  test('Usernames are unique', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation addUser($username: String!, $password: String!) { addUser( username: $username, password: $password ) { value } }',
      variables: {
        username: 'testUser1',
        password: 'test'
      }
    })
    expect(result.errors).toBeDefined()
    if (result && result.errors && result.errors[0] && result.errors[0].message) {
      expect(result.errors[0].message).toContain('User validation failed:')
    }
  })
})

describe('Tests for logging in', () => {
  beforeEach(async () => {
    await User.deleteMany()
    const passwordHash1 = await bcrypt.hash('TestPassword1', 10)
    const testUser1 = new User({ username: 'testUser1', passwordHash: passwordHash1 })
    await testUser1.save()
  }, 10000)

  test('User can login with correct username and password', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation login($username: String!, $password: String!) { login ( username: $username, password: $password ) { value } }',
      variables: {
        username: 'testUser1',
        password: 'TestPassword1'
      }
    })
    expect(result.errors).toBeUndefined()
  })

  test('User login returns correct token', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation login($username: String!, $password: String!) { login ( username: $username, password: $password ) { value } }',
      variables: {
        username: 'testUser1',
        password: 'TestPassword1'
      }
    })
    expect(result.data?.login?.value).toBeDefined()
    if (result && result.data && result.data.login && result.data.login.value) {
      const decodedToken = jwt.verify(result.data.login.value as string, SECRET)
      const token = toToken(decodedToken)
      expect(token.username).toEqual('testUser1')
    }
  })

  test('User can not login with incorrect password', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation login($username: String!, $password: String!) { login ( username: $username, password: $password ) { value } }',
      variables: {
        username: 'testUser1',
        password: 'wrongPassword'
      }
    })
    expect(result.errors).toBeDefined()
    if (result && result.errors && result.errors[0] && result.errors[0].message) {
      expect(result.errors[0].message).toContain('Invalid password')
    }
  })

  test('User can not login with incorrect username', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation login($username: String!, $password: String!) { login ( username: $username, password: $password ) { value } }',
      variables: {
        username: 'wrongUsername',
        password: 'TestPassword1'
      }
    })
    expect(result.errors).toBeDefined()
    if (result && result.errors && result.errors[0] && result.errors[0].message) {
      expect(result.errors[0].message).toContain('Invalid username')
    }
  })

  test('User can not login with empty password', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation login($username: String!, $password: String!) { login ( username: $username, password: $password ) { value } }',
      variables: {
        username: 'testUser1',
        password: ''
      }
    })
    expect(result.errors).toBeDefined()
    if (result && result.errors && result.errors[0] && result.errors[0].message) {
      expect(result.errors[0].message).toContain('Invalid or missing string')
    }
  })

  test('User can not login with empty username', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation login($username: String!, $password: String!) { login ( username: $username, password: $password ) { value } }',
      variables: {
        username: '',
        password: 'TestPassword1'
      }
    })
    expect(result.errors).toBeDefined()
    if (result && result.errors && result.errors[0] && result.errors[0].message) {
      expect(result.errors[0].message).toContain('Invalid or missing string')
    }
  })

  test('User can not login with empty username and empty password', async () => {
    const result = await testServer.executeOperation({
      query: 'mutation login($username: String!, $password: String!) { login ( username: $username, password: $password ) { value } }',
      variables: {
        username: '',
        password: ''
      }
    })
    expect(result.errors).toBeDefined()
    if (result && result.errors && result.errors[0] && result.errors[0].message) {
      expect(result.errors[0].message).toContain('Invalid or missing string')
    }
  })
})

afterAll(async () => {
  //I found some undefined behavior and this should fix it
  await testServer.stop()
  await User.deleteMany()
  await Store.deleteMany()
  await Item.deleteMany()
})