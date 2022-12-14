//This test assumes that game_api.test.ts, user_api.test.ts and store_api.test.ts pass
import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'
import { Game } from '../schemas/game'
import testServer from './testServer'
import { addStoreMutation, getStoresQuery, removeGameMutation, updateStoreMutation } from './testQueries'

const games = [
  {
    name: 'Game1'
  },
  {
    name: 'Game2'
  },
  {
    name: 'Game3'
  }
]

const stores = [
  {
    name: 'Store1',
    itemRarityProbabilities: [
      {
        rarity: 'Uncommon',
        probability: 50
      },
      {
        rarity: 'Common',
        probability: 50
      }
    ]
  },
  {
    name: 'Store2',
    itemRarityProbabilities: [
      {
        rarity: 'Uncommon',
        probability: 34
      },
      {
        rarity: 'Common',
        probability: 33
      },
      {
        rarity: 'Rare',
        probability: 33
      }
    ],
    games: ['Game1']
  },
  {
    name: 'Store3',
    itemRarityProbabilities: [
      {
        rarity: 'Common',
        probability: 100
      }
    ],
    games: ['Game1', 'Game2']
  },
  {
    name: 'Store4',
    itemRarityProbabilities: [
      {
        rarity: 'Common',
        probability: 1000
      }
    ],
    games: ['Game3']
  }
]

//This is used for testing getters, updating and deleting
const initTest = async () => {
  await Store.deleteMany()
  await Game.deleteMany()
  const otherUser = await User.findOne({ username: 'otherUser' })
  const user = await User.findOne({ username: 'testUser' })
  const newGame1 = new Game({ ...games[0], user: user?.id as string })
  await newGame1.save()
  const newGame2 = new Game({ ...games[1], user: user?.id as string })
  await newGame2.save()
  const newGame3 = new Game({ ...games[2], user: otherUser?.id as string })
  await newGame3.save()

  const newStore1 = new Store({ ...stores[0], user: user?.id as string })
  await newStore1.save()
  const newStore2 = new Store({ ...stores[1], user: user?.id as string })
  await newStore2.save()
  const newStore3 = new Store({ ...stores[2], user: user?.id as string })
  await newStore3.save()
  const newStore4 = new Store({ ...stores[3], user: otherUser?.id as string })
  await newStore4.save()
}

let server: ApolloServer

beforeAll(async () => {
  server = await testServer()
}, 100000)

