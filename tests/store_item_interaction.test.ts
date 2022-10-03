//This test assumes that store_api.test.ts, user_api.test.ts and item_api.test.ts pass

import { ApolloServer } from 'apollo-server-express'
import { Game } from '../schemas/game'
import { Item } from '../schemas/item'
import { Store } from '../schemas/store'
import { User } from '../schemas/user'
import { addItemMutation, getItemsQuery, removeStoreMutation, updateItemMutation } from './testQueries'
import testServer from './testServer'

// items 3 and 7 are owned by otherUser, rest are testUser's
const items = [
  {
    name: 'BaseItem1',
    baseItem: true,
    unique: false,
  },
  {
    name: 'BaseItem2',
    baseItem: true,
    unique: false,
  },
  {
    name: 'BaseItem3',
    baseItem: true,
    unique: false,
  },
  {
    name: 'UniqueItem1',
    baseItem: false,
    unique: true,
  },
  {
    name: 'UniqueItem2',
    baseItem: false,
    unique: true,
    storepool: ['Store1']
  },
  {
    name: 'UniqueItem3',
    baseItem: false,
    unique: true,
    storepool: ['Store1', 'Store2']
  },
  {
    name: 'UniqueItem4',
    baseItem: false,
    unique: true,
    storepool: ['Store4']
  },
]

const stores = [
  {
    name: 'Store1',
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
  },
  {
    name: 'Store2',
    itemTypeProbabilities: [
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
    ]
  },
  {
    name: 'Store3',
    itemTypeProbabilities: [
      {
        rarity: 'Common',
        probability: 100
      }
    ]
  },
  {
    name: 'Store4',
    itemTypeProbabilities: [
      {
        rarity: 'Common',
        probability: 1000
      }
    ]
  }
]

