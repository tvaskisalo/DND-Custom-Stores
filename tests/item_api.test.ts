// This test expects that user_api.test.ts passes'
import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Item } from '../schemas/item'
import { Store } from '../schemas/store'
import { addItemMutation, getItemInfoQuery, removeItemMutation, updateItemMutation } from './testQueries'
import testServer from './testServer'
import { Game } from '../schemas/game'

let server: ApolloServer

//This is used for testing getters, updating and deleting
const initTest = async () => {
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
}

beforeAll( async () => {
  // User that is logged in has the username testUser.
  // There exists another user with the username otherUser that is not logged in
  server = await testServer()
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
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addItem).toBeDefined()
    const addedItem = await Item.findOne({})
    expect(addedItem).not.toBe(null)
    expect(addedItem?.name).toBe('testName')
  })

  test('Some fields can be empty', async () => {
    const item = {
      name: 'testName',
      baseItem: false,
      unique: true
    }
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addItem).toBeDefined()
    const addedItem = await Item.findOne({})
    expect(addedItem).not.toBe(null)
    expect(addedItem?.name).toBe('testName')
  })

  test('Name can not be empty', async () => {
    const item = {
      name: '',
      baseItem: false,
      unique: true
    }
    const result = await server.executeOperation(
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
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
  })

  test('Name must be unique is item is owned by same user', async () => {
    const item = {
      name: 'testName',
      baseItem: false,
      unique: true
    }
    const user = await User.findOne({ username: 'testUser' })
    const newItem = new Item({ ...item, user: user?.id as string })
    await newItem.save()

    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
  })
  test('Name can be duplicate if user is different', async () => {
    const item = {
      name: 'testName',
      baseItem: false,
      unique: true
    }
    const otherUser = await User.findOne({ username: 'otherUser' })
    const otherItem = new Item({ ...item, user: otherUser?.id as string })
    await otherItem.save()
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeUndefined()
    const items = await Item.find({ name: 'testName' })
    expect(items.length).toBe(2)
  })
})

describe('Iteminfo getter', () => {
  beforeEach(async() => {
    await initTest()
  })

  test('GetItemInfo return correct items', async () => {
    const result = await server.executeOperation(
      {
        query: getItemInfoQuery,
        variables: {
          name: 'testName1'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.getItemInfo.name).toBe('testName1')
  })

  test('User cant get other users item info', async () => {
    const result = await server.executeOperation(
      {
        query: getItemInfoQuery,
        variables: {
          name: 'testName3'
        }
      }
    )
    expect(result.data?.getItemInfo).toBe(null)
  })
})

describe('Item deletion', () => {
  beforeEach(async () => {
    await initTest()
  })

  test('Correct item gets deleted', async () => {
    const result = await server.executeOperation(
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
    const result = await server.executeOperation(
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

describe('Item updating', () => {
  beforeEach(async() => {
    await initTest()
  })

  test('Correct update request is succesful', async () => {
    const item1 = await Item.findOne({ name: 'testName1' })
    const result = await server.executeOperation({
      query: updateItemMutation,
      variables: {
        id: item1?.id as string,
        name: 'UpdatedItem',
        material: 'testMaterial',
        baseCost: 100,
        weight: 10,
        properties: 'testProperties',
        damage: 'testDamage',
        damageTypes: ['testDamageType'],
        baseItem: true,
        unique: false
      }
    })
    expect(result.errors).toBeUndefined()
    // For some reason this is needed here but nowhere else. I am confused
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.updateItem
    expect(data.name).toBe('testName1')
    const updatedItem = await Item.findOne({ name: 'UpdatedItem' })
    expect(updatedItem?.name).toBe('UpdatedItem')
    expect(updatedItem?.material).toEqual('testMaterial')
    expect(updatedItem?.baseCost).toEqual(100)
    expect(updatedItem?.weight).toEqual(10)
    expect(updatedItem?.properties).toEqual('testProperties')
    expect(updatedItem?.damage).toEqual('testDamage')
    expect(updatedItem?.damageTypes.length).toEqual(1)
    expect(updatedItem?.damageTypes[0]).toEqual('testDamageType')
    expect(updatedItem?.baseItem).toEqual(true)
    expect(updatedItem?.unique).toEqual(false)
    const oldItem = await Item.findOne({ name: 'testName1' })
    expect(oldItem).toBe(null)
  })

  test('User cant update another users items', async () => {
    const item3 = await Item.findOne({ name: 'testName3' })
    const result = await server.executeOperation({
      query: updateItemMutation,
      variables: {
        id: item3?.id as string,
        name: 'UpdatedItem',
        material: 'testMaterial',
        baseCost: 100,
        weight: 10,
        properties: 'testProperties',
        damage: 'testDamage',
        damageTypes: ['testDamageType'],
        baseItem: false,
        unique: false
      }
    })
    expect(result.errors).toBeUndefined()
    const originalItem = await Item.findOne({ name: 'testName3' })
    expect(originalItem?.name).toBe('testName3')
    expect(originalItem?.material).toBeUndefined()
    expect(originalItem?.baseCost).toBeUndefined()
    expect(originalItem?.weight).toBeUndefined()
    expect(originalItem?.properties).toBeUndefined()
    expect(originalItem?.damage).toBeUndefined()
    expect(originalItem?.damageTypes.length).toBe(0)
    expect(originalItem?.baseItem).toEqual(true)
    expect(originalItem?.unique).toEqual(true)
    const updatedItem = await Item.findOne({ name: 'UpdatedItem' })
    expect(updatedItem).toBe(null)
  })
  test('Name cannot be updated to duplicate name', async () => {
    const item1 = await Item.findOne({ name: 'testName1' })
    const result = await server.executeOperation(
      {
        query: updateItemMutation,
        variables:{
          id: item1?.id as string,
          name: 'testName2'
        }
      }
    )
    expect(result.errors).toBeDefined()
    const updatedItem = await Item.findOne({ name: 'testName1' })
    expect(updatedItem).not.toBe(null)
  })
  test('Name can be updated to duplicate if user is different', async () => {
    const item1 = await Item.findOne({ name: 'testName1' })
    const result = await server.executeOperation(
      {
        query: updateItemMutation,
        variables:{
          id: item1?.id as string,
          name: 'testName3'
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedItem = await Item.findOne({ name: 'testName1' })
    expect(updatedItem).toBe(null)
  })
  test('Bad fields cannot be added', async () => {
    const item1 = await Item.findOne({ name: 'testName1' })
    await server.executeOperation(
      {
        query: updateItemMutation,
        variables:{
          id: item1?.id as string,
          testField: 'testField1'
        }
      }
    )
    const updatedItem = await Item.findOne({ name: 'testName1' })
    expect(updatedItem).not.toHaveProperty('testField')
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