describe('Store adding with games', () => {
  beforeEach(async () => {
    await Game.deleteMany()
    await Store.deleteMany()
  })

  test('Store with refrences to games is succesful with correct info, test 1', async() => {
    const user = await User.findOne({ username: 'testUser' })
    const newGame1 = new Game({ ...games[0], user: user?.id as string })
    await newGame1.save()
    const result = await server.executeOperation(
      {
        query: addStoreMutation,
        variables: {
          ...stores[1]
        }
      }
    )
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.addStore
    expect(data.name).toBe('Store2')
    expect(data.games.length).toBe(1)
    expect(data.games[0]).toBe('Game1')
    const addedStore = await Store.findOne({ name: 'Store2' })
    expect(addedStore?.name).toBe('Store2')
    expect(addedStore?.games.length).toBe(1)
    expect(addedStore?.games[0]).toBe('Game1')
  })
  test('Store with refrences to games is succesful with correct info, test 2', async() => {
    const user = await User.findOne({ username: 'testUser' })
    const newGame1 = new Game({ ...games[0], user: user?.id as string })
    await newGame1.save()
    const newGame2 = new Game({ ...games[1], user: user?.id as string })
    await newGame2.save()
    const result = await server.executeOperation(
      {
        query: addStoreMutation,
        variables: {
          ...stores[2]
        }
      }
    )
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.addStore
    expect(data.name).toBe('Store3')
    expect(data.games.length).toBe(2)
    expect(['Game1', 'Game2']).toContain(data.games[0])
    expect(['Game1', 'Game2']).toContain(data.games[1])
    const addedStore = await Store.findOne({ name: 'Store3' })
    expect(addedStore?.name).toBe('Store3')
    expect(addedStore?.games.length).toBe(2)
    expect(['Game1', 'Game2']).toContain(addedStore?.games[0])
    expect(['Game1', 'Game2']).toContain(addedStore?.games[1])
  })
  test('Store with incorrect games fails', async () => {
    const user = await User.findOne({ username: 'testUser' })
    const otherUser = await User.findOne({ username: 'otherUser' })
    const newGame1 = new Game({ ...games[0], user: user?.id as string })
    await newGame1.save()
    const newGame3 = new Game({ ...games[2], user: otherUser?.id as string })
    await newGame3.save()
    const result = await server.executeOperation(
      {
        query: addStoreMutation,
        variables: {
          ...stores[3]
        }
      }
    )
    expect(result.errors).toBeDefined()
    const addedStore = await Store.findOne({ name: 'Store4' })
    expect(addedStore).toBe(null)
  })
})
describe('Getting stores with game name', () => {
  beforeEach(async () => {
    await initTest()
  })
  test('Correct stores are returned with given game, test 1', async () => {
    const result = await server.executeOperation(
      {
        query: getStoresQuery,
        variables: {
          game: 'Game1'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.getStores
    expect(data.length).toBe(2)
    expect(['Store2', 'Store3']).toContain(data[0].name)
    expect(['Store2', 'Store3']).toContain(data[1].name)
  })

  test('Correct stores are returned with given game, test 2', async () => {
    const result = await server.executeOperation(
      {
        query: getStoresQuery,
        variables: {
          game: 'Game2'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.getStores
    expect(data.length).toBe(1)
    expect(data[0].name).toBe('Store3')
  })

  test('All users stores are returned if no game is specified', async () => {
    const result = await server.executeOperation(
      {
        query: getStoresQuery
      }
    )
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.getStores
    expect(data.length).toBe(3)
    expect(['Store1', 'Store2', 'Store3']).toContain(data[0].name)
    expect(['Store1', 'Store2', 'Store3']).toContain(data[1].name)
    expect(['Store1', 'Store2', 'Store3']).toContain(data[2].name)
  })
  test('User cant get other users stores', async () => {
    // This should return all logged in user's stores, not otherUser's stores that refrence Game3
    const result = await server.executeOperation(
      {
        query: getStoresQuery,
        variables: {
          game: 'Game3'
        }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.getStores).toBe(null)
  })
})
describe('Updating stores with games', () => {
  beforeEach(async () => {
    await initTest()
  })
  test('Store can be updated with correct games, test 1', async() => {
    const store = await Store.findOne({ name: 'Store1' })
    const result = await server.executeOperation(
      {
        query: updateStoreMutation,
        variables: {
          id: store?.id as string,
          games: ['Game1', 'Game2']
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedStore = await Store.findOne({ name: 'Store1' })
    expect(updatedStore).not.toBe(null)
    expect(updatedStore?.games.length).toBe(2)
    expect(['Game1', 'Game2']).toContain(updatedStore?.games[0])
    expect(['Game1', 'Game2']).toContain(updatedStore?.games[0])
  })
  test('Store can be updated with correct games, test 2', async() => {
    const store = await Store.findOne({ name: 'Store2' })
    const result = await server.executeOperation(
      {
        query: updateStoreMutation,
        variables: {
          id: store?.id as string,
          games: ['Game1', 'Game2']
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedStore = await Store.findOne({ name: 'Store2' })
    expect(updatedStore).not.toBe(null)
    expect(updatedStore?.games.length).toBe(2)
    expect(['Game1', 'Game2']).toContain(updatedStore?.games[0])
    expect(['Game1', 'Game2']).toContain(updatedStore?.games[0])
  })

  test('Stores cannot have invalid games', async () => {
    const store = await Store.findOne({ name: 'Store1' })
    const result = await server.executeOperation(
      {
        query: updateStoreMutation,
        variables: {
          id: store?.id as string,
          //Current user should not have Game3
          games: ['Game3']
        }
      }
    )
    expect(result.errors).toBeDefined()
    const updatedStore = await Store.findOne({ name: 'Store1' })
    expect(updatedStore).not.toBe(null)
    expect(updatedStore?.games.length).toBe(0)
  })

  test('Games can be removed from stores', async () => {
    const store = await Store.findOne({ name: 'Store3' })
    const result = await server.executeOperation(
      {
        query: updateStoreMutation,
        variables: {
          id: store?.id as string,
          games: ['Game1']
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedStore = await Store.findOne({ name: 'Store2' })
    expect(updatedStore).not.toBe(null)
    expect(updatedStore?.games.length).toBe(1)
    expect(updatedStore?.games[0]).toBe('Game1')
  })
})
describe('Deleting games', () => {
  beforeEach(async () => {
    await initTest()
  })
  test('When user deletes a game, refrences to the game are removed', async() => {
    const result = await server.executeOperation(
      {
        query: removeGameMutation,
        variables: {
          name: 'Game1'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const store2 = await Store.findOne({ name: 'Store2' })
    expect(store2?.games).not.toContain('Game1')
    const store3 = await Store.findOne({ name: 'Store3' })
    expect(store3?.games).not.toContain('Game1')
  })
})


afterAll(async () => {
  await server.stop()
  await User.deleteMany()
  await Store.deleteMany()
  await Item.deleteMany()
  await Game.deleteMany()
})