const initTest = async () => {
  await Item.deleteMany()
  await Store.deleteMany()
  const otherUser = await User.findOne({ username: 'otherUser' })
  const user = await User.findOne({ username: 'testUser' })
  const newItem1 = new Item({ ...items[0], user: user?.id as string })
  await newItem1.save()
  const newItem2 = new Item({ ...items[1], user: user?.id as string })
  await newItem2.save()
  const newItem3 = new Item({ ...items[2], user: otherUser?.id as string })
  await newItem3.save()
  const newItem4 = new Item({ ...items[3], user: user?.id as string })
  await newItem4.save()
  const newItem5 = new Item({ ...items[4], user: user?.id as string })
  await newItem5.save()
  const newItem6 = new Item({ ...items[5], user: user?.id as string })
  await newItem6.save()
  const newItem7 = new Item({ ...items[6], user: otherUser?.id as string })
  await newItem7.save()

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

describe('Item addition with storepools', () => {
  beforeEach(async () => {
    await Item.deleteMany()
    await Store.deleteMany()
  })
  test('Item with correct storepool is succesful, test 1', async () => {
    const user = await User.findOne({ username: 'testUser' })
    const newStore1 = new Store({ ...stores[0], user:user?.id as string })
    await newStore1.save()
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: {
          ...items[4]
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const addedItem = await Item.findOne({ name: 'UniqueItem2' })
    expect(addedItem).not.toBe(null)
    expect(addedItem?.storepool.length).toBe(1)
    expect(addedItem?.storepool[0]).toBe('Store1')
  })
  test('Item with correct storepool is succesful, test 2', async () => {
    const user = await User.findOne({ username: 'testUser' })
    const newStore1 = new Store({ ...stores[0], user:user?.id as string })
    await newStore1.save()
    const newStore2 = new Store({ ...stores[1], user:user?.id as string })
    await newStore2.save()
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: {
          ...items[5]
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const addedItem = await Item.findOne({ name: 'UniqueItem3' })
    expect(addedItem).not.toBe(null)
    expect(addedItem?.storepool.length).toBe(2)
    expect(['Store1', 'Store2']).toContain(addedItem?.storepool[0])
    expect(['Store1', 'Store2']).toContain(addedItem?.storepool[1])

  })
  test('Item with incorrect storepool is not added', async () => {
    const user = await User.findOne({ username: 'testUser' })
    const otherUser = await User.findOne({ username: 'otherUser' })
    const newStore1 = new Store({ ...stores[0], user:user?.id as string })
    await newStore1.save()
    const newStore4 = new Store({ ...stores[3], user:otherUser?.id as string })
    await newStore4.save()
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: {
          ...items[6]
        }
      }
    )
    expect(result.errors).toBeDefined()
    const addedItem = await Item.findOne({ name: 'UniqueItem4' })
    expect(addedItem).toBe(null)
  })
})
describe('Getting items with store name', () => {
  beforeEach(async () => {
    await initTest()
  })
  test('Correct items are returned with given store, test 1', async () => {
    const result = await server.executeOperation(
      {
        query: getItemsQuery,
        variables: {
          store: 'Store1'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.getItems
    expect(data.length).toBe(4)
    expect(['BaseItem1', 'BaseItem2', 'UniqueItem2', 'UniqueItem3']).toContain(data[0].name)
    expect(['BaseItem1', 'BaseItem2', 'UniqueItem2', 'UniqueItem3']).toContain(data[1].name)
    expect(['BaseItem1', 'BaseItem2', 'UniqueItem2', 'UniqueItem3']).toContain(data[2].name)
    expect(['BaseItem1', 'BaseItem2', 'UniqueItem2', 'UniqueItem3']).toContain(data[3].name)
  })
  test('Correct items are returned with given store, test 2', async() => {
    const result = await server.executeOperation(
      {
        query: getItemsQuery,
        variables: {
          store: 'Store2'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.getItems
    expect(data.length).toBe(3)
    expect(['BaseItem1', 'BaseItem2', 'UniqueItem3']).toContain(data[0].name)
    expect(['BaseItem1', 'BaseItem2', 'UniqueItem3']).toContain(data[1].name)
    expect(['BaseItem1', 'BaseItem2', 'UniqueItem3']).toContain(data[2].name)
  })
  test('All users items are returned if no store is specified', async () => {
    const result = await server.executeOperation(
      {
        query: getItemsQuery
      }
    )
    expect(result.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.getItems
    expect(data.length).toBe(5)
  })
  test('User cant get other users items', async () => {
    const result = await server.executeOperation(
      {
        query: getItemsQuery,
        variables: {
          store: 'Store4'
        }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.getItems).toBe(null)
  })
})
describe('Updating items with storepools', () => {
  beforeEach(async () => {
    await initTest()
  })
  test('Item can be updated with correct storepool, test 1', async () => {
    const item = await Item.findOne({ name: 'UniqueItem1' })
    const result = await server.executeOperation(
      {
        query: updateItemMutation,
        variables: {
          id: item?.id as string,
          storepool: ['Store1']
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedItem = await Item.findOne({ name: 'UniqueItem1' })
    expect(updatedItem).not.toBe(null)
    expect(updatedItem?.storepool.length).toBe(1)
    expect(updatedItem?.storepool[0]).toBe('Store1')
  })
  test('Item can be updated with correct storepool, test 2', async () => {
    const item = await Item.findOne({ name: 'UniqueItem2' })
    const result = await server.executeOperation(
      {
        query: updateItemMutation,
        variables: {
          id: item?.id as string,
          storepool: ['Store1', 'Store2']
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedItem = await Item.findOne({ name: 'UniqueItem2' })
    expect(updatedItem).not.toBe(null)
    expect(updatedItem?.storepool.length).toBe(2)
    expect(['Store1', 'Store2']).toContain(updatedItem?.storepool[0])
    expect(['Store1', 'Store2']).toContain(updatedItem?.storepool[1])
  })
  test('Items cannot have invalid storepool', async () => {
    const item = await Item.findOne({ name: 'UniqueItem1' })
    const result = await server.executeOperation(
      {
        query: updateItemMutation,
        variables: {
          id: item?.id as string,
          //Store4 is owned by otherUser not testUser
          storepool: ['Store4']
        }
      }
    )
    expect(result.errors).toBeDefined()
    const updatedItem = await Item.findOne({ name: 'UniqueItem1' })
    expect(updatedItem).not.toBe(null)
    expect(updatedItem?.storepool.length).toBe(0)
  })
  test('Stores can be removed from storepool', async () => {
    const item = await Item.findOne({ name: 'UniqueItem3' })
    const result = await server.executeOperation(
      {
        query: updateItemMutation,
        variables: {
          id: item?.id as string,
          storepool: ['Store1']
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedItem = await Item.findOne({ name: 'UniqueItem3' })
    expect(updatedItem).not.toBe(null)
    expect(updatedItem?.storepool.length).toBe(1)
  })
})
describe('Deleting stores', () => {
  beforeEach(async () => {
    await initTest()
  })
  test('When store is deleted, it is removed from storepools', async () => {
    const result = await server.executeOperation(
      {
        query: removeStoreMutation,
        variables: {
          name: 'Store1'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const uniqueItem2 = await Item.findOne({ name: 'UniqueItem2' })
    expect(uniqueItem2?.storepool.length).toBe(0)
    const uniqueItem3 = await Item.findOne({ name: 'UniqueItem3' })
    expect(uniqueItem3?.storepool.length).toBe(1)
    expect(uniqueItem3?.storepool[0]).toBe('Store2')
  })
})

afterAll(async () => {
  await server.stop()
  await User.deleteMany()
  await Store.deleteMany()
  await Item.deleteMany()
  await Game.deleteMany()
})