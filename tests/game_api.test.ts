//TODO: Test queries and mutations related to games
import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'
import testServer from './testServer'
import { addGameMutation, removeGameMutation, updateGameMutation } from './testQueries'
import { Game } from '../schemas/game'


let server: ApolloServer

beforeAll( async () => {
  // User that is logged in has the name testName.
  // There exists another user with the name otherUser that is not logged in
  server = await testServer()
},100000)


describe('Game addition', () => {
  beforeEach(async () => {
    await Game.deleteMany()
  })

  test('Valid game can be added', async () => {
    const game = {
      name: 'testGame'
    }
    const result = await server.executeOperation(
      {
        query: addGameMutation,
        variables: { ...game }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addGame).toBeDefined()
  })

  test('Name can not be empty', async () => {
    const game = {
      name: ''
    }
    const result = await server.executeOperation(
      {
        query: addGameMutation,
        variables: { ...game }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.addGame).toEqual(null)
  })

  test('Field name must be defined', async () => {
    const game = {}
    const result = await server.executeOperation(
      {
        query: addGameMutation,
        variables: { ...game }
      }
    )
    expect(result.errors).toBeDefined()
  })

  test('Name must be unique', async () => {
    const game = {
      name: 'testGame'
    }
    const user = await User.findOne({ username: 'testUser' })
    const newGame = new Game({ ...game, user: user?.id as string })
    await newGame.save()
    const result = await server.executeOperation(
      {
        query: addGameMutation,
        variables: { ...game }
      }
    )
    expect(result.errors).toBeDefined()
  })
})

describe('Game deletion', () => {
  beforeEach(async () => {
    await Game.deleteMany()
    const game1 = {
      name: 'testGame1'
    }
    const game2 = {
      name: 'testGame2'
    }
    const otherUser = await User.findOne({ username: 'otherUser' })
    const user = await User.findOne({ username: 'testUser' })
    const newGame1 = new Game({ ...game1, user: user?.id as string })
    await newGame1.save()
    const newGame2 = new Game({ ...game2, user: otherUser?.id as string })
    await newGame2.save()
  })

  test('Correct game gets deleted', async () => {
    const result = await server.executeOperation(
      {
        query: removeGameMutation,
        variables: { name: 'testGame1' }
      }
    )
    expect(result.errors).toBeUndefined()
    const games = await Game.find({})
    expect(games.length).toBe(1)
    if (games && games[0])
      expect(games[0]?.name).toBe('testGame2')
  })

  test('User can not delete other users games', async () => {
    const result = await server.executeOperation(
      {
        query: removeGameMutation,
        variables: { name: 'testGame2' }
      }
    )
    expect(result.errors).toBeUndefined()
    const games = await Game.find({})
    expect(games.length).toEqual(2)
  })
})

describe('Game updating', () => {
  beforeEach(async () => {
    await Game.deleteMany()
    const game1 = {
      name: 'testGame1'
    }
    const game2 = {
      name: 'testGame2'
    }
    const otherUser = await User.findOne({ username: 'otherUser' })
    const user = await User.findOne({ username: 'testUser' })
    const newGame1 = new Game({ ...game1, user: user?.id as string })
    await newGame1.save()
    const newGame2 = new Game({ ...game2, user: otherUser?.id as string })
    await newGame2.save()
  })

  test('Correct update request is succesful', async () => {
    const game1 = await Game.findOne({ name: 'testGame1' })
    const result = await server.executeOperation({
      query: updateGameMutation,
      variables: {
        id: game1?.id as string,
        name: 'UpdatedGame'
      }
    })
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.updateGame
    expect(data.name).toBe('testGame1')
    const updatedGame = await Game.findOne({ name: 'UpdatedGame' })
    expect(updatedGame).not.toBe(null)
    const oldGame = await Game.findOne({ name: 'testGame1' })
    expect(oldGame).toBe(null)
    const games = await Game.find({})
    console.log(games.length)
  })

  test('User cant update another users games', async () => {
    const game2 = await Game.findOne({ name: 'testGame2' })
    const result = await server.executeOperation({
      query: updateGameMutation,
      variables: {
        id: game2?.id as string,
        name: 'UpdatedGame'
      }
    })
    expect(result.errors).toBeUndefined()
    const originalGame = await Game.findOne({ name: 'testGame2' })
    expect(originalGame).toBeDefined()
    const updatedGame = await Game.findOne({ name: 'UpdatedGame' })
    expect(updatedGame).toBe(null)
  })
})


afterAll(async () => {
  await server.stop()
  await User.deleteMany()
  await Store.deleteMany()
  await Item.deleteMany()
  await Game.deleteMany()
})