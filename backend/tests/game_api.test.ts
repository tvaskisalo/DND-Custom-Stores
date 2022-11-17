import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'
import testServer from './testServer'
import { addGameMutation, getGameInfoQuery, getGamesQuery, removeGameMutation, updateGameMutation } from './testQueries'
import { Game } from '../schemas/game'

const initTest = async () => {
  await Game.deleteMany()
  const game1 = {
    name: 'testGame1'
  }
  const game2 = {
    name: 'testGame2'
  }
  const game3 = {
    name: 'testGame3'
  }
  const otherUser = await User.findOne({ username: 'otherUser' })
  const user = await User.findOne({ username: 'testUser' })
  const newGame1 = new Game({ ...game1, user: user?.id as string })
  await newGame1.save()
  const newGame2 = new Game({ ...game2, user: user?.id as string })
  await newGame2.save()
  const newGame3 = new Game({ ...game3, user: otherUser?.id as string })
  await newGame3.save()
}

let server: ApolloServer

beforeAll( async () => {
  // User that is logged in has the username testUser.
  // There exists another user with the username otherUser that is not logged in
  server = await testServer()
}, 100000)


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
    const addedGame = await Game.findOne({ name: 'testGame' })
    expect(addedGame).not.toBe(null)
  })

  test('Games with same name can be added if user is different', async () => {
    const otherUser = await User.findOne({ username: 'otherUser' })
    const otherGame = new Game({ name: 'testGame', user: otherUser?.id as string })
    await otherGame.save()
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
    const games = await Game.find({ name: 'testGame' })
    expect(games.length).toBe(2)
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

  test('Name must be unique if game is owned by same user', async () => {
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

describe('Games getter', () => {
  beforeEach(async () => {
    await initTest()
  })

  test('Get games return correct games', async () => {
    const result = await server.executeOperation(
      {
        query: getGamesQuery,
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.getGames.length).toBe(2)
    expect(['testGame2', 'testGame1']).toContain(result.data?.getGames[0].name)
    expect(['testGame2', 'testGame1']).toContain(result.data?.getGames[1].name)
  })

  test('GetGameInfo returns correct info', async () => {
    const result = await server.executeOperation(
      {
        query: getGameInfoQuery,
        variables: {
          name: 'testGame1'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.getGameInfo.name).toBe('testGame1')
  })

  test('User cant get other users gameInfo', async () => {
    const result = await server.executeOperation(
      {
        query: getGameInfoQuery,
        variables: {
          name: 'testGame3'
        }
      }
    )
    expect(result.data?.getGameInfo).toBe(null)
  })
})

describe('Game deletion', () => {
  beforeEach(async () => {
    await initTest()
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
    expect(games.length).toBe(2)
    expect(games[0]?.name).not.toBe('testGame1')
    expect(games[1]?.name).not.toBe('testGame1')
  })

  test('User can not delete other users games', async () => {
    const result = await server.executeOperation(
      {
        query: removeGameMutation,
        variables: { name: 'testGame3' }
      }
    )
    expect(result.errors).toBeDefined()
    const games = await Game.find({})
    expect(games.length).toEqual(3)
  })
})

describe('Game updating', () => {
  beforeEach(async () => {
    await initTest()
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
  })

  test('User cant update another users games', async () => {
    const game3 = await Game.findOne({ name: 'testGame3' })
    const result = await server.executeOperation({
      query: updateGameMutation,
      variables: {
        id: game3?.id as string,
        name: 'UpdatedGame'
      }
    })
    expect(result.errors).toBeUndefined()
    const originalGame = await Game.findOne({ name: 'testGame3' })
    expect(originalGame).toBeDefined()
    const updatedGame = await Game.findOne({ name: 'UpdatedGame' })
    expect(updatedGame).toBe(null)
  })

  test('Name cannot be updated to duplicate name', async () => {
    const game1 = await Game.findOne({ name: 'testGame1' })
    const result = await server.executeOperation(
      {
        query: updateGameMutation,
        variables:{
          id: game1?.id as string,
          name: 'testGame2'
        }
      }
    )
    expect(result.errors).toBeDefined()
    const updatedGame = await Game.findOne({ name: 'testGame1' })
    expect(updatedGame).not.toBe(null)
  })

  test('Name can be updated to duplicate if user is different', async () => {
    const game1 = await Game.findOne({ name: 'testGame1' })
    const result = await server.executeOperation(
      {
        query: updateGameMutation,
        variables:{
          id: game1?.id as string,
          name: 'testGame3'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedGame = await Game.findOne({ name: 'testGame1' })
    expect(updatedGame).toBe(null)
  })
  test('Bad fields cannot be added', async () => {
    const game1 = await Game.findOne({ name: 'testGame1' })
    await server.executeOperation(
      {
        query: updateGameMutation,
        variables:{
          id: game1?.id as string,
          testField: 'testField1'
        }
      }
    )
    const updatedGame = await Game.findOne({ name: 'testGame1' })
    expect(updatedGame).not.toHaveProperty('testField')
  })
})


afterAll(async () => {
  await server.stop()
  await User.deleteMany()
  await Store.deleteMany()
  await Item.deleteMany()
  await Game.deleteMany()
})