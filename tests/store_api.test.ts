// This test expects that user_api.test.ts passes'
import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'
import { addStoreMutation, getStoreInfoQuery, removeStoreMutation, updateStoreMutation } from './testQueries'
import testServer from './testServer'
import { Game } from '../schemas/game'

let server: ApolloServer

//This is used for testing getters, updating and deleting
const initTest = async () => {
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
  const user = await User.findOne({ username: 'testUser' })
  const newStore1 = new Store({ ...store1, user: user?.id as string })
  await newStore1.save()
  const newStore2 = new Store({ ...store2, user: user?.id as string })
  await newStore2.save()
  const newStore3 = new Store({ ...store3, user: otherUser?.id as string })
  await newStore3.save()
}

beforeAll( async () => {
  server = await testServer()
},100000)

describe('Store addition', () => {
  beforeEach( async () => {
  // User that is logged in has the name testName.
  // There exists another user with the name otherUser that is not logged in
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
    const result = await server.executeOperation(
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
    const result = await server.executeOperation(
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
    const result = await server.executeOperation(
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
    const result = await server.executeOperation(
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
    const newStore = new Store({ ...store, user: user?.id as string })
    await newStore.save()

    const result = await server.executeOperation({
      query: addStoreMutation,
      variables: { ...store }
    })

    expect(result.errors).toBeDefined()
  })

  test('Store itemTypeProbabilities must be defined', async () => {
    const store = {
      name: 'testName',
    }
    const result = await server.executeOperation(
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
    const result = await server.executeOperation(
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
    const result = await server.executeOperation({
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
    const result = await server.executeOperation({
      query: addStoreMutation,
      variables: { ...store }
    })

    expect(result.errors).toBeDefined()
  })
})

describe('Store getter', () => {
  beforeEach(async () => {
    await initTest()
  })

  test('GetStoreInfo return correct info', async () => {
    const result = await server.executeOperation(
      {
        query: getStoreInfoQuery,
        variables: {
          name: 'testName1'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.getStoreInfo.name).toBe('testName1')
    expect(result.data?.getStoreInfo.itemTypeProbabilities.length).toBe(1)
    expect(result.data?.getStoreInfo.itemTypeProbabilities[0].rarity).toBe('Common')
    expect(result.data?.getStoreInfo.itemTypeProbabilities[0].probability).toBe(100)
  })

  test('User cant get other users store info', async () => {
    const result = await server.executeOperation(
      {
        query: getStoreInfoQuery,
        variables: {
          name: 'testName3'
        }
      }
    )
    expect(result.data?.getStoreInfo).toBe(null)
  })
})


describe('Store deletion', () => {
  beforeEach(async () => {
    await initTest()
  })

  test('Correct store gets deleted', async () => {
    const result = await server.executeOperation(
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
    const result = await server.executeOperation(
      {  //I found some undefined behavior and this should fix it
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
    await initTest()
  })

  test('Correct update request is succesful, test 1', async () => {
    const store1 = await Store.findOne({ name: 'testName1' })
    const result = await server.executeOperation({
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
    expect(result.data).toBeDefined()
    const updatedStore = await Store.findOne({ name: 'UpdatedStore' })
    expect(updatedStore?.name).toEqual('UpdatedStore')
    expect(updatedStore?.itemTypeProbabilities.length).toEqual(2)
    expect(updatedStore?.itemTypeProbabilities[0].rarity).toEqual('Uncommon')
    expect(updatedStore?.itemTypeProbabilities[0].probability).toEqual(50)
    expect(updatedStore?.itemTypeProbabilities[1].rarity).toEqual('Common')
    expect(updatedStore?.itemTypeProbabilities[1].probability).toEqual(50)
    const oldStore = await Store.findOne({ name: 'testName1' })
    expect(oldStore).toBe(null)
  })

  test('Correct update request is succesful, test 2', async () => {
    const store1 = await Store.findOne({ name: 'testName1' })
    const result = await server.executeOperation({
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
    const updatedStore = await Store.findOne({ name: 'testName1' })
    expect(updatedStore?.name).toEqual('testName1')
    expect(updatedStore?.itemTypeProbabilities.length).toEqual(2)
    expect(updatedStore?.itemTypeProbabilities[0].rarity).toEqual('Uncommon')
    expect(updatedStore?.itemTypeProbabilities[0].probability).toEqual(50)
    expect(updatedStore?.itemTypeProbabilities[1].rarity).toEqual('Common')
    expect(updatedStore?.itemTypeProbabilities[1].probability).toEqual(50)
  })

  test('User cant update another users stores', async () => {
    const store3 = await Store.findOne({ name: 'testName3' })
    const result = await server.executeOperation({
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
    const originalStore = await Store.findOne({ name: 'testName3' })
    expect(originalStore?.name).toEqual('testName3')
    expect(originalStore?.itemTypeProbabilities[0].rarity).toEqual('Common')
    expect(originalStore?.itemTypeProbabilities[0].probability).toEqual(100)
    const updatedStore = await Store.findOne({ name: 'UpdatedStore' })
    expect(updatedStore).toBe(null)
  })

  test('User cant update with incorrect info', async () => {
    const store3 = await Store.findOne({ name: 'testName1' })
    const result = await server.executeOperation({
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
  await server.stop()
  await User.deleteMany()
  await Store.deleteMany()
  await Item.deleteMany()
  await Game.deleteMany()
})